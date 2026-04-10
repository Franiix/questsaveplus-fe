import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function requireEnv(name: 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY') {
 const value = process.env[name];
 if (!value) {
  throw new Error(`Missing required environment variable: ${name}`);
 }
 return value;
}

const supabaseUrl = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

const ExpoSecureStoreAdapter = {
 getItem: (key: string) => SecureStore.getItemAsync(key),
 setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
 removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
 auth: {
  storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
 },
});
