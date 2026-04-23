import { ScrollView } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import type { HomeAppliedFilterChip } from '@/shared/models/home/HomeAppliedFilterChip.model';
import { spacing } from '@/shared/theme/tokens';

type AppliedGameFiltersRowProps = {
 filters: HomeAppliedFilterChip[];
};

export function AppliedGameFiltersRow({ filters }: AppliedGameFiltersRowProps) {
 if (filters.length === 0) {
  return null;
 }

 return (
  <ScrollView
   horizontal
   showsHorizontalScrollIndicator={false}
   keyboardShouldPersistTaps="handled"
   contentContainerStyle={{
    paddingTop: spacing.sm,
    gap: spacing.sm,
   }}
  >
   {filters.map((filter) => (
    <FilterChip key={filter.key} label={filter.label} isSelected onPress={filter.onRemove} />
   ))}
  </ScrollView>
 );
}
