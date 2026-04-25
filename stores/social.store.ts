import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type {
 FriendshipModel,
 PublicProfileModel,
 SearchResultModel,
} from '@/shared/models/Social.model';

type RawProfileJoin = {
 id: string;
 username: string;
 avatar_url: string | null;
 first_name: string;
 last_name: string;
 created_at: string;
};

type RawFriendship = {
 id: string;
 accepted_at: string | null;
 status: string;
 requester_id: string;
 recipient_id: string;
 requester: RawProfileJoin;
 recipient: RawProfileJoin;
};

function toPublicProfile(raw: RawProfileJoin): PublicProfileModel {
 return {
  id: raw.id,
  username: raw.username,
  avatar_url: raw.avatar_url,
  full_name: `${raw.first_name} ${raw.last_name}`,
  created_at: raw.created_at,
 };
}

function toFriendshipModel(raw: RawFriendship, currentUserId: string): FriendshipModel {
 const isOutgoing = raw.requester_id === currentUserId;
 const friendRaw = isOutgoing ? raw.recipient : raw.requester;
 return {
  id: raw.id,
  friend: toPublicProfile(friendRaw),
  status: raw.status as FriendshipModel['status'],
  isOutgoing,
  accepted_at: raw.accepted_at,
 };
}

const FRIENDSHIP_SELECT = `
 id, accepted_at, status, requester_id, recipient_id,
 requester:profiles!requester_id(id, username, avatar_url, first_name, last_name, created_at),
 recipient:profiles!recipient_id(id, username, avatar_url, first_name, last_name, created_at)
`;

interface SocialState {
 friends: FriendshipModel[];
 pendingIncoming: FriendshipModel[];
 pendingOutgoing: FriendshipModel[];
 searchResults: SearchResultModel[];
 isLoadingFriends: boolean;
 isSearching: boolean;
 error: string | null;
 loadFriends: (userId: string) => Promise<void>;
 loadPendingRequests: (userId: string) => Promise<void>;
 searchUsers: (query: string, currentUserId: string) => Promise<void>;
 sendRequest: (recipientId: string, currentUserId: string) => Promise<void>;
 acceptRequest: (friendshipId: string) => Promise<void>;
 rejectRequest: (friendshipId: string) => Promise<void>;
 removeFriend: (friendshipId: string) => Promise<void>;
 revokeRequest: (friendshipId: string, currentUserId: string) => Promise<void>;
 clearSearch: () => void;
 clearError: () => void;
}

export const useSocialStore = create<SocialState>(
 (set, get): SocialState => ({
  friends: [],
  pendingIncoming: [],
  pendingOutgoing: [],
  searchResults: [],
  isLoadingFriends: false,
  isSearching: false,
  error: null,

  loadFriends: async (userId) => {
   set({ isLoadingFriends: true, error: null });

   const { data, error } = await supabase
    .from('friendships')
    .select(FRIENDSHIP_SELECT)
    .eq('status', 'ACCEPTED')
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

   if (error) {
    set({ isLoadingFriends: false, error: error.message });
    return;
   }

   const friends = (data as unknown as RawFriendship[]).map((row) =>
    toFriendshipModel(row, userId),
   );
   set({ isLoadingFriends: false, friends });
  },

  loadPendingRequests: async (userId) => {
   const { data, error } = await supabase
    .from('friendships')
    .select(FRIENDSHIP_SELECT)
    .eq('status', 'PENDING')
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

   if (error) {
    set({ error: error.message });
    return;
   }

   const models = (data as unknown as RawFriendship[]).map((row) => toFriendshipModel(row, userId));
   set({
    pendingIncoming: models.filter((m) => !m.isOutgoing),
    pendingOutgoing: models.filter((m) => m.isOutgoing),
   });
  },

  searchUsers: async (query, currentUserId) => {
   if (query.trim().length < 2) {
    set({ searchResults: [] });
    return;
   }

   set({ isSearching: true });

   const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, first_name, last_name, created_at')
    .ilike('username', `%${query.trim()}%`)
    .neq('id', currentUserId)
    .limit(20);

   if (error || !data) {
    set({ isSearching: false, searchResults: [] });
    return;
   }

   const { friends, pendingIncoming, pendingOutgoing } = get();
   const friendMap = new Map(friends.map((f) => [f.friend.id, f.id]));
   const incomingMap = new Map(pendingIncoming.map((f) => [f.friend.id, f.id]));
   const outgoingMap = new Map(pendingOutgoing.map((f) => [f.friend.id, f.id]));

   const results: SearchResultModel[] = (data as RawProfileJoin[]).map((p) => {
    const profile = toPublicProfile(p);
    if (friendMap.has(p.id)) {
     return { ...profile, friendshipStatus: 'friend' as const, friendshipId: friendMap.get(p.id) };
    }
    if (incomingMap.has(p.id)) {
     return {
      ...profile,
      friendshipStatus: 'pending_incoming' as const,
      friendshipId: incomingMap.get(p.id),
     };
    }
    if (outgoingMap.has(p.id)) {
     return {
      ...profile,
      friendshipStatus: 'pending_outgoing' as const,
      friendshipId: outgoingMap.get(p.id),
     };
    }
    return { ...profile, friendshipStatus: 'none' as const };
   });

   set({ isSearching: false, searchResults: results });
  },

  sendRequest: async (recipientId, currentUserId) => {
   set({ error: null });

   const { error } = await supabase
    .from('friendships')
    .insert({ requester_id: currentUserId, recipient_id: recipientId, status: 'PENDING' });

   if (error) {
    set({ error: error.message });
    return;
   }

   set((state) => ({
    searchResults: state.searchResults.map((r) =>
     r.id === recipientId ? { ...r, friendshipStatus: 'pending_outgoing' as const } : r,
    ),
   }));

   await get().loadPendingRequests(currentUserId);
  },

  acceptRequest: async (friendshipId) => {
   set({ error: null });

   const { error } = await supabase
    .from('friendships')
    .update({ status: 'ACCEPTED', accepted_at: new Date().toISOString() })
    .eq('id', friendshipId);

   if (error) {
    set({ error: error.message });
   }
  },

  rejectRequest: async (friendshipId) => {
   set({ error: null });

   const { error } = await supabase
    .from('friendships')
    .update({ status: 'REJECTED' })
    .eq('id', friendshipId);

   if (error) {
    set({ error: error.message });
   }
  },

  removeFriend: async (friendshipId) => {
   set({ error: null });

   const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);

   if (error) {
    set({ error: error.message });
    return;
   }

   set((state) => ({
    friends: state.friends.filter((f) => f.id !== friendshipId),
   }));
  },

  revokeRequest: async (friendshipId, currentUserId) => {
   set({ error: null });

   const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);

   if (error) {
    set({ error: error.message });
    return;
   }

   set((state) => ({
    searchResults: state.searchResults.map((r) =>
     r.friendshipId === friendshipId
      ? { ...r, friendshipStatus: 'none' as const, friendshipId: undefined }
      : r,
    ),
   }));

   await get().loadPendingRequests(currentUserId);
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),

  clearError: () => set({ error: null }),
 }),
);
