import { View } from 'react-native';
import { FilterIconButton } from '@/components/base/inputs/FilterIconButton';
import { SearchBar } from '@/components/base/inputs/SearchBar';
import { spacing } from '@/shared/theme/tokens';

type SearchFilterToolbarProps = {
 value: string;
 onChangeText: (text: string) => void;
 onClear: () => void;
 placeholder: string;
 onFilterPress: () => void;
 filterAccessibilityLabel: string;
 isLoading?: boolean;
 activeCount?: number;
 isFilterActive?: boolean;
 isDisabled?: boolean;
};

export function SearchFilterToolbar({
 value,
 onChangeText,
 onClear,
 placeholder,
 onFilterPress,
 filterAccessibilityLabel,
 isLoading = false,
 activeCount = 0,
 isFilterActive = false,
 isDisabled = false,
}: SearchFilterToolbarProps) {
 const hasActiveCount = activeCount > 0;

 return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
   <View style={{ flex: 1 }}>
    <SearchBar
     value={value}
     onChangeText={onChangeText}
     onClear={onClear}
     placeholder={placeholder}
     isLoading={isLoading}
     isDisabled={isDisabled}
    />
   </View>

   <FilterIconButton
    onPress={onFilterPress}
    accessibilityLabel={filterAccessibilityLabel}
    isActive={isFilterActive || hasActiveCount}
    badgeCount={activeCount}
    isDisabled={isDisabled}
   />
  </View>
 );
}
