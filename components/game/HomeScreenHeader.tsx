import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { AppliedGameFiltersRow } from '@/components/game/AppliedGameFiltersRow';
import { QuickDiscoveryPresetsRow } from '@/components/game/QuickDiscoveryPresetsRow';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import type { HomeAppliedFilterChip } from '@/shared/models/home/HomeAppliedFilterChip.model';
import type { HomeQuickPresetAction } from '@/shared/models/home/HomeQuickPresetAction.model';

type HomeScreenHeaderProps = {
 activeFilterCount: number;
 activeFilters: HomeAppliedFilterChip[];
 appVersion: string;
 discoveryContextLabel: string | null;
 gamesCount: number;
 isDiscoveryMode: boolean;
 isFilterActive: boolean;
 isSearchLoading: boolean;
 onClearSearch: () => void;
 onFilterPress: () => void;
 onSearchChange: (value: string) => void;
 quickDiscoveryPresets: HomeQuickPresetAction[];
 search: string;
};

export function HomeScreenHeader({
 activeFilterCount,
 activeFilters,
 appVersion,
 discoveryContextLabel,
 gamesCount,
 isDiscoveryMode,
 isFilterActive,
 isSearchLoading,
 onClearSearch,
 onFilterPress,
 onSearchChange,
 quickDiscoveryPresets,
 search,
}: HomeScreenHeaderProps) {
 const { t } = useTranslation();

 return (
  <View
   style={{
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
   }}
  >
   <View>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs }}>
     <Text
      style={{
       fontFamily: typography.font.bold,
       fontSize: typography.size['2xl'],
       color: colors.text.primary,
       letterSpacing: -0.8,
      }}
     >
      QuestSave<Text style={{ color: colors.primary.DEFAULT }}>+</Text>
     </Text>
     <Text
      style={{
       fontFamily: typography.font.mono,
       fontSize: typography.size.xs,
       color: colors.text.tertiary,
       textTransform: 'uppercase',
       letterSpacing: typography.letterSpacing.wide,
      }}
     >
      v{appVersion}
     </Text>
    </View>

    {isDiscoveryMode && gamesCount > 0 ? (
     <Text
      style={{
       fontFamily: typography.font.regular,
       fontSize: typography.size.sm,
       color: colors.text.secondary,
       marginTop: 2,
      }}
     >
      {t('home.gamesFound', { count: gamesCount })}
     </Text>
    ) : null}

    {discoveryContextLabel ? (
     <Text
      style={{
       fontFamily: typography.font.medium,
       fontSize: typography.size.sm,
       color: colors.primary['200'],
       marginTop: 2,
      }}
     >
      {discoveryContextLabel}
     </Text>
    ) : null}
   </View>

   <SearchFilterToolbar
    value={search}
    onChangeText={onSearchChange}
    onClear={onClearSearch}
    placeholder={t('home.searchPlaceholder')}
    isLoading={isSearchLoading}
    onFilterPress={onFilterPress}
    filterAccessibilityLabel={t('home.filtersButton')}
    activeCount={activeFilterCount}
    isFilterActive={isFilterActive}
   />

   <AppliedGameFiltersRow filters={activeFilters} />

   {!isDiscoveryMode ? (
    <QuickDiscoveryPresetsRow
     title={t('home.quickDiscoveryTitle')}
     presets={quickDiscoveryPresets}
    />
   ) : null}
  </View>
 );
}
