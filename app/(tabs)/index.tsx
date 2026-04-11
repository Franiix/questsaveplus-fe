import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { GameDetailSheet } from '@/components/game/GameDetailSheet';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { HomeScreenContent } from '@/components/game/HomeScreenContent';
import { HomeScreenHeader } from '@/components/game/HomeScreenHeader';
import { useHomeScreenState } from '@/hooks/useHomeScreenState';
import { useHomeScreenViewModel } from '@/hooks/useHomeScreenViewModel';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
import { colors, spacing } from '@/shared/theme/tokens';
import { toAppliedFilterChips, toQuickPresetActions } from '@/shared/utils/homeDiscovery';

const NUM_COLUMNS = 2;
const COLUMN_GAP = spacing.sm;
const HORIZONTAL_PADDING = spacing.md;

export default function HomeScreen() {
 const params = useLocalSearchParams<HomeScreenRouteParams>();
 const router = useRouter();
 const { width: screenWidth, height: screenHeight } = useWindowDimensions();
 const appVersion = Constants.expoConfig?.version ?? '1.0.0';

 const {
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
  scrollRequestKey,
  search,
  selectOrdering,
  selectedOrdering,
  setDraftFilters,
  setSearch,
  sheetGame,
 } = useHomeScreenState({ params });

 const {
  activeFilters,
  activeOrdering,
  areAllSectionsError,
  dataSources,
  discoveryContextCard,
  discoveryContextLabel,
  discoveryEmptyState,
  discoveryOriginLabel,
  errorState,
  fetchMoreDiscovery,
  games,
  homeSections,
  isDiscoveryError,
  isInitialLoading,
  isSectionsLoading,
  loadingState,
  quickDiscoveryPresets,
  refetchDiscovery,
  sortOptions,
  uiState,
 } = useHomeScreenViewModel({
  params,
  debouncedSearch,
  appliedFilters,
  selectedOrdering,
 });

 const cardWidth = useMemo(() => {
  return Math.floor(
   (screenWidth - HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
  );
 }, [screenWidth]);
 const carouselCardWidth = useMemo(
  () => Math.min(170, Math.floor(screenWidth * 0.42)),
  [screenWidth],
 );

 const handleGamePress = useCallback(
  (game: CatalogGame) => {
   const nextId = Number(game.gameId ?? game.externalId);
   if (!Number.isFinite(nextId)) return;
   router.push({ pathname: '/game/[id]', params: { id: nextId } });
  },
  [router],
 );

 const headerFilters = useMemo(
  () => toAppliedFilterChips(activeFilters, removeFilter),
  [activeFilters, removeFilter],
 );
 const headerQuickPresets = useMemo(
  () => toQuickPresetActions(quickDiscoveryPresets, applyQuickFilters),
  [applyQuickFilters, quickDiscoveryPresets],
 );

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />

   <HomeScreenHeader
    activeFilterCount={activeFilterCount}
    activeFilters={headerFilters}
    appVersion={appVersion}
    discoveryContextLabel={discoveryContextLabel}
    gamesCount={games.length}
    isDiscoveryMode={isDiscoveryMode}
    isFilterActive={hasActiveFilters || isFilterSheetOpen}
    isSearchLoading={uiState.isFetching && !uiState.isFetchingNextPage && (search.length > 0 || hasActiveFilters)}
    onClearSearch={() => setSearch('')}
    onFilterPress={openFilters}
    onSearchChange={setSearch}
    quickDiscoveryPresets={headerQuickPresets}
    search={search}
   />

   <HomeScreenContent
    activeOrdering={activeOrdering}
    areAllSectionsError={areAllSectionsError}
    cardWidth={cardWidth}
    carouselCardWidth={carouselCardWidth}
    discoveryContextCard={discoveryContextCard}
    discoveryEmptyState={discoveryEmptyState}
    discoveryOriginLabel={discoveryOriginLabel}
    fetchMoreDiscovery={fetchMoreDiscovery}
    games={games}
    homeSections={homeSections}
    isDiscoveryError={isDiscoveryError}
    isDiscoveryMode={isDiscoveryMode}
    isInitialLoading={isInitialLoading}
    isSectionsLoading={isSectionsLoading}
    onGameLongPress={openGameSheet}
    onGamePress={handleGamePress}
    onResetFilters={resetFilters}
    onRetryDiscovery={() => void refetchDiscovery()}
    onRetrySections={() => {
     homeSections.forEach((section) => {
      section.onRetry();
     });
    }}
    onSelectOrdering={selectOrdering}
    scrollRequestKey={scrollRequestKey}
    screenHeight={screenHeight}
    sortOptions={sortOptions}
    uiState={uiState}
   />

   {sheetGame ? (
    <GameDetailSheet game={sheetGame} isOpen onClose={closeGameSheet} />
   ) : null}

   <GameFilterSheet
    isVisible={isFilterSheetOpen}
    onClose={closeFilters}
    genres={dataSources.genres}
    platforms={dataSources.parentPlatforms}
    developers={dataSources.developers}
    publishers={dataSources.publishers}
    genresLoading={loadingState.genres}
    platformsLoading={loadingState.platforms}
    developersLoading={loadingState.developers}
    publishersLoading={loadingState.publishers}
    genresError={errorState.genres}
    platformsError={errorState.platforms}
    developersError={errorState.developers}
    publishersError={errorState.publishers}
    value={draftFilters}
    onChange={setDraftFilters}
    onApply={applyFilters}
    onReset={resetFilters}
   />
  </SafeAreaView>
 );
}
