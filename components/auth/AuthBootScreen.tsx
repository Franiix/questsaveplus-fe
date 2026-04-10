import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type AuthBootScreenProps = {
 title: string;
 subtitle: string;
};

function FallingController({
 icon,
 delay,
 size,
 left,
 top,
 opacity,
 rotate,
}: {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 delay: number;
 size: number;
 left: number;
 top: number;
 opacity: number;
 rotate: string;
}) {
 const translateY = useRef(new Animated.Value(-18)).current;

 useEffect(() => {
  const animation = Animated.loop(
   Animated.sequence([
    Animated.delay(delay),
    Animated.timing(translateY, {
     toValue: 18,
     duration: 1800,
     easing: Easing.inOut(Easing.quad),
     useNativeDriver: true,
    }),
    Animated.timing(translateY, {
     toValue: -18,
     duration: 1800,
     easing: Easing.inOut(Easing.quad),
     useNativeDriver: true,
    }),
   ]),
  );

  animation.start();
  return () => animation.stop();
 }, [delay, translateY]);

 return (
  <Animated.View
   style={{
    position: 'absolute',
    left,
    top,
    opacity,
    transform: [{ translateY }, { rotate }],
   }}
  >
   <FontAwesome5 name={icon} size={size} color={colors.primary['200']} solid />
  </Animated.View>
 );
}

export function AuthBootScreen({ title, subtitle }: AuthBootScreenProps) {
 return (
  <View
   style={{
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
   }}
  >
   <View
    style={{
     width: 180,
     height: 180,
     borderRadius: borderRadius.xl,
     backgroundColor: colors.background.surface,
     borderWidth: 1,
     borderColor: colors.border.glow,
     alignItems: 'center',
     justifyContent: 'center',
     marginBottom: spacing.xl,
     overflow: 'hidden',
    }}
   >
    <View
     style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: colors.primary.glowSoft,
      opacity: 0.7,
    }}
    />
    <FallingController icon="gamepad" delay={0} size={28} left={24} top={20} opacity={0.5} rotate="-12deg" />
    <FallingController icon="dice-d20" delay={220} size={22} left={126} top={34} opacity={0.35} rotate="9deg" />
    <FallingController icon="headset" delay={420} size={24} left={110} top={118} opacity={0.3} rotate="-8deg" />
    <FallingController icon="gamepad" delay={620} size={20} left={38} top={120} opacity={0.26} rotate="6deg" />

    <View
      style={{
       width: 78,
       height: 78,
       borderRadius: 39,
       backgroundColor: colors.background.elevated,
       borderWidth: 1,
       borderColor: colors.border.DEFAULT,
       alignItems: 'center',
       justifyContent: 'center',
      }}
    >
     <FontAwesome5 name="gamepad" size={28} color={colors.accent.DEFAULT} solid />
    </View>
   </View>

   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.xl,
     fontFamily: typography.font.bold,
     textAlign: 'center',
     marginBottom: spacing.sm,
    }}
   >
    {title}
   </Text>
   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.md,
     fontFamily: typography.font.regular,
     textAlign: 'center',
     marginBottom: spacing.lg,
    }}
   >
    {subtitle}
   </Text>
   <LoadingSpinner size="small" />
  </View>
 );
}
