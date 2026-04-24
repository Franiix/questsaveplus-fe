import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SortIconButton } from '@/components/base/inputs/SortIconButton';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { AppliedGameFiltersRow } from '@/components/game/AppliedGameFiltersRow';
import { QuickDiscoveryPresetsRow } from '@/components/game/QuickDiscoveryPresetsRow';
import type { HomeAppliedFilterChip } from '@/shared/models/home/HomeAppliedFilterChip.model';
import type { HomeQuickPresetAction } from '@/shared/models/home/HomeQuickPresetAction.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type HomeScreenHeaderProps = {
 activeFilterCount: number;
 activeFilters: HomeAppliedFilterChip[];
 appVersion: string;
 isUpdateAvailable?: boolean;
 latestVersion?: string | null;
 discoveryContextLabel: string | null;
 gamesCount: number;
 isDiscoveryMode: boolean;
 isFilterActive: boolean;
 isSearchLoading: boolean;
 onClearSearch: () => void;
 onFilterPress: () => void;
 onPressUpdate?: () => void;
 onSortPress?: () => void;
 onSearchChange: (value: string) => void;
 quickDiscoveryPresets: HomeQuickPresetAction[];
 search: string;
 showSortButton?: boolean;
 sortAccessibilityLabel?: string;
 isSortActive?: boolean;
};

export function HomeScreenHeader({
 activeFilterCount,
 activeFilters,
 appVersion,
 isUpdateAvailable = false,
 latestVersion = null,
 discoveryContextLabel,
 gamesCount,
 isDiscoveryMode,
 isFilterActive,
 isSearchLoading,
 onClearSearch,
 onFilterPress,
 onPressUpdate,
 onSortPress,
 onSearchChange,
 quickDiscoveryPresets,
 search,
 showSortButton = false,
 sortAccessibilityLabel,
 isSortActive = false,
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
     {isUpdateAvailable && onPressUpdate ? (
      <Pressable
       onPress={onPressUpdate}
       style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: `${colors.success}22`,
        borderWidth: 1,
        borderColor: `${colors.success}55`,
       }}
      >
       <FontAwesome5 name="download" size={10} color={colors.success} solid />
       <Text
        style={{
         fontFamily: typography.font.semibold,
         fontSize: typography.size.xs,
         color: colors.success,
         letterSpacing: typography.letterSpacing.wide,
         textTransform: 'uppercase',
        }}
       >
        {t('home.updateAvailable', { version: latestVersion ?? appVersion })}
       </Text>
      </Pressable>
     ) : null}
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

   <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
    <View style={{ flex: 1 }}>
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
    </View>
    {showSortButton && onSortPress ? (
     <SortIconButton
      onPress={onSortPress}
      accessibilityLabel={sortAccessibilityLabel ?? t('backlog.sort.label')}
      isActive={isSortActive}
     />
    ) : null}
   </View>

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
