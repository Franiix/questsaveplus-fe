import { ScrollView } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import { spacing } from '@/shared/theme/tokens';

type AppliedFilterChip = {
 key: string;
 label: string;
 onRemove: () => void;
};

type AppliedGameFiltersRowProps = {
 filters: AppliedFilterChip[];
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
    <FilterChip
     key={filter.key}
     label={filter.label}
     isSelected
     onPress={filter.onRemove}
    />
   ))}
  </ScrollView>
 );
}
