import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PickerModal, type PickerOption } from '@/components/base/feedback/PickerModal';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { GameDetailSheet } from '@/components/game/GameDetailSheet';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { HomeScreenContent } from '@/components/game/HomeScreenContent';
import { HomeScreenHeader } from '@/components/game/HomeScreenHeader';
import { ProfileSetupOnboardingModal } from '@/components/onboarding/ProfileSetupOnboardingModal';
import { useAppUpdateAvailabilityWithOptions } from '@/hooks/useAppUpdateAvailability';
import { useDeferredInteractionGate } from '@/hooks/useDeferredInteractionGate';
import { useHomeScreenState } from '@/hooks/useHomeScreenState';
import { useHomeScreenViewModel } from '@/hooks/useHomeScreenViewModel';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
import type { HomeScreenRouteParams } from '@/shared/models/home/HomeScreenRouteParams.model';
import { colors, spacing } from '@/shared/theme/tokens';
import { toAppliedFilterChips, toQuickPresetActions } from '@/shared/utils/homeDiscovery';
import {
 consumeProfileSetupOnboarding,
 getProfileSetupOnboardingPending,
} from '@/shared/utils/profileSetupOnboarding';
import { useAuthStore } from '@/stores/auth.store';

const NUM_COLUMNS = 2;
const COLUMN_GAP = spacing.sm;
const HORIZONTAL_PADDING = spacing.md;

export default function HomeScreen() {
 const { t } = useTranslation();
 const params = useLocalSearchParams<HomeScreenRouteParams>();
 const router = useSafeRouter();
 const session = useAuthStore((state) => state.session);
 const { width: screenWidth, height: screenHeight } = useWindowDimensions();
 const deferredHomeSideEffectsEnabled = useDeferredInteractionGate({ delayMs: 500 });
 const { currentVersion, isUpdateAvailable, latestVersion, canOpenStore, openStore } =
  useAppUpdateAvailabilityWithOptions(deferredHomeSideEffectsEnabled);

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
  isFilterSheetOpen,
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
 const { prefetchGame, prefetchGames } = usePrefetchGameResources();
 const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
 const [isFirstRunOnboardingVisible, setIsFirstRunOnboardingVisible] = useState(false);
 const pickerSortOptions = useMemo<PickerOption[]>(
  () => sortOptions.map((option) => ({ label: option.label, value: option.key })),
  [sortOptions],
 );

 const checkFirstRunOnboarding = useCallback(() => {
  const userId = session?.user?.id;

  if (!userId) {
   setIsFirstRunOnboardingVisible(false);
   return () => undefined;
  }

  let isCancelled = false;

  void getProfileSetupOnboardingPending(userId).then((isPending) => {
   if (!isCancelled) {
    setIsFirstRunOnboardingVisible(isPending);
   }
  });

  return () => {
   isCancelled = true;
  };
 }, [session?.user?.id]);

 useEffect(() => checkFirstRunOnboarding(), [checkFirstRunOnboarding]);
 useFocusEffect(checkFirstRunOnboarding);

 useEffect(() => {
  if (!deferredHomeSideEffectsEnabled) {
   return;
  }

  const primaryCandidates = isDiscoveryMode
   ? games.slice(0, 6)
   : homeSections.flatMap((section) => section.games.slice(0, 2)).slice(0, 8);

  void prefetchGames(primaryCandidates, primaryCandidates.length);
 }, [deferredHomeSideEffectsEnabled, games, homeSections, isDiscoveryMode, prefetchGames]);

 const handleGamePress = useCallback(
  (game: CatalogGame) => {
   const nextId = Number(game.gameId ?? game.externalId);
   if (!Number.isFinite(nextId)) return;
   void prefetchGame(game);
   router.push({ pathname: '/game/[id]', params: { id: nextId } });
  },
  [prefetchGame, router],
 );

 const handleGamePressIn = useCallback(
  (game: CatalogGame) => {
   void prefetchGame(game);
  },
  [prefetchGame],
 );

 const headerFilters = useMemo(
  () => toAppliedFilterChips(activeFilters, removeFilter),
  [activeFilters, removeFilter],
 );
 const headerQuickPresets = useMemo(
  () => toQuickPresetActions(quickDiscoveryPresets, applyQuickFilters),
  [applyQuickFilters, quickDiscoveryPresets],
 );
 const handleCloseFirstRunOnboarding = useCallback(() => {
  const userId = session?.user?.id;
  setIsFirstRunOnboardingVisible(false);

  if (!userId) {
   return;
  }

  void consumeProfileSetupOnboarding(userId);
 }, [session?.user?.id]);

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />

   <HomeScreenHeader
    activeFilterCount={activeFilterCount}
    activeFilters={headerFilters}
    appVersion={currentVersion}
    isUpdateAvailable={isUpdateAvailable}
    latestVersion={latestVersion}
    discoveryContextLabel={discoveryContextLabel}
    gamesCount={games.length}
    isDiscoveryMode={isDiscoveryMode}
    isFilterActive={hasActiveFilters || isFilterSheetOpen}
    isSearchLoading={
     uiState.isFetching && !uiState.isFetchingNextPage && (search.length > 0 || hasActiveFilters)
    }
    onClearSearch={() => setSearch('')}
    onFilterPress={openFilters}
    onPressUpdate={isUpdateAvailable && canOpenStore ? () => void openStore() : undefined}
    onSortPress={() => setIsSortSheetOpen(true)}
    onSearchChange={setSearch}
    quickDiscoveryPresets={headerQuickPresets}
    search={search}
    showSortButton={isDiscoveryMode}
    sortAccessibilityLabel={t('backlog.sort.label')}
    isSortActive={activeOrdering !== BacklogSortEnum.NEWEST}
   />

   <HomeScreenContent
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
    onGamePressIn={handleGamePressIn}
    onResetFilters={resetFilters}
    onRetryDiscovery={() => void refetchDiscovery()}
    onRetrySections={() => {
     homeSections.forEach((section) => {
      section.onRetry();
     });
    }}
    scrollRequestKey={scrollRequestKey}
    screenHeight={screenHeight}
    uiState={uiState}
   />

   {sheetGame ? <GameDetailSheet game={sheetGame} isOpen onClose={closeGameSheet} /> : null}

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

   <PickerModal
    isVisible={isSortSheetOpen}
    onClose={() => setIsSortSheetOpen(false)}
    title={t('backlog.sort.title')}
    options={pickerSortOptions}
    value={activeOrdering}
    onChange={(value) => selectOrdering(value as HomeOrdering)}
   />

   <ProfileSetupOnboardingModal
    visible={isFirstRunOnboardingVisible}
    onClose={handleCloseFirstRunOnboarding}
   />
  </SafeAreaView>
 );
}
