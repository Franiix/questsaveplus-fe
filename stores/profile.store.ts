import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { CreateProfileDto, UpdateProfileDto } from '@/shared/dto/Profile.dto';
import { type ProfileModel, toProfileModel } from '@/shared/models/Profile.model';

interface ProfileState {
 profile: ProfileModel | null;
 currentUserId: string | null;
 hasResolvedProfile: boolean;
 isLoading: boolean;
 error: string | null;
 fetchProfile: (userId: string) => Promise<void>;
 createProfile: (dto: CreateProfileDto) => Promise<void>;
 updateProfile: (userId: string, dto: UpdateProfileDto) => Promise<void>;
 clearProfile: () => void;
 clearError: () => void;
}

export const useProfileStore = create<ProfileState>(
 (set, get): ProfileState => ({
 profile: null,
  currentUserId: null,
  hasResolvedProfile: false,
  isLoading: false,
  error: null,

  fetchProfile: async (userId) => {
   set({
    isLoading: true,
    error: null,
    currentUserId: userId,
    hasResolvedProfile: false,
   });
   const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

   if (error) {
    set({
     isLoading: false,
     error: error.message,
     currentUserId: userId,
     hasResolvedProfile: true,
    });
    return;
   }

   set({
    isLoading: false,
    currentUserId: userId,
    hasResolvedProfile: true,
    profile: data ? toProfileModel(data) : null,
   });
  },

  createProfile: async (dto) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.from('profiles').insert(dto);

   if (error) {
    set({ isLoading: false, error: error.message });
    return;
   }

   await get().fetchProfile(dto.id);
  },

  updateProfile: async (userId, dto) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.from('profiles').update(dto).eq('id', userId);

   if (error) {
    set({ isLoading: false, error: error.message });
    return;
   }

   await get().fetchProfile(userId);
  },

  clearProfile: () =>
   set({
    profile: null,
    currentUserId: null,
    hasResolvedProfile: false,
    error: null,
    isLoading: false,
   }),
  clearError: () => set({ error: null }),
 }),
);
