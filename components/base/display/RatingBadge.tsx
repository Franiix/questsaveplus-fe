import { FontAwesome5 } from '@expo/vector-icons';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type RatingBadgeSize = 'sm' | 'md';

type RatingBadgeProps = {
 /** Valore 1-5. */
 rating: number;
 size?: RatingBadgeSize;
 style?: StyleProp<ViewStyle>;
};

const sizeMap: Record<RatingBadgeSize, { icon: number; font: number; pad: number }> = {
 sm: { icon: 11, font: typography.size.xs, pad: spacing.sm },
 md: { icon: 14, font: typography.size.sm, pad: spacing.md },
};

/**
 * Atom: display compatto del voto numerico (1-5).
 *
 * Mostra un'icona stella + il numero su sfondo warning semitrasparente.
 * Pensato per le card del backlog accanto a StatusBadge.
 */
export function RatingBadge({ rating, size = 'sm', style }: RatingBadgeProps) {
 const { icon, font, pad } = sizeMap[size];

 return (
  <View
   style={[
    {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 3,
     backgroundColor: `${colors.warning}26`,
     borderRadius: borderRadius.full,
     paddingHorizontal: pad,
     paddingVertical: 2,
     alignSelf: 'flex-start',
    },
    style,
   ]}
  >
   <FontAwesome5 name="star" size={icon} color={colors.warning} solid />
   <Text
    style={{
     color: colors.warning,
     fontSize: font,
     fontFamily: typography.font.semibold,
    }}
   >
    {rating}
   </Text>
  </View>
 );
}
