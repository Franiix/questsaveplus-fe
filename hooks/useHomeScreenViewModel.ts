import { useMemo } from 'react';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import { useGames } from '@/hooks/useGames';
import { useHomeDiscoveryContext } from '@/hooks/useHomeDiscoveryContext';
import { useHomeEditorialSections } from '@/hooks/useHomeEditorialSections';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';

export type { HomeAppliedFilterChip } from '@/shared/models/home/HomeAppliedFilterChip.model';
export type { HomeDiscoveryContextCard } from '@/shared/models/home/HomeDiscoveryContextCard.model';
export type { HomeFilterDescriptor } from '@/shared/models/home/HomeFilterDescriptor.model';
export type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
export type { HomeQuickPresetAction } from '@/shared/models/home/HomeQuickPresetAction.model';
export type { HomeQuickPresetDescriptor } from '@/shared/models/home/HomeQuickPresetDescriptor.model';
export type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
export type { HomeSectionViewModel } from '@/shared/models/home/HomeSectionViewModel.model';
export type { HomeSortOption } from '@/shared/models/home/HomeSortOption.model';

type UseHomeScreenViewModelParams = {
 appliedFilters: GameDiscoveryFilters;
 debouncedSearch: string;
 isFilterSheetOpen: boolean;
 params: HomeScreenRouteParams;
 selectedOrdering: HomeOrdering | null;
};

function toCatalogOrdering(ordering: HomeOrdering) {
 switch (ordering) {
  case BacklogSortEnum.NEWEST:
   return '-released';
  case BacklogSortEnum.OLDEST:
   return 'released';
  case BacklogSortEnum.RATING_DESC:
   return '-rating';
  case BacklogSortEnum.TITLE_ASC:
  case BacklogSortEnum.TITLE_DESC:
   return undefined;
 }
}

function getReleaseTimestamp(game: CatalogGame) {
 const timestamp = game.releasedAt ? Date.parse(game.releasedAt) : Number.NaN;
 return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortCatalogGames(games: CatalogGame[], ordering: HomeOrdering) {
 const sorted = [...games];

 switch (ordering) {
  case BacklogSortEnum.NEWEST:
   return sorted.sort((left, right) => getReleaseTimestamp(right) - getReleaseTimestamp(left));
  case BacklogSortEnum.OLDEST:
   return sorted.sort((left, right) => getReleaseTimestamp(left) - getReleaseTimestamp(right));
  case BacklogSortEnum.TITLE_ASC:
   return sorted.sort((left, right) => left.name.localeCompare(right.name));
  case BacklogSortEnum.TITLE_DESC:
   return sorted.sort((left, right) => right.name.localeCompare(left.name));
  case BacklogSortEnum.RATING_DESC:
   return sorted.sort((left, right) => (right.rating ?? -1) - (left.rating ?? -1));
 }
}

export function useHomeScreenViewModel({
 appliedFilters,
 debouncedSearch,
 isFilterSheetOpen,
 params,
 selectedOrdering,
}: UseHomeScreenViewModelParams) {
 const defaultOrdering = BacklogSortEnum.NEWEST;
 const activeOrdering = selectedOrdering ?? defaultOrdering;
 const hasSearch = debouncedSearch.trim().length > 0;
 const orderingParam = hasSearch ? undefined : toCatalogOrdering(activeOrdering);

 // Le query catalog sparano solo quando il pannello filtri è aperto o ci sono
 // filtri attivi — evita 4 richieste di rete inutili al mount dell'home screen.
 const hasCatalogActiveFilters =
  Boolean(appliedFilters.genre) ||
  Boolean(appliedFilters.platform) ||
  Boolean(appliedFilters.developer) ||
  Boolean(appliedFilters.publisher);

 const catalogEnabled =
  isFilterSheetOpen || hasCatalogActiveFilters || debouncedSearch.trim().length > 0;

 const {
  data: genres = [],
  isLoading: isGenresLoading,
  isError: isGenresError,
 } = useCatalogGenres(catalogEnabled);
 const {
  data: parentPlatforms = [],
  isLoading: isParentPlatformsLoading,
  isError: isParentPlatformsError,
 } = useCatalogParentPlatforms(catalogEnabled);
 const {
  data: developers = [],
  isLoading: isDevelopersLoading,
  isError: isDevelopersError,
 } = useCatalogDevelopers(catalogEnabled);
 const {
  data: publishers = [],
  isLoading: isPublishersLoading,
  isError: isPublishersError,
 } = useCatalogPublishers(catalogEnabled);

 const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, isError, refetch } =
  useGames({
   search: debouncedSearch,
   filters: appliedFilters,
   ordering: orderingParam,
  });

 const games = useMemo(
  () => sortCatalogGames(data?.pages.flatMap((page) => page.items) ?? [], activeOrdering),
  [activeOrdering, data],
 );
 const {
  activeFilters,
  discoveryContextCard,
  discoveryContextLabel,
  discoveryEmptyState,
  discoveryOriginLabel,
  hasActiveFilters,
  isDiscoveryMode,
  quickDiscoveryPresets,
  sortOptions,
 } = useHomeDiscoveryContext({
  appliedFilters,
  debouncedSearch,
  developers,
  genres,
  params,
  platforms: parentPlatforms,
  publishers,
 });
 const { areAllSectionsError, homeSections, isSectionsLoading } = useHomeEditorialSections();

 const isInitialLoading = isFetching && games.length === 0;

 return {
  activeFilters,
  activeOrdering,
  areAllSectionsError,
  dataSources: {
   developers,
   genres,
   parentPlatforms,
   publishers,
  },
  discoveryContextCard,
  discoveryContextLabel,
  discoveryEmptyState,
  discoveryOriginLabel,
  games,
  homeSections,
  isDiscoveryError: isError,
  isDiscoveryMode,
  isInitialLoading,
  isSectionsLoading,
  loadingState: {
   developers: isDevelopersLoading,
   genres: isGenresLoading,
   platforms: isParentPlatformsLoading,
   publishers: isPublishersLoading,
  },
  quickDiscoveryPresets,
  refetchDiscovery: refetch,
  sortOptions,
  uiState: {
   hasActiveFilters,
   hasNextPage: Boolean(hasNextPage),
   isFetching,
   isFetchingNextPage,
  },
  errorState: {
   developers: isDevelopersError,
   genres: isGenresError,
   platforms: isParentPlatformsError,
   publishers: isPublishersError,
  },
  fetchMoreDiscovery: () => {
   if (hasNextPage && !isFetchingNextPage) {
    void fetchNextPage();
   }
  },
 } as const;
}
