import { View } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import { colors, spacing } from '@/shared/theme/tokens';

type DiscoverySortOption = {
 key: string;
 label: string;
};

type DiscoverySortBarProps = {
 options: DiscoverySortOption[];
 selectedKey: string;
 onSelect: (key: string) => void;
};

export function DiscoverySortBar({ options, selectedKey, onSelect }: DiscoverySortBarProps) {
 return (
  <View
   style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.DEFAULT,
    backgroundColor: colors.background.primary,
   }}
  >
   {options.map((option) => (
    <FilterChip
     key={option.key}
     label={option.label}
     isSelected={selectedKey === option.key}
     onPress={() => onSelect(option.key)}
    />
   ))}
  </View>
 );
}
