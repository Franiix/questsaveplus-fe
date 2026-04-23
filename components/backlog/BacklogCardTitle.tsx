import { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
 cancelAnimation,
 Easing,
 useAnimatedStyle,
 useSharedValue,
 withSequence,
 withTiming,
} from 'react-native-reanimated';
import { colors, typography } from '@/shared/theme/tokens';

const AnimatedText = Animated.createAnimatedComponent(Text);

const SCROLL_ANIM = {
 initialPause: 800,
 scrollMinDuration: 2400,
 scrollSpeedFactor: 24,
 returnMinDuration: 1800,
 returnSpeedFactor: 18,
} as const;

const TEXT_STYLE = {
 color: colors.text.primary,
 fontSize: typography.size.md,
 fontFamily: typography.font.semibold,
} as const;

type Props = {
 title: string;
};

export const BacklogCardTitle = memo(function BacklogCardTitle({ title }: Props) {
 const translateX = useSharedValue(0);
 const [containerWidth, setContainerWidth] = useState(0);
 const [textWidth, setTextWidth] = useState(0);

 useEffect(() => {
  const overflow = Math.max(0, textWidth - containerWidth);

  cancelAnimation(translateX);

  if (overflow <= 0) {
   translateX.value = 0;
   return;
  }

  translateX.value = withSequence(
   withTiming(0, { duration: SCROLL_ANIM.initialPause }),
   withTiming(-overflow, {
    duration: Math.max(SCROLL_ANIM.scrollMinDuration, overflow * SCROLL_ANIM.scrollSpeedFactor),
    easing: Easing.inOut(Easing.quad),
   }),
   withTiming(0, {
    duration: Math.max(SCROLL_ANIM.returnMinDuration, overflow * SCROLL_ANIM.returnSpeedFactor),
    easing: Easing.inOut(Easing.quad),
   }),
  );
 }, [containerWidth, textWidth, translateX]);

 const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
 }));

 return (
  <View
   onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
   style={{ overflow: 'hidden', minWidth: 0 }}
  >
   <Text
    onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
    style={[TEXT_STYLE, { position: 'absolute', opacity: 0, left: 0, top: 0 }]}
    numberOfLines={1}
    pointerEvents="none"
   >
    {title}
   </Text>
   <AnimatedText numberOfLines={1} style={[animatedStyle, TEXT_STYLE]}>
    {title}
   </AnimatedText>
  </View>
 );
});
