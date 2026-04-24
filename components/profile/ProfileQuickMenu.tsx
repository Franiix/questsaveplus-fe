import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useSegments } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/base/display/Avatar';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';

type MenuAction = {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 label: string;
 onPress: () => void;
 isDestructive?: boolean;
};

const BUTTON_SIZE = 42;
const BUTTON_RING_SIZE = 48;
const MENU_WIDTH = 286;

function MenuRow({
 icon,
 label,
 onPress,
 isDestructive = false,
}: MenuAction & { onPress: () => void }) {
 return (
  <Pressable
   onPress={onPress}
   style={({ pressed }) => ({
    minHeight: 52,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
   })}
  >
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.md,
     minHeight: 34,
    }}
   >
    <View
     style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDestructive ? 'rgba(248,113,113,0.12)' : 'rgba(108,99,255,0.14)',
     }}
    >
     <FontAwesome5
      name={icon}
      size={13}
      color={isDestructive ? colors.error : colors.primary['200']}
      solid
     />
    </View>
    <Text
     numberOfLines={1}
     style={{
      flex: 1,
      color: isDestructive ? colors.error : colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.semibold,
      lineHeight: Math.ceil(typography.size.md * typography.lineHeight.snug),
     }}
    >
     {label}
    </Text>
   </View>
  </Pressable>
 );
}

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
 const ringRotation = useRef(new Animated.Value(0)).current;
 const isHomeRoute = segments[0] === '(tabs)' && !segments[1];
 const isHeaderPillRoute =
  (segments[0] === '(tabs)' && (segments[1] === 'backlog' || segments[1] === 'play-next')) ||
  segments[0] === 'backlog-archive' ||
  segments[0] === 'profile';

 const hidden =
  segments[0] === '(auth)' ||
  (segments[0] === 'auth' && segments[1] === 'callback') ||
  !session?.user?.id;

 useEffect(() => {
  ringRotation.setValue(0);

  const loop = Animated.loop(
   Animated.timing(ringRotation, {
    toValue: 1,
    duration: isOpen ? 2100 : 5200,
    easing: Easing.linear,
    useNativeDriver: true,
   }),
  );

  loop.start();

  return () => {
   loop.stop();
   ringRotation.stopAnimation();
  };
 }, [isOpen, ringRotation]);

 useEffect(() => {
  if (!pathname) return;
  setIsOpen(false);
  setIsMenuVisible(false);
  animation.setValue(0);
 }, [animation, pathname]);

 useEffect(() => {
  if (isOpen) {
   setIsMenuVisible(true);
  }

  Animated.timing(animation, {
   toValue: isOpen ? 1 : 0,
   duration: isOpen ? 220 : 170,
   easing: isOpen ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
   useNativeDriver: true,
  }).start(({ finished }) => {
   if (finished && !isOpen) {
    setIsMenuVisible(false);
   }
  });
 }, [animation, isOpen]);

 const displayName = profile?.full_name?.trim() || profile?.username?.trim() || 'QuestSave+';
 const usernameLabel = profile?.username ? `@${profile.username}` : (session?.user?.email ?? '');

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

 const overlayStyle = {
  opacity: animation,
 };

 const menuStyle = {
  opacity: animation,
  transform: [
   {
    translateY: animation.interpolate({
     inputRange: [0, 1],
     outputRange: [-8, 0],
    }),
   },
   {
    scale: animation.interpolate({
     inputRange: [0, 1],
     outputRange: [0.96, 1],
    }),
   },
  ],
 };

 const buttonStyle = {
  transform: [
   {
    scale: animation.interpolate({
     inputRange: [0, 1],
     outputRange: [1, 1.04],
    }),
   },
  ],
 };

 const ringStyle = {
  transform: [
   {
    rotate: ringRotation.interpolate({
     inputRange: [0, 1],
     outputRange: ['0deg', '360deg'],
    }),
   },
  ],
 };

 const triggerTop = isHomeRoute
  ? insets.top + spacing.xs
  : isHeaderPillRoute
    ? insets.top + spacing.sm
    : insets.top + spacing.sm + 1;
 const triggerRight = isHeaderPillRoute ? spacing.md : spacing.md + 3;

 if (hidden) return null;

 return (
  <View
   pointerEvents="box-none"
   style={{
    position: 'absolute',
    inset: 0,
    zIndex: 60,
   }}
  >
   {isMenuVisible ? (
    <Animated.View
     pointerEvents="box-none"
     style={[
      {
       position: 'absolute',
       inset: 0,
       backgroundColor: 'rgba(4, 5, 12, 0.22)',
      },
      overlayStyle,
     ]}
    >
     <Pressable style={{ flex: 1 }} onPress={() => setIsOpen(false)} />
    </Animated.View>
   ) : null}

   <View
    pointerEvents="box-none"
    style={{
     position: 'absolute',
     top: triggerTop,
     right: triggerRight,
     alignItems: 'flex-end',
    }}
   >
    <Animated.View style={buttonStyle}>
     <View
      style={{
       width: BUTTON_RING_SIZE,
       height: BUTTON_RING_SIZE,
       borderRadius: BUTTON_RING_SIZE / 2,
       overflow: 'hidden',
       shadowColor: colors.primary.DEFAULT,
       shadowOffset: { width: 0, height: 0 },
       shadowOpacity: isOpen ? 0.42 : 0.22,
       shadowRadius: isOpen ? 14 : 10,
       elevation: 16,
      }}
     >
      <Animated.View
       pointerEvents="none"
       style={[
        {
         position: 'absolute',
         inset: -6,
        },
        ringStyle,
       ]}
      >
       <LinearGradient
        colors={[
         colors.primary.DEFAULT,
         colors.accent.DEFAULT,
         colors.primary['300'],
         colors.primary.DEFAULT,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
       />
      </Animated.View>

      <View
       style={{
        position: 'absolute',
        inset: 2,
        borderRadius: (BUTTON_RING_SIZE - 4) / 2,
        backgroundColor: 'rgba(11, 12, 22, 0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
       }}
      >
       <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('profile.quickMenuLabel')}
        accessibilityState={isOpen ? { expanded: true } : {}}
        onPress={() => setIsOpen((previous) => !previous)}
        style={{
         width: BUTTON_SIZE,
         height: BUTTON_SIZE,
         borderRadius: BUTTON_SIZE / 2,
         alignItems: 'center',
         justifyContent: 'center',
         overflow: 'hidden',
        }}
       >
        <Avatar uri={profile?.avatar_url ?? undefined} name={displayName} size={34} />
       </Pressable>
      </View>
     </View>
    </Animated.View>

    {isMenuVisible ? (
     <View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={{
       width: MENU_WIDTH,
       marginTop: spacing.sm,
       borderRadius: 22,
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.08)',
       backgroundColor: 'rgba(10, 11, 20, 0.97)',
       shadowColor: colors.background.overlay,
       shadowOffset: { width: 0, height: 14 },
       shadowOpacity: 0.32,
       shadowRadius: 28,
       elevation: 20,
       overflow: 'hidden',
      }}
     >
      <Animated.View style={menuStyle as never}>
       <View
        style={{
         flexDirection: 'row',
         alignItems: 'center',
         gap: spacing.md,
         paddingHorizontal: spacing.md,
         paddingTop: spacing.md,
         paddingBottom: spacing.md,
         borderBottomWidth: 1,
         borderBottomColor: 'rgba(255,255,255,0.06)',
         backgroundColor: 'rgba(255,255,255,0.02)',
        }}
       >
        <Avatar uri={profile?.avatar_url ?? undefined} name={displayName} size={46} />
        <View style={{ flex: 1, gap: 2 }}>
         <Text
          numberOfLines={1}
          style={{
           color: colors.text.primary,
           fontSize: typography.size.lg,
           fontFamily: typography.font.bold,
          }}
         >
          {displayName}
         </Text>
         <Text
          numberOfLines={1}
          style={{
           color: colors.text.secondary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.mono,
          }}
         >
          {usernameLabel}
         </Text>
        </View>
       </View>

       <View
        style={{
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.sm,
         gap: 2,
        }}
       >
        {menuActions.map((action) => (
         <MenuRow
          key={action.label}
          {...action}
          onPress={() => {
           setIsOpen(false);
           action.onPress();
          }}
         />
        ))}
       </View>
      </Animated.View>
     </View>
    ) : null}
   </View>
  </View>
 );
}
