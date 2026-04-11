import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
import { createRouteDiscoveryFilters } from '@/shared/utils/homeDiscovery';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';

type UseHomeScreenStateParams = {
 params: HomeScreenRouteParams;
};

export function useHomeScreenState({ params }: UseHomeScreenStateParams) {
 const router = useRouter();
 const [search, setSearch] = useState('');
 const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
 const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
 const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
 const [selectedOrdering, setSelectedOrdering] = useState<HomeOrdering | null>(null);
 const [sheetGame, setSheetGame] = useState<CatalogGame | null>(null);
 const [scrollRequestKey, setScrollRequestKey] = useState(0);
 const debouncedSearch = useDebounce(search, 400);
 const lastRouteFilterSignatureRef = useRef<string | null>(null);

 const routeDiscoveryFilters = useMemo(() => createRouteDiscoveryFilters(params), [params]);

 const hasActiveFilters =
  Boolean(appliedFilters.genre) ||
  Boolean(appliedFilters.platform) ||
  Boolean(appliedFilters.developer) ||
  Boolean(appliedFilters.publisher);
 const activeFilterCount =
  Number(Boolean(appliedFilters.genre)) +
  Number(Boolean(appliedFilters.platform)) +
  Number(Boolean(appliedFilters.developer)) +
  Number(Boolean(appliedFilters.publisher));
 const isDiscoveryMode = debouncedSearch.trim().length > 0 || hasActiveFilters;

 const requestScrollToTop = useCallback(() => {
  setScrollRequestKey((current) => current + 1);
 }, []);

 const openFilters = useCallback(() => {
  setDraftFilters(appliedFilters);
  setIsFilterSheetOpen(true);
 }, [appliedFilters]);

 const closeFilters = useCallback(() => {
  setIsFilterSheetOpen(false);
 }, []);

 const applyFilters = useCallback(() => {
  setAppliedFilters(draftFilters);
  setIsFilterSheetOpen(false);
  requestScrollToTop();
 }, [draftFilters, requestScrollToTop]);

 const resetFilters = useCallback(() => {
  const nextFilters = createEmptyGameDiscoveryFilters();
  setDraftFilters(nextFilters);
  setAppliedFilters(nextFilters);
  setSelectedOrdering(null);
  lastRouteFilterSignatureRef.current = null;
  router.replace('/');
  requestScrollToTop();
 }, [requestScrollToTop, router]);

 const removeFilter = useCallback((field: keyof GameDiscoveryFilters) => {
  setAppliedFilters((current) => ({
   ...current,
   [field]: undefined,
  }));
 }, []);

 const applyQuickFilters = useCallback((filters: GameDiscoveryFilters) => {
  setSearch('');
  setDraftFilters(filters);
  setAppliedFilters(filters);
  setSelectedOrdering(null);
  requestScrollToTop();
 }, [requestScrollToTop]);

 const selectOrdering = useCallback((ordering: HomeOrdering) => {
  setSelectedOrdering(ordering);
  requestScrollToTop();
 }, [requestScrollToTop]);

 const openGameSheet = useCallback((game: CatalogGame) => {
  setSheetGame(game);
 }, []);

 const closeGameSheet = useCallback(() => {
  setSheetGame(null);
 }, []);

 useEffect(() => {
  const signature = JSON.stringify(routeDiscoveryFilters);
  if (signature === lastRouteFilterSignatureRef.current) {
   return;
  }

  const hasRouteFilters = Object.values(routeDiscoveryFilters).some((value) => value !== undefined);
  if (!hasRouteFilters) {
   return;
  }

  lastRouteFilterSignatureRef.current = signature;
  setSearch('');
  setDraftFilters(routeDiscoveryFilters);
  setAppliedFilters(routeDiscoveryFilters);
  setSelectedOrdering(null);
  requestScrollToTop();
 }, [requestScrollToTop, routeDiscoveryFilters]);

 useEffect(() => {
  if (!isDiscoveryMode) {
   setSelectedOrdering(null);
  }
 }, [isDiscoveryMode]);

 return {
  activeFilterCount,
  applyFilters,
  applyQuickFilters,
  appliedFilters,
  closeFilters,
  closeGameSheet,
  debouncedSearch,
  draftFilters,
  hasActiveFilters,
  isDiscoveryMode,
  isFilterSheetOpen,
  openFilters,
  openGameSheet,
  removeFilter,
  resetFilters,
  routeDiscoveryFilters,
  scrollRequestKey,
  search,
  selectOrdering,
  selectedOrdering,
  setDraftFilters,
  setSearch,
  sheetGame,
 } as const;
}
