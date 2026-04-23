import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BacklogScreenContent } from '@/components/backlog/BacklogScreenContent';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { PickerModal, type PickerOption } from '@/components/base/feedback/PickerModal';
import { SortIconButton } from '@/components/base/inputs/SortIconButton';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { useBacklogGameMetadata } from '@/hooks/useBacklogGameMetadata';
import { useBacklogScreenViewModel } from '@/hooks/useBacklogScreenViewModel';
import { useBacklogSortPreference } from '@/hooks/useBacklogSortPreference';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import { useDeferredInteractionGate } from '@/hooks/useDeferredInteractionGate';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { shouldLoadBacklogMetadata } from '@/shared/utils/backlogScreen';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const HORIZONTAL_PADDING = spacing.md;

export default function BacklogScreen() {
 const { t } = useTranslation();
 const { labelMap, colorMap, iconMap } = useBacklogStatusPresentation();
 const router = useSafeRouter();
 const { prefetchGameById } = usePrefetchGameResources();
 const showToast = useToastStore((state) => state.showToast);
 const handleBackPress = useCallback(() => {
  router.replace('/(tabs)');
 }, [router]);
 const session = useAuthStore((state) => state.session);
 const backlogItems = useBacklogStore((state) => state.backlogItems);
 const isReadingList = useBacklogStore((state) => state.isReadingList);
 const isMutating = useBacklogStore((state) => state.isMutating);
 const activeMutation = useBacklogStore((state) => state.activeMutation);
 const error = useBacklogStore((state) => state.error);
 const readAll = useBacklogStore((state) => state.readAll);
 const update = useBacklogStore((state) => state.update);
 const clearBacklog = useBacklogStore((state) => state.clearBacklog);
 const clearError = useBacklogStore((state) => state.clearError);
 const deleteBacklogItem = useBacklogStore((state) => state.delete);
 const [activeFilter, setActiveFilter] = useState<BacklogStatusEnum | null>(null);
 const [search, setSearch] = useState('');
 const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
 const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
 const [pendingDeleteItem, setPendingDeleteItem] = useState<BacklogItemEntity | null>(null);
 const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>(
  createEmptyGameDiscoveryFilters,
 );
 const { sortOrder, setSortOrder } = useBacklogSortPreference();
 const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>(
  createEmptyGameDiscoveryFilters,
 );
 const catalogFiltersEnabled = isFilterSheetOpen || shouldLoadBacklogMetadata(appliedFilters);
 const {
  data: genres = [],
  isLoading: isGenresLoading,
  isError: isGenresError,
 } = useCatalogGenres(catalogFiltersEnabled);
 const {
  data: parentPlatforms = [],
  isLoading: isParentPlatformsLoading,
  isError: isParentPlatformsError,
 } = useCatalogParentPlatforms(catalogFiltersEnabled);
 const {
  data: developers = [],
  isLoading: isDevelopersLoading,
  isError: isDevelopersError,
 } = useCatalogDevelopers(catalogFiltersEnabled);
 const {
  data: publishers = [],
  isLoading: isPublishersLoading,
  isError: isPublishersError,
 } = useCatalogPublishers(catalogFiltersEnabled);
 const { data: backlogMetadata } = useBacklogGameMetadata(
  backlogItems.map((item) => item.game_id),
  shouldLoadBacklogMetadata(appliedFilters),
 );

 const userId = session?.user?.id;

 useEffect(() => {
  if (!userId) {
   clearBacklog();
   return;
  }

  void readAll(userId);
 }, [clearBacklog, readAll, userId]);

 const { activeFilterCount, filteredItems, hasAppliedFilters, playNextItems } =
  useBacklogScreenViewModel({
   activeFilter,
   appliedFilters,
   backlogItems,
   backlogMetadata,
   search,
   sortOrder,
  });

 const statusCounts = useMemo(
  () =>
   backlogItems.reduce(
    (acc, item) => {
     acc[item.status] = (acc[item.status] ?? 0) + 1;
     return acc;
    },
    {} as Partial<Record<BacklogStatusEnum, number>>,
   ),
  [backlogItems],
 );
 const deferredPrefetchEnabled = useDeferredInteractionGate({
  enabled: filteredItems.length > 0,
  delayMs: 500,
 });

 useEffect(() => {
  if (!deferredPrefetchEnabled) {
   return;
  }

  void Promise.all(
   filteredItems
    .slice(0, 3)
    .map((item) =>
     prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []),
    ),
  );
 }, [deferredPrefetchEnabled, filteredItems, prefetchGameById]);

 function handleOpenFilters() {
  setDraftFilters(appliedFilters);
  setIsFilterSheetOpen(true);
 }

 function handleApplyFilters() {
  setAppliedFilters(draftFilters);
  setIsFilterSheetOpen(false);
 }

 function handleResetFilters() {
  setDraftFilters(createEmptyGameDiscoveryFilters());
  setAppliedFilters(createEmptyGameDiscoveryFilters());
 }

 const refetch = useCallback(() => {
  if (!userId) return Promise.resolve([]);
  return readAll(userId);
 }, [readAll, userId]);
 const handleRefetch = useCallback(() => {
  void refetch();
 }, [refetch]);

 const handleItemPress = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
   router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
  },
  [prefetchGameById, router],
 );

 const handleItemPressIn = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
  },
  [prefetchGameById],
 );

 const getNextPlayNextPriority = useCallback(() => {
  const priorities = backlogItems
   .filter((item) => item.is_play_next === true)
   .map((item) => item.play_next_priority ?? 0);

  return priorities.length === 0 ? 1 : Math.max(...priorities) + 1;
 }, [backlogItems]);

 const handleOpenPlayNext = useCallback(() => {
  router.push('/(tabs)/play-next');
 }, [router]);

 const handleRequestRemove = useCallback((item: BacklogItemEntity) => {
  setPendingDeleteItem(item);
 }, []);

 const handleTogglePlayNext = useCallback(
  async (item: BacklogItemEntity) => {
   const shouldPin = item.is_play_next !== true;

   clearError();
   await update(item.id, {
    is_play_next: shouldPin,
    play_next_priority: shouldPin ? getNextPlayNextPriority() : null,
   });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(
     shouldPin ? t('backlog.playNext.pinSuccess') : t('backlog.playNext.unpinSuccess'),
     'success',
    );
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, getNextPlayNextPriority, showToast, t, update],
 );

 const handleQuickStatusChange = useCallback(
  async (item: BacklogItemEntity, status: BacklogStatusEnum) => {
   if (item.status === status) return;

   clearError();
   await update(item.id, { status });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(t('gameDetail.updateSuccess'), 'success');
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const handleRatingChange = useCallback(
  async (item: BacklogItemEntity, rating: number) => {
   clearError();
   await update(item.id, { personal_rating: rating });
   const updateError = useBacklogStore.getState().error;
   if (updateError) showToast(updateError, 'error');
  },
  [clearError, showToast, update],
 );

 const handleConfirmRemove = useCallback(async () => {
  if (!pendingDeleteItem) return;

  clearError();
  await deleteBacklogItem(pendingDeleteItem.id);
  const deleteError = useBacklogStore.getState().error;
  if (!deleteError) {
   showToast(t('gameDetail.removeSuccess'), 'success');
  } else {
   showToast(deleteError, 'error');
  }
  setPendingDeleteItem(null);
 }, [clearError, deleteBacklogItem, pendingDeleteItem, showToast, t]);

 const sortOptions = useMemo<PickerOption[]>(
  () =>
   Object.values(BacklogSortEnum).map((value) => ({
    label: t(`backlog.sort.${value}`),
    value,
   })),
  [t],
 );

 const contentState = useMemo(
  () => ({
   activeFilter,
   error,
   filteredItems,
   hasAppliedFilters,
   isReadingList,
   playNextCount: playNextItems.length,
   statusCounts,
  }),
  [
   activeFilter,
   error,
   filteredItems,
   hasAppliedFilters,
   isReadingList,
   playNextItems.length,
   statusCounts,
  ],
 );

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('tabs.backlog')} onBack={handleBackPress} />
   <View
    style={{
     paddingHorizontal: HORIZONTAL_PADDING,
     paddingTop: layout.screenContentTopPadding,
     paddingBottom: spacing.sm,
     gap: spacing.sm,
    }}
   >
    <View style={{ gap: 6 }}>
     <Text
      style={{
       fontFamily: typography.font.bold,
       fontSize: typography.size['2xl'],
       color: colors.text.primary,
       letterSpacing: typography.letterSpacing.tight,
      }}
     >
      {t('backlog.title')}
     </Text>
     <GradientUnderline />
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
     <View style={{ flex: 1 }}>
      <SearchFilterToolbar
       value={search}
       onChangeText={setSearch}
       onClear={() => setSearch('')}
       placeholder={t('backlog.searchPlaceholder')}
       onFilterPress={handleOpenFilters}
       filterAccessibilityLabel={t('home.filtersButton')}
       activeCount={activeFilterCount}
       isFilterActive={isFilterSheetOpen}
      />
     </View>
     <SortIconButton
      onPress={() => setIsSortSheetOpen(true)}
      accessibilityLabel={t('backlog.sort.label')}
      isActive={sortOrder !== BacklogSortEnum.NEWEST}
     />
    </View>
   </View>

   <BacklogScreenContent
    colorMap={colorMap}
    iconMap={iconMap}
    labelMap={labelMap}
    state={contentState}
    onFilterChange={setActiveFilter}
    onItemPress={handleItemPress}
    onItemPressIn={handleItemPressIn}
    onOpenPlayNext={handleOpenPlayNext}
    onTogglePlayNext={handleTogglePlayNext}
    onQuickStatusChange={handleQuickStatusChange}
    onRefetch={handleRefetch}
    onRequestRemove={handleRequestRemove}
    onRatingChange={handleRatingChange}
    isUpdatingStatus={isMutating && activeMutation === 'update'}
    isUpdatingPlayNext={isMutating && activeMutation === 'update'}
    removeLabel={t('gameDetail.confirmRemove.confirm')}
    retryLabel={t('home.errorRetry')}
   />

   <GameFilterSheet
    isVisible={isFilterSheetOpen}
    onClose={() => setIsFilterSheetOpen(false)}
    genres={genres}
    platforms={parentPlatforms}
    developers={developers}
    publishers={publishers}
    genresLoading={isGenresLoading}
    platformsLoading={isParentPlatformsLoading}
    developersLoading={isDevelopersLoading}
    publishersLoading={isPublishersLoading}
    genresError={isGenresError}
    platformsError={isParentPlatformsError}
    developersError={isDevelopersError}
    publishersError={isPublishersError}
    value={draftFilters}
    onChange={setDraftFilters}
    onApply={handleApplyFilters}
    onReset={handleResetFilters}
   />

   <PickerModal
    isVisible={isSortSheetOpen}
    onClose={() => setIsSortSheetOpen(false)}
    title={t('backlog.sort.title')}
    options={sortOptions}
    value={sortOrder}
    onChange={(v) => setSortOrder(v as BacklogSortEnum)}
   />

   <ConfirmModal
    visible={pendingDeleteItem !== null}
    title={t('gameDetail.confirmRemove.title')}
    message={t('gameDetail.confirmRemove.message')}
    confirmLabel={t('gameDetail.confirmRemove.confirm')}
    cancelLabel={t('common.cancel')}
    isDestructive
    onConfirm={() => void handleConfirmRemove()}
    onCancel={() => setPendingDeleteItem(null)}
   />
  </SafeAreaView>
 );
}
