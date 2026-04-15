import { useMemo } from 'react';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import { useHomeDiscoveryContext } from '@/hooks/useHomeDiscoveryContext';
import { useHomeEditorialSections } from '@/hooks/useHomeEditorialSections';
import { useGames } from '@/hooks/useGames';
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
export type { HomeSortOption } from '@/shared/models/home/HomeSortOption.model';
export type { HomeSectionViewModel } from '@/shared/models/home/HomeSectionViewModel.model';

type UseHomeScreenViewModelParams = {
 appliedFilters: GameDiscoveryFilters;
 debouncedSearch: string;
 isFilterSheetOpen: boolean;
 params: HomeScreenRouteParams;
 selectedOrdering: HomeOrdering | null;
};

export function useHomeScreenViewModel({
 appliedFilters,
 debouncedSearch,
 isFilterSheetOpen,
 params,
 selectedOrdering,
}: UseHomeScreenViewModelParams) {
 const defaultOrdering = useMemo(() => {
  if (debouncedSearch.trim().length > 0) {
   return 'relevance' as const;
  }

  return '-rating' as const;
 }, [debouncedSearch]);
 const activeOrdering = selectedOrdering ?? defaultOrdering;
 const orderingParam = activeOrdering === 'relevance' ? undefined : activeOrdering;

 // Le query catalog sparano solo quando il pannello filtri è aperto o ci sono
 // filtri attivi — evita 4 richieste di rete inutili al mount dell'home screen.
  const hasCatalogActiveFilters =
    Boolean(appliedFilters.genre) ||
    Boolean(appliedFilters.platform) ||
    Boolean(appliedFilters.developer) ||
    Boolean(appliedFilters.publisher);

  const catalogEnabled = isFilterSheetOpen || hasCatalogActiveFilters;

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

 const {
  data,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  isError,
  refetch,
 } = useGames({
  search: debouncedSearch,
  filters: appliedFilters,
  ordering: orderingParam,
 });

 const games = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
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
