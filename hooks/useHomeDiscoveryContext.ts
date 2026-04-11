import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogCompany, CatalogGenre, CatalogPlatform } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
import {
 createDiscoveryContextCard,
 createDiscoveryContextLabel,
 createDiscoveryEmptyState,
 createDiscoveryOriginLabel,
 createHomeFallbackLabels,
 createHomeFilterDescriptors,
 createHomeSortOptions,
 createPlatformLabelMap,
 createQuickDiscoveryPresets,
 createRouteDiscoveryFilters,
 findActiveDiscoverySubject,
 resolveHomeFilterLabels,
} from '@/shared/utils/homeDiscovery';

type UseHomeDiscoveryContextParams = {
 appliedFilters: GameDiscoveryFilters;
 debouncedSearch: string;
 developers: CatalogCompany[];
 genres: CatalogGenre[];
 params: HomeScreenRouteParams;
 platforms: CatalogPlatform[];
 publishers: CatalogCompany[];
};

export function useHomeDiscoveryContext({
 appliedFilters,
 debouncedSearch,
 developers,
 genres,
 params,
 platforms,
 publishers,
}: UseHomeDiscoveryContextParams) {
 const { t } = useTranslation();
 const fallbackLabels = useMemo(() => createHomeFallbackLabels(params), [params]);

 const hasActiveFilters =
  Boolean(appliedFilters.genre) ||
  Boolean(appliedFilters.platform) ||
  Boolean(appliedFilters.developer) ||
  Boolean(appliedFilters.publisher);
 const isDiscoveryMode = debouncedSearch.trim().length > 0 || hasActiveFilters;

 const platformMap = useMemo(() => createPlatformLabelMap(platforms), [platforms]);
 const resolvedFilterLabels = useMemo(
  () =>
   resolveHomeFilterLabels({
    appliedFilters,
    developers,
    fallbackLabels,
    genres,
    platformMap,
    publishers,
    t,
   }),
  [appliedFilters, developers, fallbackLabels, genres, platformMap, publishers, t],
 );
 const activeDiscoverySubject = useMemo(
  () => findActiveDiscoverySubject(appliedFilters, resolvedFilterLabels),
  [appliedFilters, resolvedFilterLabels],
 );

 const activeFilters = useMemo(
  () => createHomeFilterDescriptors(appliedFilters, resolvedFilterLabels),
  [appliedFilters, resolvedFilterLabels],
 );

 const discoveryContextLabel = useMemo(
  () => createDiscoveryContextLabel(activeDiscoverySubject, t),
  [activeDiscoverySubject, t],
 );

 const discoveryContextCard = useMemo(
  () => createDiscoveryContextCard(activeDiscoverySubject, t),
  [activeDiscoverySubject, t],
 );

 const routeDiscoveryFilters = useMemo(() => createRouteDiscoveryFilters(params), [params]);

 const discoveryOriginLabel = useMemo(
  () =>
   createDiscoveryOriginLabel({
    appliedFilters,
    hasActiveFilters,
    originGameName: params.originGameName,
    routeDiscoveryFilters,
    t,
   }),
  [appliedFilters, hasActiveFilters, params.originGameName, routeDiscoveryFilters, t],
 );

 const discoveryEmptyState = useMemo(
  () => createDiscoveryEmptyState({ debouncedSearch, discoveryContextCard, t }),
  [debouncedSearch, discoveryContextCard, t],
 );

 const quickDiscoveryPresets = useMemo(() => createQuickDiscoveryPresets(genres, t), [genres, t]);

 const sortOptions = useMemo(() => createHomeSortOptions(debouncedSearch, t), [debouncedSearch, t]);

 return {
  activeFilters,
  discoveryContextCard,
  discoveryContextLabel,
  discoveryEmptyState,
  discoveryOriginLabel,
  hasActiveFilters,
  isDiscoveryMode,
  quickDiscoveryPresets,
  sortOptions,
 } as const;
}
