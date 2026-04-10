import { Text, View } from 'react-native';
import { borderRadius, colors, typography } from '@/shared/theme/tokens';

type MetacriticBadgeSize = 'sm' | 'md';

type MetacriticBadgeProps = {
 score: number;
 size?: MetacriticBadgeSize;
};

function metacriticColor(score: number): string {
 if (score >= 75) return colors.success;
 if (score >= 50) return colors.warning;
 return colors.error;
}

const sizeMap: Record<
 MetacriticBadgeSize,
 { fontSize: number; paddingHorizontal: number; paddingVertical: number }
> = {
 sm: { fontSize: typography.size.xs, paddingHorizontal: 7, paddingVertical: 3 },
 md: { fontSize: typography.size.sm, paddingHorizontal: 10, paddingVertical: 5 },
};

/**
 * Atom: badge compatto per il punteggio Metacritic.
 *
 * Pill scuro con bordo colorato basato sul valore:
 * >= 75 → success, >= 50 → warning, < 50 → error.
 */
export function MetacriticBadge({ score, size = 'sm' }: MetacriticBadgeProps) {
 const color = metacriticColor(score);
 const { fontSize, paddingHorizontal, paddingVertical } = sizeMap[size];

 return (
  <View
   style={{
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color,
    backgroundColor: 'rgba(8, 8, 16, 0.80)',
    paddingHorizontal,
    paddingVertical,
   }}
  >
   <Text
    style={{
     color,
     fontSize,
     fontFamily: typography.font.mono,
     fontWeight: typography.weight.bold as '700',
    }}
   >
    {score}
   </Text>
  </View>
 );
}
