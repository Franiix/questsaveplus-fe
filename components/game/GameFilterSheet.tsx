import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { BottomSheet } from '@/components/base/feedback/BottomSheet';
import {
 SearchableSelectInput,
 type SearchableSelectOption,
} from '@/components/base/inputs/SearchableSelectInput';
import type { CatalogCompany, CatalogGenre, CatalogPlatform } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';

const SECTION_LABEL_STYLE = {
 color: colors.text.primary,
 fontSize: typography.size.sm,
 fontFamily: typography.font.semibold,
} as const;

function FilterSectionLabel({ children }: { children: string }) {
 return <Text style={SECTION_LABEL_STYLE}>{children}</Text>;
}

function getSelectPlaceholder(
 isLoading: boolean,
 isError: boolean,
 isEmpty: boolean,
 defaultLabel: string,
 t: ReturnType<typeof useTranslation>['t'],
): string {
 if (isLoading) return t('common.loadingOptions');
 if (isError) return t('common.errorLoadingOptions');
 if (isEmpty) return t('common.noOptionsAvailable');
 return defaultLabel;
}

const PLATFORM_GROUP_ORDER: Record<string, number> = {
 'platformFamilies.playstation': 0,
 'platformFamilies.xbox': 1,
 'platformFamilies.nintendo': 2,
 'platformFamilies.pc': 3,
 'platformFamilies.mobile': 4,
 'platformFamilies.other': 5,
};

const SUGGESTED_PLATFORM_TERMS = [
 'playstation 5',
 'ps5',
 'xbox series',
 'nintendo switch 2',
 'nintendo switch',
 'pc',
 'windows',
];

function getPlatformFamilyLabelKey(platform: CatalogPlatform) {
 const slug = platform.slug?.toLowerCase() ?? '';
 const name = platform.name.toLowerCase();

 if (slug.includes('playstation') || slug.startsWith('ps') || name.includes('playstation')) {
  return 'platformFamilies.playstation';
 }

 if (slug.includes('xbox') || name.includes('xbox')) {
  return 'platformFamilies.xbox';
 }

 if (slug.includes('nintendo') || slug.includes('switch') || name.includes('nintendo')) {
  return 'platformFamilies.nintendo';
 }

 if (
  slug === 'pc' ||
  slug.includes('windows') ||
  slug.includes('mac') ||
  slug.includes('linux') ||
  name === 'pc' ||
  name.includes('windows') ||
  name.includes('mac') ||
  name.includes('linux')
 ) {
  return 'platformFamilies.pc';
 }

 if (slug.includes('ios') || slug.includes('android') || name.includes('mobile')) {
  return 'platformFamilies.mobile';
 }

 return 'platformFamilies.other';
}

type GameFilterSheetProps = {
 isVisible: boolean;
 onClose: () => void;
 genres: CatalogGenre[];
 platforms: CatalogPlatform[];
 developers: CatalogCompany[];
 publishers: CatalogCompany[];
 genresLoading?: boolean;
 platformsLoading?: boolean;
 developersLoading?: boolean;
 publishersLoading?: boolean;
 genresError?: boolean;
 platformsError?: boolean;
 developersError?: boolean;
 publishersError?: boolean;
 value: GameDiscoveryFilters;
 onChange: (value: GameDiscoveryFilters) => void;
 onApply: () => void;
 onReset: () => void;
};

export function GameFilterSheet({
 isVisible,
 onClose,
 genres,
 platforms,
 developers,
 publishers,
 genresLoading = false,
 platformsLoading = false,
 developersLoading = false,
 publishersLoading = false,
 genresError = false,
 platformsError = false,
 developersError = false,
 publishersError = false,
 value,
 onChange,
 onApply,
 onReset,
}: GameFilterSheetProps) {
 const { t } = useTranslation();
 const title = t('home.filtersTitle');
 const genresTitle = t('home.genresTitle');
 const platformsTitle = t('home.platformsTitle');
 const applyLabel = t('home.applyFilters');
 const resetLabel = t('home.resetFilters');
 const developerPlaceholder = t('home.selectDeveloper');
 const publisherPlaceholder = t('home.selectPublisher');
 const genrePlaceholder = t('home.selectGenre');
 const platformPlaceholder = t('home.selectPlatform');
 const genreOptions = genres.map<SearchableSelectOption>((genre) => ({
  label: genre.slug ? t(`genres.${genre.slug}`, { defaultValue: genre.name }) : genre.name,
  value: genre.externalId,
  searchText: [genre.slug, genre.name].filter(Boolean).join(' '),
 }));
 const developerOptions = developers.map<SearchableSelectOption>((developer) => ({
  label: developer.name,
  value: developer.externalId,
  searchText: developer.slug ?? undefined,
 }));
 const publisherOptions = publishers.map<SearchableSelectOption>((publisher) => ({
  label: publisher.name,
  value: publisher.externalId,
  searchText: publisher.slug ?? undefined,
 }));
 const platformOptions = platforms.map<SearchableSelectOption>((platform) => ({
  label: platform.name,
  value: platform.externalId,
  searchText: [platform.slug, platform.name].filter(Boolean).join(' '),
  groupLabel: t(getPlatformFamilyLabelKey(platform)),
  groupOrder: PLATFORM_GROUP_ORDER[getPlatformFamilyLabelKey(platform)] ?? 99,
 }));
 const suggestedDeveloperOptions = developerOptions.slice(0, 8);
 const suggestedPublisherOptions = publisherOptions.slice(0, 8);
 const suggestedPlatformOptions = platformOptions.filter((platform) =>
  SUGGESTED_PLATFORM_TERMS.some((term) => platform.searchText?.toLowerCase().includes(term)),
 );

 return (
  <BottomSheet isVisible={isVisible} onClose={onClose} title={title}>
   <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
    <View style={{ gap: spacing.lg }}>
     <View style={{ gap: spacing.sm }}>
      <FilterSectionLabel>{genresTitle}</FilterSectionLabel>
      <SearchableSelectInput
       options={genreOptions}
       value={value.genre}
       onChange={(genre) => onChange({ ...value, genre })}
       placeholder={getSelectPlaceholder(
        genresLoading,
        genresError,
        genres.length === 0,
        genrePlaceholder,
        t,
       )}
       title={genresTitle}
       searchPlaceholder={t('common.searchOptions')}
       accessibilityLabel={genresTitle}
       allowClear
       clearLabel={t('common.none')}
       isDisabled={genresLoading || genresError || genres.length === 0}
       emptyLabel={t('common.noOptionsAvailable')}
       emptySearchLabel={t('common.noMatchingOptions')}
      />
     </View>

     <View style={{ gap: spacing.sm }}>
      <FilterSectionLabel>{t('home.developersTitle')}</FilterSectionLabel>
      <SearchableSelectInput
       options={developerOptions}
       suggestedOptions={suggestedDeveloperOptions}
       value={value.developer}
       onChange={(developer) => onChange({ ...value, developer })}
       placeholder={getSelectPlaceholder(
        developersLoading,
        developersError,
        developers.length === 0,
        developerPlaceholder,
        t,
       )}
       title={t('home.developersTitle')}
       searchPlaceholder={t('common.searchOptions')}
       accessibilityLabel={t('home.developersTitle')}
       allowClear
       clearLabel={t('common.none')}
       isDisabled={developersLoading || developersError || developers.length === 0}
       emptyLabel={t('common.noOptionsAvailable')}
       emptySearchLabel={t('common.noMatchingOptions')}
       suggestedTitle={t('common.suggestedOptions')}
       allOptionsTitle={t('common.allOptions')}
      />
     </View>

     <View style={{ gap: spacing.sm }}>
      <FilterSectionLabel>{t('home.publishersTitle')}</FilterSectionLabel>
      <SearchableSelectInput
       options={publisherOptions}
       suggestedOptions={suggestedPublisherOptions}
       value={value.publisher}
       onChange={(publisher) => onChange({ ...value, publisher })}
       placeholder={getSelectPlaceholder(
        publishersLoading,
        publishersError,
        publishers.length === 0,
        publisherPlaceholder,
        t,
       )}
       title={t('home.publishersTitle')}
       searchPlaceholder={t('common.searchOptions')}
       accessibilityLabel={t('home.publishersTitle')}
       allowClear
       clearLabel={t('common.none')}
       isDisabled={publishersLoading || publishersError || publishers.length === 0}
       emptyLabel={t('common.noOptionsAvailable')}
       emptySearchLabel={t('common.noMatchingOptions')}
       suggestedTitle={t('common.suggestedOptions')}
       allOptionsTitle={t('common.allOptions')}
      />
     </View>

     <View style={{ gap: spacing.sm }}>
      <FilterSectionLabel>{platformsTitle}</FilterSectionLabel>
      <SearchableSelectInput
       options={platformOptions}
       suggestedOptions={suggestedPlatformOptions}
       value={value.platform}
       onChange={(platform) => onChange({ ...value, platform })}
       placeholder={getSelectPlaceholder(
        platformsLoading,
        platformsError,
        platforms.length === 0,
        platformPlaceholder,
        t,
       )}
       title={platformsTitle}
       searchPlaceholder={t('common.searchOptions')}
       accessibilityLabel={platformsTitle}
       allowClear
       clearLabel={t('common.none')}
       isDisabled={platformsLoading || platformsError || platforms.length === 0}
       emptyLabel={t('common.noOptionsAvailable')}
       emptySearchLabel={t('common.noMatchingOptions')}
       suggestedTitle={t('common.suggestedOptions')}
      />
     </View>
    </View>
   </ScrollView>

   <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
    <View style={{ flex: 1 }}>
     <BaseButton label={resetLabel} onPress={onReset} variant="outlined" fullWidth />
    </View>
    <View style={{ flex: 1 }}>
     <BaseButton label={applyLabel} onPress={onApply} fullWidth />
    </View>
   </View>
  </BottomSheet>
 );
}
