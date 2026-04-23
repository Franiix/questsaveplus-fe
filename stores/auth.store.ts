import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useBacklogStore } from '@/stores/backlog.store';
import { useProfileStore } from '@/stores/profile.store';

const authEmailRedirectTo = Linking.createURL('auth/callback');

interface AuthState {
 session: Session | null;
 sessionOrigin: 'restored' | 'interactive' | null;
 isLoading: boolean;
 error: string | null;
 initialize: () => () => void;
 signIn: (email: string, password: string) => Promise<void>;
 signUp: (email: string, password: string) => Promise<void>;
 signOut: () => Promise<void>;
 resetPassword: (email: string) => Promise<void>;
 updateEmail: (newEmail: string) => Promise<void>;
 updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
 deleteAccount: (confirmation: string) => Promise<boolean>;
 clearError: () => void;
}

export const useAuthStore = create<AuthState>(
 (set, get): AuthState => ({
  session: null,
  sessionOrigin: null,
  isLoading: true,
  error: null,

  initialize: () => {
   supabase.auth
    .getSession()
    .then(({ data: { session } }) => {
     set({
      session,
      sessionOrigin: session ? 'restored' : null,
      isLoading: false,
      error: null,
     });
    })
    .catch((error: unknown) => {
     const message = error instanceof Error ? error.message : 'auth_initialize_failed';
     set({
      session: null,
      sessionOrigin: null,
      isLoading: false,
      error: message,
     });
    });
   const {
    data: { subscription },
   } = supabase.auth.onAuthStateChange((event, session) => {
    set({
     session,
     sessionOrigin:
      event === 'INITIAL_SESSION' ? (session ? 'restored' : null) : session ? 'interactive' : null,
     isLoading: false,
    });
   });
   return () => subscription.unsubscribe();
  },

  signIn: async (email, password) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.auth.signInWithPassword({ email, password });
   if (error) {
    set({ isLoading: false, error: error.message });
   }
  },

  signUp: async (email, password) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
     emailRedirectTo: authEmailRedirectTo,
    },
   });
   set({ isLoading: false, error: error ? error.message : null });
  },

  signOut: async () => {
   set({ isLoading: true, error: null, sessionOrigin: null });
   await supabase.auth.signOut();
  },

  resetPassword: async (email) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.auth.resetPasswordForEmail(email);
   set({ isLoading: false, error: error ? error.message : null });
  },

  updateEmail: async (newEmail) => {
   set({ isLoading: true, error: null });
   const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: authEmailRedirectTo },
   );
   set({ isLoading: false, error: error ? error.message : null });
  },

  updatePassword: async (currentPassword, newPassword) => {
   set({ isLoading: true, error: null });
   const session = get().session;
   if (!session?.user?.email) {
    set({ isLoading: false, error: 'no_session' });
    return;
   }
   // Verifica la password attuale prima di aggiornarla
   const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password: currentPassword,
   });
   if (verifyError) {
    set({ isLoading: false, error: 'wrong_password' });
    return;
   }
   const { error } = await supabase.auth.updateUser({ password: newPassword });
   set({ isLoading: false, error: error ? error.message : null });
  },

  deleteAccount: async (confirmation) => {
   set({ isLoading: true, error: null });

   const { data, error } = await supabase.functions.invoke<{ success: boolean }>('delete-account', {
    body: { confirmation },
   });

   if (error || !data?.success) {
    set({
     isLoading: false,
     error: error?.message ?? 'delete_account_failed',
    });
    return false;
   }

   useBacklogStore.getState().clearBacklog();
   useProfileStore.getState().clearProfile();
   await supabase.auth.signOut();

   set({
    session: null,
    sessionOrigin: null,
    isLoading: false,
    error: null,
   });

   return true;
  },

  clearError: () => set({ error: null }),
 }),
);
