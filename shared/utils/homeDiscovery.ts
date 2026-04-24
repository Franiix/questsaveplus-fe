import type { TFunction } from 'i18next';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { CatalogCompany, CatalogGenre, CatalogPlatform } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { HomeAppliedFilterChip } from '@/shared/models/home/HomeAppliedFilterChip.model';
import type { HomeDiscoveryContextCard } from '@/shared/models/home/HomeDiscoveryContextCard.model';
import type { HomeDiscoveryEmptyState } from '@/shared/models/home/HomeDiscoveryEmptyState.model';
import type { HomeFilterDescriptor } from '@/shared/models/home/HomeFilterDescriptor.model';
import type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
import type { HomeQuickPresetAction } from '@/shared/models/home/HomeQuickPresetAction.model';
import type { HomeQuickPresetDescriptor } from '@/shared/models/home/HomeQuickPresetDescriptor.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
import type { HomeSortOption } from '@/shared/models/home/HomeSortOption.model';

type DiscoverySubjectKey = 'developer' | 'publisher' | 'genre' | 'platform';

type DiscoverySubject = {
 key: DiscoverySubjectKey;
 label: string;
 value: string;
};

const DISCOVERY_SUBJECT_ORDER: DiscoverySubjectKey[] = [
 'developer',
 'publisher',
 'genre',
 'platform',
];

const QUICK_PRESET_GENRE_SLUGS = [
 'indie',
 'role-playing-games-rpg',
 'strategy',
 'shooter',
] as const;

export function matchesCatalogFilterValue(
 value: string | undefined,
 item: { externalId: string; slug?: string | null },
) {
 if (!value) return false;
 return item.externalId === value || item.slug === value;
}

export function resolveGenreName(
 value: string,
 genres: CatalogGenre[],
 fallback: string | undefined,
 t: TFunction,
) {
 const genre = genres.find((item) => matchesCatalogFilterValue(value, item));
 if (!genre) {
  return fallback ?? value;
 }

 return genre.slug ? t(`genres.${genre.slug}`, { defaultValue: genre.name }) : genre.name;
}

export function resolveCompanyName(
 value: string,
 companies: CatalogCompany[],
 fallback: string | undefined,
) {
 return companies.find((item) => matchesCatalogFilterValue(value, item))?.name ?? fallback ?? value;
}

export function createHomeFallbackLabels(params: HomeScreenRouteParams) {
 return {
  genre: typeof params.genreName === 'string' ? params.genreName : undefined,
  developer: typeof params.developerName === 'string' ? params.developerName : undefined,
  publisher: typeof params.publisherName === 'string' ? params.publisherName : undefined,
 } as const;
}

export function createPlatformLabelMap(platforms: CatalogPlatform[]) {
 return new Map(platforms.map((platform) => [platform.externalId, platform.name]));
}

export function resolveHomeFilterLabels(params: {
 appliedFilters: GameDiscoveryFilters;
 developers: CatalogCompany[];
 fallbackLabels: ReturnType<typeof createHomeFallbackLabels>;
 genres: CatalogGenre[];
 platformMap: Map<string, string>;
 publishers: CatalogCompany[];
 t: TFunction;
}) {
 const { appliedFilters, developers, fallbackLabels, genres, platformMap, publishers, t } = params;

 return {
  genre: appliedFilters.genre
   ? resolveGenreName(appliedFilters.genre, genres, fallbackLabels.genre, t)
   : null,
  platform: appliedFilters.platform
   ? (platformMap.get(appliedFilters.platform) ?? appliedFilters.platform)
   : null,
  developer: appliedFilters.developer
   ? resolveCompanyName(appliedFilters.developer, developers, fallbackLabels.developer)
   : null,
  publisher: appliedFilters.publisher
   ? resolveCompanyName(appliedFilters.publisher, publishers, fallbackLabels.publisher)
   : null,
 } as const;
}

export function findActiveDiscoverySubject(
 appliedFilters: GameDiscoveryFilters,
 resolvedLabels: ReturnType<typeof resolveHomeFilterLabels>,
): DiscoverySubject | null {
 for (const key of DISCOVERY_SUBJECT_ORDER) {
  const value = appliedFilters[key];
  const label = resolvedLabels[key];
  if (value && label) {
   return { key, value, label };
  }
 }

 return null;
}

export function createHomeFilterDescriptors(
 appliedFilters: GameDiscoveryFilters,
 resolvedLabels: ReturnType<typeof resolveHomeFilterLabels>,
): HomeFilterDescriptor[] {
 const filterFields: Array<keyof GameDiscoveryFilters> = [
  'genre',
  'platform',
  'developer',
  'publisher',
 ];

 return filterFields.flatMap((field) => {
  const value = appliedFilters[field];
  if (!value) {
   return [];
  }

  return [
   {
    field,
    key: `${field}-${value}`,
    label: resolvedLabels[field] ?? value,
    value,
   },
  ];
 });
}

export function createDiscoveryContextLabel(subject: DiscoverySubject | null, t: TFunction) {
 if (!subject) {
  return null;
 }

 switch (subject.key) {
  case 'developer':
   return t('home.discoveryDeveloper', { name: subject.label });
  case 'publisher':
   return t('home.discoveryPublisher', { name: subject.label });
  case 'genre':
   return t('home.discoveryGenre', { name: subject.label });
  case 'platform':
   return t('home.discoveryPlatform', { name: subject.label });
 }
}

export function createDiscoveryContextCard(
 subject: DiscoverySubject | null,
 t: TFunction,
): HomeDiscoveryContextCard | null {
 if (!subject) {
  return null;
 }

 switch (subject.key) {
  case 'developer':
   return {
    title: t('home.discoveryDeveloperTitle', { name: subject.label }),
    subtitle: t('home.discoveryDeveloperSubtitle', { name: subject.label }),
    icon: 'code',
   };
  case 'publisher':
   return {
    title: t('home.discoveryPublisherTitle', { name: subject.label }),
    subtitle: t('home.discoveryPublisherSubtitle', { name: subject.label }),
    icon: 'building',
   };
  case 'genre':
   return {
    title: t('home.discoveryGenreTitle', { name: subject.label }),
    subtitle: t('home.discoveryGenreSubtitle', { name: subject.label }),
    icon: 'compass',
   };
  case 'platform':
   return {
    title: t('home.discoveryPlatformTitle', { name: subject.label }),
    subtitle: t('home.discoveryPlatformSubtitle', { name: subject.label }),
    icon: 'cpu',
   };
 }
}

export function createRouteDiscoveryFilters(params: HomeScreenRouteParams): GameDiscoveryFilters {
 return {
  genre: typeof params.genreSlug === 'string' ? params.genreSlug : undefined,
  developer: typeof params.developerId === 'string' ? params.developerId : undefined,
  publisher: typeof params.publisherId === 'string' ? params.publisherId : undefined,
  platform: typeof params.parentPlatformId === 'string' ? params.parentPlatformId : undefined,
 };
}

export function createDiscoveryOriginLabel(params: {
 appliedFilters: GameDiscoveryFilters;
 hasActiveFilters: boolean;
 originGameName?: string;
 routeDiscoveryFilters: GameDiscoveryFilters;
 t: TFunction;
}) {
 const { appliedFilters, hasActiveFilters, originGameName, routeDiscoveryFilters, t } = params;
 const isRouteDrivenDiscovery =
  appliedFilters.genre === routeDiscoveryFilters.genre &&
  appliedFilters.developer === routeDiscoveryFilters.developer &&
  appliedFilters.publisher === routeDiscoveryFilters.publisher &&
  appliedFilters.platform === routeDiscoveryFilters.platform;

 if (!originGameName || !hasActiveFilters || !isRouteDrivenDiscovery) {
  return null;
 }

 return t('home.discoveryOrigin', { name: originGameName });
}

export function createDiscoveryEmptyState(params: {
 debouncedSearch: string;
 discoveryContextCard: HomeDiscoveryContextCard | null;
 t: TFunction;
}): HomeDiscoveryEmptyState {
 const { debouncedSearch, discoveryContextCard, t } = params;

 if (discoveryContextCard) {
  return {
   title: t('home.emptyDiscovery.title', { context: discoveryContextCard.title }),
   subtitle: t('home.emptyDiscovery.subtitle'),
  };
 }

 if (debouncedSearch.trim().length > 0) {
  return {
   title: t('home.emptySearch.title'),
   subtitle: t('home.emptySearch.subtitle'),
  };
 }

 return {
  title: t('home.emptyBrowse.title'),
  subtitle: t('home.emptyBrowse.subtitle'),
 };
}

export function createQuickDiscoveryPresets(
 genres: CatalogGenre[],
 t: TFunction,
): HomeQuickPresetDescriptor[] {
 return QUICK_PRESET_GENRE_SLUGS.flatMap((slug) => {
  const genre = genres.find((item) => item.slug === slug);
  if (!genre) return [];

  return [
   {
    key: `preset-${genre.slug}`,
    label: t(`genres.${genre.slug}`, { defaultValue: genre.name }),
    filters: { genre: genre.externalId },
   },
  ];
 });
}

export function createHomeSortOptions(_debouncedSearch: string, t: TFunction): HomeSortOption[] {
 const orderings: HomeOrdering[] = [
  BacklogSortEnum.NEWEST,
  BacklogSortEnum.OLDEST,
  BacklogSortEnum.TITLE_ASC,
  BacklogSortEnum.TITLE_DESC,
  BacklogSortEnum.RATING_DESC,
 ];

 return orderings.map((key) => ({ key, label: t(`backlog.sort.${key}`) }));
}

export function toAppliedFilterChips(
 filters: HomeFilterDescriptor[],
 onRemove: (field: keyof GameDiscoveryFilters) => void,
): HomeAppliedFilterChip[] {
 return filters.map((filter) => ({
  key: filter.key,
  label: filter.label,
  onRemove: () => onRemove(filter.field),
 }));
}

export function toQuickPresetActions(
 presets: HomeQuickPresetDescriptor[],
 onPress: (filters: GameDiscoveryFilters) => void,
): HomeQuickPresetAction[] {
 return presets.map((preset) => ({
  key: preset.key,
  label: preset.label,
  onPress: () => onPress(preset.filters),
 }));
}
