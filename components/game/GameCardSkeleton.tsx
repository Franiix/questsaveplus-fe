import { View } from 'react-native';
import { Skeleton } from '@/components/base/feedback/Skeleton';
import { colors, spacing } from '@/shared/theme/tokens';

type GameCardSkeletonProps = {
 width: number;
};

/**
 * Placeholder animato per GameCard durante il caricamento iniziale.
 *
 * Mantiene lo stesso aspect ratio (1.42) e borderRadius (18) del componente reale,
 * con due linee skeleton per titolo e sottotitolo sovrapposti in basso.
 */
export function GameCardSkeleton({ width }: GameCardSkeletonProps) {
 const height = Math.round(width * 1.42);

 return (
  <View
   style={{
    width,
    height,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
   }}
  >
   {/* Full-bleed image area */}
   <Skeleton width={width} height={height} borderRadius={0} />

   {/* Bottom content lines */}
   <View
    style={{
     position: 'absolute',
     left: 0,
     right: 0,
     bottom: 0,
     padding: spacing.sm,
     gap: 6,
    }}
   >
    {/* Title skeleton ~60% width */}
    <Skeleton width={Math.round(width * 0.6)} height={14} />
    {/* Subtitle skeleton ~40% width */}
    <Skeleton width={Math.round(width * 0.4)} height={10} />
   </View>
  </View>
 );
}
