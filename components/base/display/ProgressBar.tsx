import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import Animated, {
 Easing,
 useAnimatedStyle,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import { borderRadius, colors } from '@/shared/theme/tokens';

type ProgressBarProps = {
 value: number;
 color?: string;
 height?: number;
 animated?: boolean;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: barra di avanzamento animata con LinearGradient.
 *
 * Se color non è fornito, il colore è interpolato automaticamente:
 * < 33 → error, < 66 → warning, altrimenti → success.
 * Il fill si anima al mount con easing cubico in 600ms.
 */
function resolveColor(value: number, color?: string): string {
 if (color) return color;
 if (value < 33) return colors.error;
 if (value < 66) return colors.warning;
 return colors.success;
}

function lightenColor(hex: string): string {
 // Parse hex and add ~20% brightness by blending toward white
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 const blend = (channel: number) => Math.min(255, Math.round(channel + (255 - channel) * 0.2));
 const toHex = (n: number) => n.toString(16).padStart(2, '0');
 return `#${toHex(blend(r))}${toHex(blend(g))}${toHex(blend(b))}`;
}

export function ProgressBar({
 value,
 color,
 height = 6,
 animated = true,
 style,
}: ProgressBarProps) {
 const clampedValue = Math.min(100, Math.max(0, value));
 const widthAnim = useSharedValue(animated ? 0 : clampedValue);

 useEffect(() => {
  if (animated) {
   widthAnim.value = withTiming(clampedValue, {
    duration: 600,
    easing: Easing.out(Easing.cubic),
   });
  } else {
   widthAnim.value = clampedValue;
  }
 }, [clampedValue, animated, widthAnim]);

 const animatedStyle = useAnimatedStyle(() => ({
  width: `${widthAnim.value}%`,
 }));

 const baseColor = resolveColor(clampedValue, color);
 const lightColor = lightenColor(baseColor);

 return (
  <View
   style={[
    {
     height,
     backgroundColor: colors.background.elevated,
     borderRadius: borderRadius.full,
     overflow: 'hidden',
    },
    style,
   ]}
  >
   <Animated.View style={[{ height }, animatedStyle]}>
    <LinearGradient
     colors={[baseColor, lightColor]}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 0 }}
     style={{ flex: 1, height }}
    />
   </Animated.View>
  </View>
 );
}
