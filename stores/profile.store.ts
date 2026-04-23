import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { CreateProfileDto, UpdateProfileDto } from '@/shared/dto/Profile.dto';
import { type ProfileModel, toProfileModel } from '@/shared/models/Profile.model';

type ProfileFetchMode = 'bootstrap' | 'refresh';

interface ProfileState {
 profile: ProfileModel | null;
 currentUserId: string | null;
 hasResolvedProfile: boolean;
 isBootstrapping: boolean;
 isLoading: boolean;
 error: string | null;
 ensureProfile: (userId: string) => Promise<void>;
 fetchProfile: (
  userId: string,
  options?: { force?: boolean; mode?: ProfileFetchMode },
 ) => Promise<void>;
 createProfile: (dto: CreateProfileDto) => Promise<void>;
 updateProfile: (userId: string, dto: UpdateProfileDto) => Promise<void>;
 clearProfile: () => void;
 clearError: () => void;
}

const inFlightProfileFetches = new Map<string, Promise<void>>();

function shouldSkipProfileFetch(
 state: Pick<ProfileState, 'currentUserId' | 'hasResolvedProfile'>,
 userId: string,
 force: boolean,
) {
 if (force) return false;
 return state.currentUserId === userId && state.hasResolvedProfile;
}

export const useProfileStore = create<ProfileState>(
 (set, get): ProfileState => ({
  profile: null,
  currentUserId: null,
  hasResolvedProfile: false,
  isBootstrapping: false,
  isLoading: false,
  error: null,

  ensureProfile: async (userId) => {
   await get().fetchProfile(userId, { mode: 'bootstrap' });
  },

  fetchProfile: async (userId, options) => {
   const force = options?.force ?? false;
   const mode = options?.mode ?? 'refresh';

   if (shouldSkipProfileFetch(get(), userId, force)) {
    return;
   }

   const existingRequest = inFlightProfileFetches.get(userId);
   if (existingRequest) {
    await existingRequest;
    return;
   }

   const fetchPromise = (async () => {
    set((state) => ({
     isLoading: true,
     isBootstrapping: mode === 'bootstrap',
     error: null,
     currentUserId: userId,
     hasResolvedProfile:
      mode === 'bootstrap' ? false : state.hasResolvedProfile && state.currentUserId === userId,
    }));

    const { data, error } = await supabase
     .from('profiles')
     .select('*')
     .eq('id', userId)
     .maybeSingle();

    if (error) {
     set({
      isLoading: false,
      isBootstrapping: false,
      error: error.message,
      currentUserId: userId,
      hasResolvedProfile: true,
     });
     return;
    }

    set({
     isLoading: false,
     isBootstrapping: false,
     currentUserId: userId,
     hasResolvedProfile: true,
     profile: data ? toProfileModel(data) : null,
    });
   })();

   inFlightProfileFetches.set(userId, fetchPromise);

   try {
    await fetchPromise;
   } finally {
    inFlightProfileFetches.delete(userId);
   }
  },

  createProfile: async (dto) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.from('profiles').insert(dto);

   if (error) {
    set({ isLoading: false, error: error.message });
    return;
   }

   await get().fetchProfile(dto.id, { force: true, mode: 'refresh' });
  },

  updateProfile: async (userId, dto) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.from('profiles').update(dto).eq('id', userId);

   if (error) {
    set({ isLoading: false, error: error.message });
    return;
   }

   await get().fetchProfile(userId, { force: true, mode: 'refresh' });
  },

  clearProfile: () =>
   set({
    profile: null,
    currentUserId: null,
    hasResolvedProfile: false,
    isBootstrapping: false,
    error: null,
    isLoading: false,
   }),
  clearError: () => set({ error: null }),
 }),
);
