import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { MetacriticBadge } from '@/components/base/display/MetacriticBadge';
import { borderRadius, colors, spacing } from '@/shared/theme/tokens';

type GameHeroBannerProps = {
 imageUri: string | null;
 width: number;
 height: number;
 metacritic: number | null;
 gradientColors: readonly [string, string, ...string[]];
 gradientLocations: readonly [number, number, ...number[]];
 badgeAlign?: 'left' | 'right';
 badgeSize?: 'sm' | 'md';
 topInset?: number;
 onBackPress?: () => void;
 style?: StyleProp<ViewStyle>;
};

export function GameHeroBanner({
 imageUri,
 width,
 height,
 metacritic,
 gradientColors,
 gradientLocations,
 badgeAlign = 'right',
 badgeSize = 'md',
 topInset = 0,
 onBackPress,
 style,
}: GameHeroBannerProps) {
 return (
  <View style={style}>
   <ImageWithFallback
    uri={imageUri}
    width={width}
    height={height}
    radius={0}
    style={{ position: 'absolute', top: 0, left: 0 }}
   />
   <LinearGradient
    colors={gradientColors}
    locations={gradientLocations}
    style={{ position: 'absolute', inset: 0 }}
   />

   {onBackPress ? (
    <Pressable
     onPress={onBackPress}
     hitSlop={12}
     style={{
      position: 'absolute',
      top: topInset + spacing.sm,
      left: spacing.md,
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.glass,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <FontAwesome5 name="chevron-left" size={14} color={colors.text.primary} />
    </Pressable>
   ) : null}

   {metacritic !== null ? (
    <View
     style={{
      position: 'absolute',
      top: topInset + spacing.sm,
      left: badgeAlign === 'left' ? spacing.md : undefined,
      right: badgeAlign === 'right' ? spacing.md : undefined,
     }}
    >
     <MetacriticBadge score={metacritic} size={badgeSize} />
    </View>
   ) : null}
  </View>
 );
}
