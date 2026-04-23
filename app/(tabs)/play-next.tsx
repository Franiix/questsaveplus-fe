import DraggableFlatList, {
 ScaleDecorator,
 type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { PickerModal, type PickerOption } from '@/components/base/feedback/PickerModal';
import { SortIconButton } from '@/components/base/inputs/SortIconButton';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { useBacklogGameMetadata } from '@/hooks/useBacklogGameMetadata';
import { useBacklogSortPreference } from '@/hooks/useBacklogSortPreference';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import {
 createBacklogScreenViewModel,
 getPlayNextItems,
 shouldLoadBacklogMetadata,
} from '@/shared/utils/backlogScreen';
import { getPlayNextReasonKey } from '@/shared/utils/playNextReason';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const HORIZONTAL_PADDING = spacing.md;

const styles = StyleSheet.create({
 listContent: {
  paddingHorizontal: HORIZONTAL_PADDING,
  paddingTop: spacing.sm,
  paddingBottom: layout.screenBottomPadding,
  gap: spacing.sm,
 },
});

export default function PlayNextScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const { labelMap, colorMap, iconMap } = useBacklogStatusPresentation();
 const { prefetchGameById } = usePrefetchGameResources();
 const showToast = useToastStore((state) => state.showToast);
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
 const [search, setSearch] = useState('');
 const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
 const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
 const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
 const [isReordering, setIsReordering] = useState(false);
 const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
 const [pendingPlayItem, setPendingPlayItem] = useState<BacklogItemEntity | null>(null);
 const { sortOrder: playNextSortOrder, setSortOrder: setPlayNextSortOrder } = useBacklogSortPreference('play_next_sort_order');
 const userId = session?.user?.id;
 const playNextItems = useMemo(() => getPlayNextItems(backlogItems), [backlogItems]);
 const catalogFiltersEnabled = isFilterSheetOpen || shouldLoadBacklogMetadata(appliedFilters);
 const { data: genres = [], isLoading: isGenresLoading, isError: isGenresError } =
  useCatalogGenres(catalogFiltersEnabled);
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
  playNextItems.map((item) => item.game_id),
  true,
 );
 const { activeFilterCount, filteredItems, hasAppliedFilters } = useMemo(
  () =>
   createBacklogScreenViewModel({
    activeFilter: null,
    appliedFilters,
    backlogItems: playNextItems,
    backlogMetadata,
    search,
    sortOrder: playNextSortOrder,
   }),
  [appliedFilters, backlogMetadata, playNextItems, playNextSortOrder, search],
 );
 const canReorder = !hasAppliedFilters && !isReordering;
 const sortOptions = useMemo<PickerOption[]>(
  () => Object.values(BacklogSortEnum).map((value) => ({ label: t(`backlog.sort.${value}`), value })),
  [t],
 );

 useEffect(() => {
  if (!userId) {
   clearBacklog();
   return;
  }

  void readAll(userId);
 }, [clearBacklog, readAll, userId]);

 useEffect(() => {
  for (const item of playNextItems) {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
  }
 }, [playNextItems, prefetchGameById]);

 const handleBackPress = useCallback(() => {
  router.replace('/(tabs)/backlog');
 }, [router]);

 const handleOpenBacklog = useCallback(() => {
  router.replace('/(tabs)/backlog');
 }, [router]);

 const handleOpenFilters = useCallback(() => {
  setDraftFilters(appliedFilters);
  setIsFilterSheetOpen(true);
 }, [appliedFilters]);

 const handleApplyFilters = useCallback(() => {
  setAppliedFilters(draftFilters);
  setIsFilterSheetOpen(false);
 }, [draftFilters]);

 const handleResetFilters = useCallback(() => {
  setDraftFilters(createEmptyGameDiscoveryFilters());
  setAppliedFilters(createEmptyGameDiscoveryFilters());
 }, []);

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

 const handleRequestPlay = useCallback((item: BacklogItemEntity) => {
  setPendingPlayItem(item);
 }, []);

 const handleConfirmPlay = useCallback(async () => {
  if (!pendingPlayItem) return;

  clearError();
  await update(pendingPlayItem.id, {
   status: BacklogStatusEnum.PLAYING,
   is_play_next: false,
   play_next_priority: null,
  });
  const updateError = useBacklogStore.getState().error;

  if (!updateError) {
   showToast(t('playNext.playSuccess'), 'success');
  } else {
   showToast(updateError, 'error');
  }

  setPendingPlayItem(null);
 }, [clearError, pendingPlayItem, showToast, t, update]);

 const handleTogglePlayNext = useCallback(
  async (item: BacklogItemEntity) => {
   clearError();
   await update(item.id, {
    is_play_next: false,
    play_next_priority: null,
   });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(t('backlog.playNext.unpinSuccess'), 'success');
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const persistPlayNextOrder = useCallback(
  async (orderedItems: BacklogItemEntity[]) => {
   const changedItems = orderedItems
    .map((item, index) => ({ item, priority: index + 1 }))
    .filter(({ item, priority }) => item.play_next_priority !== priority);

   if (changedItems.length === 0) return;

   setIsReordering(true);
   clearError();

   for (const { item, priority } of changedItems) {
    await update(item.id, { play_next_priority: priority });
    if (useBacklogStore.getState().error) break;
   }

   const updateError = useBacklogStore.getState().error;
   showToast(
    updateError ?? t('playNext.reorderSuccess'),
    updateError ? 'error' : 'success',
   );
   setIsReordering(false);
  },
  [clearError, showToast, t, update],
 );

 const handleRefetch = useCallback(() => {
  if (!userId) return;
  void readAll(userId);
 }, [readAll, userId]);

 const renderItem = useCallback(
  ({ item, drag, isActive }: RenderItemParams<BacklogItemEntity>) => {
   const itemMeta = backlogMetadata?.get(item.game_id) ?? null;
   const reasonKey = getPlayNextReasonKey(item, itemMeta);
   const reasonToPlay = reasonKey ? t(`playNext.reason.${reasonKey}`) : undefined;
   return (
    <ScaleDecorator activeScale={1.03}>
     <BacklogListItem
     item={item}
     onPress={handleItemPress}
     onPressIn={handleItemPressIn}
     onLongPress={canReorder ? () => drag() : undefined}
     onQuickStatusChange={handleQuickStatusChange}
     onTogglePlayNext={handleTogglePlayNext}
     onPrimaryAction={handleRequestPlay}
     onRequestRemove={() => {}}
     isUpdatingStatus={isMutating && activeMutation === 'update'}
     isUpdatingPlayNext={isMutating && activeMutation === 'update'}
     isDragActive={isActive}
     dragHintLabel={canReorder ? t('playNext.dragHint') : undefined}
     primaryActionLabel={t('playNext.playAction')}
     playNextOrdinal={item.play_next_priority ?? undefined}
     quickActionsMode="play-only"
     playNextPinLabel={t('backlog.playNext.pinAction')}
     playNextUnpinLabel={t('backlog.playNext.unpinAction')}
     removeLabel={t('gameDetail.confirmRemove.confirm')}
     labelMap={labelMap}
     colorMap={colorMap}
     iconMap={iconMap}
     reasonToPlay={reasonToPlay}
    />
   </ScaleDecorator>
   );
  },
  [
   activeMutation,
   canReorder,
   colorMap,
   handleItemPress,
   handleItemPressIn,
   handleQuickStatusChange,
   handleRequestPlay,
   handleTogglePlayNext,
   iconMap,
   isMutating,
   backlogMetadata,
   labelMap,
   t,
  ],
 );

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('tabs.playNext')} onBack={handleBackPress} />
   <View
    style={{
     paddingHorizontal: HORIZONTAL_PADDING,
     paddingTop: layout.screenContentTopPadding,
     paddingBottom: spacing.sm,
     gap: spacing.md,
    }}
   >
    <View style={{ gap: spacing.xs }}>
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <Text
       style={{
        fontFamily: typography.font.bold,
        fontSize: typography.size['2xl'],
        color: colors.text.primary,
        letterSpacing: typography.letterSpacing.tight,
       }}
      >
       {t('playNext.title')}
      </Text>
      {playNextItems.length > 0 ? (
       <View
        style={{
         paddingHorizontal: spacing.sm,
         paddingVertical: 3,
         borderRadius: borderRadius.full,
         backgroundColor: `${colors.primary.DEFAULT}25`,
         borderWidth: 1,
         borderColor: `${colors.primary['200']}45`,
        }}
       >
        <Text
         style={{
          color: colors.primary['200'],
          fontSize: typography.size.sm,
          fontFamily: typography.font.semibold,
         }}
        >
         {playNextItems.length}
        </Text>
       </View>
      ) : null}
     </View>
     <GradientUnderline />
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
      }}
     >
      {[t('playNext.subtitle'), !hasAppliedFilters ? t('playNext.reorderHint') : null]
       .filter(Boolean)
       .join(' · ')}
     </Text>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
     <View style={{ flex: 1 }}>
      <SearchFilterToolbar
       value={search}
       onChangeText={setSearch}
       onClear={() => setSearch('')}
       placeholder={t('playNext.searchPlaceholder')}
       onFilterPress={handleOpenFilters}
       filterAccessibilityLabel={t('home.filtersButton')}
       activeCount={activeFilterCount}
       isFilterActive={isFilterSheetOpen}
      />
     </View>
     <SortIconButton
      onPress={() => setIsSortSheetOpen(true)}
      accessibilityLabel={t('backlog.sort.label')}
      isActive={playNextSortOrder !== BacklogSortEnum.NEWEST}
     />
    </View>
   </View>

   {isReadingList ? <LoadingSpinner fullScreen /> : null}
   {!isReadingList && error ? (
    <EmptyState
     icon="exclamation-triangle"
     title={t('auth.errors.generic')}
     action={{ label: t('home.errorRetry'), onPress: handleRefetch }}
    />
   ) : null}
   {!isReadingList && !error && playNextItems.length === 0 ? (
    <EmptyState
     icon="bolt"
     title={t('playNext.emptyTitle')}
     subtitle={t('playNext.emptySubtitle')}
     action={{ label: t('playNext.emptyAction'), onPress: handleOpenBacklog }}
    />
   ) : null}
   {!isReadingList && !error && playNextItems.length > 0
    ? filteredItems.length === 0
      ? (
        <EmptyState
         icon="filter"
         title={t('backlog.emptyFiltered.title')}
         subtitle={t('backlog.emptyFiltered.subtitle')}
        />
       )
      : (
        <DraggableFlatList
         data={filteredItems}
         renderItem={renderItem}
         keyExtractor={(item) => item.id}
         contentContainerStyle={styles.listContent}
         showsVerticalScrollIndicator={false}
         keyboardShouldPersistTaps="handled"
         activationDistance={16}
         autoscrollThreshold={72}
         autoscrollSpeed={220}
         removeClippedSubviews
         onDragEnd={({ data, from, to }) => {
          if (!canReorder || from === to) return;
          void persistPlayNextOrder(data);
         }}
        />
       )
    : null}

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
    value={playNextSortOrder}
    onChange={(v) => setPlayNextSortOrder(v as BacklogSortEnum)}
   />

   <ConfirmModal
    visible={pendingPlayItem !== null}
    title={t('playNext.playConfirmTitle')}
    message={t('playNext.playConfirmMessage')}
    confirmLabel={t('playNext.playConfirmAction')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void handleConfirmPlay()}
    onCancel={() => setPendingPlayItem(null)}
   />

  </SafeAreaView>
 );
}
