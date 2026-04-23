import { memo } from 'react';
import { Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type Props = {
 ordinal: number;
 size?: 'sm' | 'md';
};

const SIZE_CONFIG = {
 sm: { dim: 24, borderAlpha: '80', bgAlpha: '26' },
 md: { dim: 26, borderAlpha: '66', bgAlpha: '18' },
} as const;

export const PlayNextOrdinalBadge = memo(function PlayNextOrdinalBadge({
 ordinal,
 size = 'md',
}: Props) {
 const { dim, borderAlpha, bgAlpha } = SIZE_CONFIG[size];

 return (
  <View
   style={{
    minWidth: dim,
    height: dim,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: `${colors.primary['200']}${borderAlpha}`,
    backgroundColor: `${colors.primary['200']}${bgAlpha}`,
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <Text
    style={{ color: colors.primary['200'], fontSize: 10, fontFamily: typography.font.semibold }}
   >
    #{ordinal}
   </Text>
  </View>
 );
});
