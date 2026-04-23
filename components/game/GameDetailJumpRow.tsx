import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import { colors, spacing, typography } from '@/shared/theme/tokens';

export type GameDetailJumpItem = {
 key: string;
 label: string;
 onPress: () => void;
};

type GameDetailJumpRowProps = {
 title: string;
 items: GameDetailJumpItem[];
};

export function GameDetailJumpRow({ title, items }: GameDetailJumpRowProps) {
 const visibleItems = useMemo(() => items.filter((item) => item.label.trim().length > 0), [items]);

 if (visibleItems.length === 0) {
  return null;
 }

 return (
  <View style={{ marginTop: spacing.lg, marginBottom: spacing.md, gap: spacing.sm }}>
   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.xs,
     fontFamily: typography.font.semibold,
     letterSpacing: typography.letterSpacing.wide,
     textTransform: 'uppercase',
    }}
   >
    {title}
   </Text>

   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
   >
    {visibleItems.map((item) => (
     <FilterChip key={item.key} label={item.label} isSelected={false} onPress={item.onPress} />
    ))}
   </ScrollView>
  </View>
 );
}
