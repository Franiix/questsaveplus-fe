import type { FriendshipStatus } from '@/shared/entities/Friendship.entity';

export type PublicProfileModel = {
 id: string;
 username: string;
 avatar_url: string | null;
 full_name: string;
 created_at: string;
};

export type FriendshipModel = {
 id: string;
 friend: PublicProfileModel;
 status: FriendshipStatus;
 isOutgoing: boolean;
 accepted_at: string | null;
};

export type SearchResultModel = PublicProfileModel & {
 friendshipStatus: 'none' | 'pending_incoming' | 'pending_outgoing' | 'friend';
 friendshipId?: string;
};
