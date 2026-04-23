import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { borderRadius as borderRadiusTokens, colors } from '@/shared/theme/tokens';

type SkeletonProps = {
 width: number | `${number}%`;
 height: number;
 borderRadius?: number;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: rettangolo placeholder animato per contenuto in caricamento.
 *
 * Usa un shimmer wave — LinearGradient che scorre da sinistra a destra —
 * per un effetto loading più raffinato rispetto al semplice pulse di opacità.
 * Composable: si affiancano più Skeleton per replicare il layout reale.
 *
 * @example
 * // SkeletonGameCard
 * <View style={{gap: 8}}>
 *   <Skeleton width="100%" height={160} borderRadius={12} /> // cover
 *   <Skeleton width="70%" height={16} />                     // titolo
 *   <Skeleton width="40%" height={12} />                     // sottotitolo
 * </View>
 */
export function Skeleton({ width, height, borderRadius, style }: SkeletonProps) {
 const { width: screenWidth } = useWindowDimensions();
 const translateX = useSharedValue(-screenWidth);

 useEffect(() => {
  translateX.value = -screenWidth;
  translateX.value = withTiming(screenWidth, { duration: 1400 });
 }, [translateX, screenWidth]);

 const shimmerStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
 }));

 const resolvedRadius = borderRadius ?? borderRadiusTokens.md;

 return (
  <View
   style={[
    {
     width,
     height,
     borderRadius: resolvedRadius,
     backgroundColor: colors.background.elevated,
     overflow: 'hidden',
    },
    style,
   ]}
  >
   <Animated.View
    style={[
     {
      position: 'absolute',
      top: 0,
      left: 0,
      width: screenWidth,
      height,
     },
     shimmerStyle,
    ]}
   >
    <LinearGradient
     colors={colors.gradient.shimmer as [string, string, string]}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 0 }}
     style={{ flex: 1, height }}
    />
   </Animated.View>
  </View>
 );
}
