import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { Avatar } from '@/components/base/display/Avatar';
import { colors } from '@/shared/theme/tokens';

const BUTTON_SIZE = 42;
export const BUTTON_RING_SIZE = 48;

type ProfileAvatarRingButtonProps = {
 isOpen: boolean;
 onPress: () => void;
 avatarUri?: string;
 displayName: string;
 scaleAnim: Animated.Value;
 accessibilityLabel: string;
};

export const ProfileAvatarRingButton = memo(function ProfileAvatarRingButton({
 isOpen,
 onPress,
 avatarUri,
 displayName,
 scaleAnim,
 accessibilityLabel,
}: ProfileAvatarRingButtonProps) {
 const ringRotation = useRef(new Animated.Value(0)).current;

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

 return (
  <Animated.View
   style={{
    transform: [
     {
      scale: scaleAnim.interpolate({
       inputRange: [0, 1],
       outputRange: [1, 1.04],
      }),
     },
    ],
   }}
  >
   <View
    style={{
     width: BUTTON_RING_SIZE,
     height: BUTTON_RING_SIZE,
     borderRadius: BUTTON_RING_SIZE / 2,
     overflow: 'hidden',
     shadowColor: colors.primary.DEFAULT,
     shadowOffset: { width: 0, height: 0 },
     shadowOpacity: isOpen ? 0.45 : 0.22,
     shadowRadius: isOpen ? 16 : 10,
     elevation: 16,
    }}
   >
    <Animated.View
     pointerEvents="none"
     style={{
      position: 'absolute',
      inset: -6,
      transform: [
       {
        rotate: ringRotation.interpolate({
         inputRange: [0, 1],
         outputRange: ['0deg', '360deg'],
        }),
       },
      ],
     }}
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
      accessibilityLabel={accessibilityLabel}
      accessibilityState={isOpen ? { expanded: true } : {}}
      onPress={onPress}
      style={{
       width: BUTTON_SIZE,
       height: BUTTON_SIZE,
       borderRadius: BUTTON_SIZE / 2,
       alignItems: 'center',
       justifyContent: 'center',
       overflow: 'hidden',
      }}
     >
      <Avatar uri={avatarUri} name={displayName} size={34} />
     </Pressable>
    </View>
   </View>
  </Animated.View>
 );
});
