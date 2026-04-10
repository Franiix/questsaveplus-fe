import {
 Geist_400Regular,
 Geist_500Medium,
 Geist_600SemiBold,
 Geist_700Bold,
 Geist_900Black,
 useFonts,
} from '@expo-google-fonts/geist';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/shared/i18n/i18n.config';
import { AuthBootScreen } from '@/components/auth/AuthBootScreen';
import { ToastContainer } from '@/components/base/feedback/ToastNotification';
import { TabBarCustom } from '@/components/base/navigation/TabBarCustom';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
 defaultOptions: {
  queries: {
   staleTime: 5 * 60 * 1000, // 5 min â€” dati freschi senza refetch
   gcTime: 30 * 60 * 1000, // 30 min â€” cache in memoria
   retry: 2,
  },
 },
});

function AuthGuard() {
 const { t } = useTranslation();
 const router = useRouter();
 const segments = useSegments();
 const {
  session,
  isLoading: isAuthLoading,
  initialize,
 } = useAuthStore();
 const {
  profile,
  currentUserId,
  hasResolvedProfile,
  isLoading: isProfileLoading,
  fetchProfile,
  clearProfile,
 } = useProfileStore();

 useEffect(() => {
  return initialize();
 }, [initialize]);

 // Fetch profilo ogni volta che cambia lo userId
 useEffect(() => {
  if (session?.user?.id) {
   fetchProfile(session.user.id).then();
  } else {
   clearProfile();
  }
 }, [session?.user?.id, clearProfile, fetchProfile]);

 const shouldBootstrapProfile =
  Boolean(session?.user?.id) &&
  (isProfileLoading || currentUserId !== session?.user?.id || !hasResolvedProfile);

 useEffect(() => {
  if (isAuthLoading || shouldBootstrapProfile) return;

  const inAuthGroup = segments[0] === '(auth)';
  const inCallbackRoute = segments[0] === 'auth';
  const inProfileSetup = inAuthGroup && segments[1] === 'profile-setup';

  if (!session && !inAuthGroup && !inCallbackRoute) {
   router.replace('/(auth)/login');
  } else if (session && !profile && !inProfileSetup && !inCallbackRoute) {
   router.replace('/(auth)/profile-setup');
  } else if (session && profile && inAuthGroup) {
   router.replace('/(tabs)');
  }
 }, [session, profile, segments, router, isAuthLoading, shouldBootstrapProfile]);

 if (isAuthLoading || shouldBootstrapProfile) {
  return (
   <AuthBootScreen
    title="QuestSave+"
    subtitle={t('auth.boot.loading')}
   />
  );
 }

 return null;
}

export default function RootLayout() {
 const [fontsLoaded] = useFonts({
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_900Black,
 });

 useEffect(() => {
  if (fontsLoaded) {
   SplashScreen.hideAsync();
  }
 }, [fontsLoaded]);

 if (!fontsLoaded) {
  return null;
 }

 return (
  <GestureHandlerRootView style={{ flex: 1 }}>
   <QueryClientProvider client={queryClient}>
    <GluestackUIProvider mode="dark">
     <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="game/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="auth/callback" options={{ animation: 'fade' }} />
     </Stack>
     <AuthGuard />
     <TabBarCustom />
     <StatusBar style="light" />
     <ToastContainer />
    </GluestackUIProvider>
   </QueryClientProvider>
  </GestureHandlerRootView>
 );
}

