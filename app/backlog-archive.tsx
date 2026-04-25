import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, InteractionManager, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BacklogStatusCelebrationOverlay } from '@/components/backlog/BacklogStatusCelebrationOverlay';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { PickerModal, type PickerOption } from '@/components/base/feedback/PickerModal';
import { SortIconButton } from '@/components/base/inputs/SortIconButton';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { FilterChipRow } from '@/components/game/FilterChipRow';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { useBacklogGameMetadata } from '@/hooks/useBacklogGameMetadata';
import { useBacklogScreenViewModel } from '@/hooks/useBacklogScreenViewModel';
import { useBacklogSortPreference } from '@/hooks/useBacklogSortPreference';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { shouldLoadBacklogMetadata } from '@/shared/utils/backlogScreen';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const LIST_CONTENT_STYLE = {
 paddingHorizontal: spacing.md,
 paddingTop: spacing.sm,
 paddingBottom: layout.screenBottomPadding,
 gap: spacing.sm,
} as const;

export default function BacklogArchiveScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const { labelMap, colorMap, iconMap } = useBacklogStatusPresentation();
 const { prefetchGameById } = usePrefetchGameResources();
 const showToast = useToastStore((state) => state.showToast);
 const session = useAuthStore((state) => state.session);
 const archivedBacklogItems = useBacklogStore((state) => state.archivedBacklogItems);
 const isReadingArchiveList = useBacklogStore((state) => state.isReadingArchiveList);
 const isMutating = useBacklogStore((state) => state.isMutating);
 const activeMutation = useBacklogStore((state) => state.activeMutation);
 const error = useBacklogStore((state) => state.error);
 const readAll = useBacklogStore((state) => state.readAll);
 const update = useBacklogStore((state) => state.update);
 const deleteBacklogItem = useBacklogStore((state) => state.delete);
 const clearError = useBacklogStore((state) => state.clearError);
 const clearBacklog = useBacklogStore((state) => state.clearBacklog);
 const [pendingDeleteItem, setPendingDeleteItem] = useState<BacklogItemEntity | null>(null);
 const [pendingRestoreItem, setPendingRestoreItem] = useState<BacklogItemEntity | null>(null);
 const [archiveCelebration, setArchiveCelebration] = useState<{
  mode: 'restore';
  trigger: number;
 } | null>(null);
 const [activeFilter, setActiveFilter] = useState<BacklogItemEntity['status'] | null>(null);
 const [search, setSearch] = useState('');
 const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
 const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
 const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>(
  createEmptyGameDiscoveryFilters,
 );
 const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>(
  createEmptyGameDiscoveryFilters,
 );
 const { sortOrder, setSortOrder } = useBacklogSortPreference(
  'archive_sort_order',
  BacklogSortEnum.NEWEST,
 );

 const userId = session?.user?.id;
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

 useEffect(() => {
  if (!userId) {
   clearBacklog();
   return;
  }

  void readAll(userId, { target: 'archivedBacklogItems', includeArchived: true });
 }, [clearBacklog, readAll, userId]);

 const { data: backlogMetadata } = useBacklogGameMetadata(
  archivedBacklogItems.map((item) => item.game_id),
  shouldLoadBacklogMetadata(appliedFilters),
 );
 const { activeFilterCount, filteredItems } = useBacklogScreenViewModel({
  activeFilter,
  appliedFilters,
  backlogItems: archivedBacklogItems,
  backlogMetadata,
  search,
  sortOrder,
 });
 const isArchiveToolbarDisabled = archivedBacklogItems.length === 0;
 const archivedItems = filteredItems;
 const statusCounts = useMemo(
  () =>
   archivedBacklogItems.reduce(
    (acc, item) => {
     acc[item.status] = (acc[item.status] ?? 0) + 1;
     return acc;
    },
    {} as Partial<Record<BacklogItemEntity['status'], number>>,
   ),
  [archivedBacklogItems],
 );
 const sortOptions = useMemo<PickerOption[]>(
  () =>
   Object.values(BacklogSortEnum)
    .filter((value) => value !== BacklogSortEnum.PRIORITY)
    .map((value) => ({
     label: t(`backlog.sort.${value}`),
     value,
    })),
  [t],
 );

 const handleRestore = useCallback(
  async (item: BacklogItemEntity) => {
   clearError();
   await update(item.id, { is_archived: false });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    InteractionManager.runAfterInteractions(() => {
     setArchiveCelebration((current) => ({
      mode: 'restore',
      trigger: current ? current.trigger + 1 : 1,
     }));
    });
    showToast(t('backlog.archive.restoreSuccess'), 'success');
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const handleConfirmRestore = useCallback(async () => {
  if (!pendingRestoreItem) return;
  const restoreItem = pendingRestoreItem;
  setPendingRestoreItem(null);
  await handleRestore(restoreItem);
 }, [handleRestore, pendingRestoreItem]);

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

 const handleOpenGame = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
   router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
  },
  [prefetchGameById, router],
 );

 const handleOpenBacklog = useCallback(() => {
  router.push('/(tabs)/backlog');
 }, [router]);

 const handlePressIn = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
  },
  [prefetchGameById],
 );

 function handleOpenFilters() {
  setDraftFilters(appliedFilters);
  setIsFilterSheetOpen(true);
 }

 function handleApplyFilters() {
  setAppliedFilters(draftFilters);
  setIsFilterSheetOpen(false);
 }

 function handleResetFilters() {
  const nextFilters = createEmptyGameDiscoveryFilters();
  setDraftFilters(nextFilters);
  setAppliedFilters(nextFilters);
 }

 if (isReadingArchiveList) {
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <LoadingSpinner fullScreen />
   </SafeAreaView>
  );
 }

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('backlog.archive.title')} onBack={() => router.back()} />

   <View
    style={{
     paddingHorizontal: spacing.md,
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
      {t('backlog.archive.title')}
     </Text>
     <GradientUnderline />
    </View>
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.relaxed),
     }}
    >
     {t('backlog.archive.description')}
    </Text>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
     <View style={{ flex: 1 }}>
      <SearchFilterToolbar
       value={search}
       onChangeText={setSearch}
       onClear={() => setSearch('')}
       placeholder={t('backlog.archive.searchPlaceholder')}
       onFilterPress={handleOpenFilters}
       filterAccessibilityLabel={t('home.filtersButton')}
       activeCount={activeFilterCount}
       isFilterActive={isFilterSheetOpen}
       isDisabled={isArchiveToolbarDisabled}
      />
     </View>
     <SortIconButton
      onPress={() => setIsSortSheetOpen(true)}
      accessibilityLabel={t('backlog.sort.label')}
      isActive={sortOrder !== BacklogSortEnum.NEWEST}
      isDisabled={isArchiveToolbarDisabled}
     />
    </View>
   </View>

   {error ? (
    <View style={{ paddingTop: spacing.xl }}>
     <EmptyState
      icon="exclamation-triangle"
      title={t('auth.errors.generic')}
      action={{
       label: t('home.errorRetry'),
       onPress: () => {
        if (!userId) return;
        void readAll(userId, { target: 'archivedBacklogItems', includeArchived: true });
       },
      }}
     />
    </View>
   ) : archivedBacklogItems.length === 0 ? (
    <View style={{ flex: 1 }}>
     <EmptyState
      icon="archive"
      title={t('backlog.archive.emptyTitle')}
      subtitle={t('backlog.archive.emptySubtitle')}
      action={{ label: t('backlog.archive.emptyAction'), onPress: handleOpenBacklog }}
     />
    </View>
   ) : archivedItems.length === 0 ? (
    <View style={{ paddingTop: spacing.md }}>
     <FilterChipRow
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      countMap={statusCounts}
     />
     <EmptyState
      icon="filter"
      title={t('backlog.emptyFiltered.title')}
      subtitle={t('backlog.emptyFiltered.subtitle')}
     />
    </View>
   ) : (
    <>
     <View style={{ paddingHorizontal: spacing.md }}>
      <FilterChipRow
       activeFilter={activeFilter}
       onFilterChange={setActiveFilter}
       countMap={statusCounts}
      />
     </View>
     <FlatList
      data={archivedItems}
      keyExtractor={(item) => item.id}
      contentContainerStyle={LIST_CONTENT_STYLE}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={12}
      maxToRenderPerBatch={10}
      windowSize={8}
      removeClippedSubviews
      renderItem={({ item }) => (
       <BacklogListItem
        item={item}
        onPress={handleOpenGame}
        onPressIn={handlePressIn}
        onQuickStatusChange={() => undefined}
        onToggleArchive={(item) => setPendingRestoreItem(item)}
        onRequestRemove={setPendingDeleteItem}
        removeLabel={t('gameDetail.confirmRemove.confirm')}
        archiveLabel={t('backlog.archive.action')}
        restoreArchiveLabel={t('backlog.archive.restoreAction')}
        labelMap={labelMap}
        colorMap={colorMap}
        iconMap={iconMap}
        quickActionsMode="hidden"
        showAddedDate
        isUpdatingArchive={isMutating && activeMutation === 'update'}
       />
      )}
     />
    </>
   )}

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
    onChange={(value) => setSortOrder(value as BacklogSortEnum)}
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

   <ConfirmModal
    visible={pendingRestoreItem !== null}
    title={t('backlog.archive.restoreModalTitle')}
    message={t('backlog.archive.restoreModalMessage')}
    confirmLabel={t('backlog.archive.restoreAction')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void handleConfirmRestore()}
    onCancel={() => setPendingRestoreItem(null)}
   />

   <BacklogStatusCelebrationOverlay
    colorMap={colorMap}
    iconMap={iconMap}
    status={null}
    trigger={0}
    archiveTrigger={archiveCelebration?.trigger ?? 0}
    archiveMode={archiveCelebration?.mode ?? null}
   />
  </SafeAreaView>
 );
}
