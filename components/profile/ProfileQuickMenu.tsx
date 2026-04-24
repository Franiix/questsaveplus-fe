import { usePathname, useSegments } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatarRingButton } from '@/components/profile/ProfileAvatarRingButton';
import type { MenuAction } from '@/components/profile/ProfileMenuDropdown';
import { ProfileMenuDropdown } from '@/components/profile/ProfileMenuDropdown';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { spacing } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';

export function ProfileQuickMenu() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const pathname = usePathname();
 const segments = useSegments();
 const insets = useSafeAreaInsets();
 const [isOpen, setIsOpen] = useState(false);
 const [isMenuVisible, setIsMenuVisible] = useState(false);
 const session = useAuthStore((state) => state.session);
 const signOut = useAuthStore((state) => state.signOut);
 const profile = useProfileStore((state) => state.profile);
 const animation = useRef(new Animated.Value(0)).current;

 const hidden =
  segments[0] === '(auth)' ||
  (segments[0] === 'auth' && segments[1] === 'callback') ||
  !session?.user?.id;

 // Close and reset on navigation
 useEffect(() => {
  if (!pathname) return;
  setIsOpen(false);
  setIsMenuVisible(false);
  animation.setValue(0);
 }, [animation, pathname]);

 // Drive open/close animation
 useEffect(() => {
  if (isOpen) setIsMenuVisible(true);

  Animated.timing(animation, {
   toValue: isOpen ? 1 : 0,
   duration: isOpen ? 220 : 170,
   easing: isOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
   useNativeDriver: true,
  }).start(({ finished }) => {
   if (finished && !isOpen) setIsMenuVisible(false);
  });
 }, [animation, isOpen]);

 const displayName = profile?.full_name?.trim() || profile?.username?.trim() || 'QuestSave+';
 const usernameLabel = profile?.username ? `@${profile.username}` : (session?.user?.email ?? '');

 const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);
 const handleClose = useCallback(() => setIsOpen(false), []);
 const handleActionPress = useCallback((action: MenuAction) => {
  setIsOpen(false);
  action.onPress();
 }, []);

 const menuActions = useMemo<MenuAction[]>(
  () => [
   {
    icon: 'id-card',
    label: t('profile.detailButton'),
    onPress: () => router.push('/(tabs)/profile'),
   },
   {
    icon: 'pen',
    label: t('profile.editButton'),
    onPress: () => router.push('/profile/edit-profile'),
   },
   {
    icon: 'envelope',
    label: t('profile.changeEmailButton'),
    onPress: () => router.push('/profile/change-email'),
   },
   {
    icon: 'key',
    label: t('profile.changePasswordButton'),
    onPress: () => router.push('/profile/change-password'),
   },
   {
    icon: 'info-circle',
    label: t('profile.infoButton'),
    onPress: () => router.push('/(tabs)/credits'),
   },
   {
    icon: 'sign-out-alt',
    label: t('profile.logoutButton'),
    onPress: signOut,
    isDestructive: true,
   },
  ],
  [router, signOut, t],
 );

 if (hidden) return null;

 return (
  <View pointerEvents="box-none" style={{ position: 'absolute', inset: 0, zIndex: 60 }}>
   {/* Backdrop overlay — closes menu on tap */}
   {isMenuVisible ? (
    <Animated.View
     pointerEvents="box-none"
     style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(4, 5, 12, 0.28)',
      opacity: animation,
     }}
    >
     <Pressable style={{ flex: 1 }} onPress={handleClose} />
    </Animated.View>
   ) : null}

   {/* Trigger + dropdown anchored to top-right, consistently positioned across all screens */}
   <View
    pointerEvents="box-none"
    style={{
     position: 'absolute',
     top: insets.top + spacing.sm,
     right: spacing.md,
     alignItems: 'flex-end',
    }}
   >
    <ProfileAvatarRingButton
     isOpen={isOpen}
     onPress={handleToggle}
     avatarUri={profile?.avatar_url ?? undefined}
     displayName={displayName}
     scaleAnim={animation}
     accessibilityLabel={t('profile.quickMenuLabel')}
    />

    {isMenuVisible ? (
     <ProfileMenuDropdown
      animation={animation}
      isOpen={isOpen}
      displayName={displayName}
      usernameLabel={usernameLabel}
      avatarUri={profile?.avatar_url ?? undefined}
      menuActions={menuActions}
      onActionPress={handleActionPress}
     />
    ) : null}
   </View>
  </View>
 );
}
