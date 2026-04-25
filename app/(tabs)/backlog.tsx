import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BacklogScreenContent } from '@/components/backlog/BacklogScreenContent';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { PickerModal, type PickerOption } from '@/components/base/feedback/PickerModal';
import { DatePickerInput } from '@/components/base/inputs/DatePickerInput';
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
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { shouldLoadBacklogMetadata } from '@/shared/utils/backlogScreen';
import { calculateBacklogDateFields } from '@/shared/utils/backlogDateFields';
import { formatDate } from '@/shared/utils/date';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const HORIZONTAL_PADDING = spacing.md;

export default function BacklogScreen() {
 const { t, i18n } = useTranslation();
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
 const [pendingArchiveItem, setPendingArchiveItem] = useState<BacklogItemEntity | null>(null);
 const [pendingQuickChange, setPendingQuickChange] = useState<{
  item: BacklogItemEntity;
  status: BacklogStatusEnum;
  body: string;
  startedAtInput?: Date;
  completedAtInput?: Date;
  abandonedAtInput?: Date;
  resumedAtInput?: Date;
  showResetAbandonedSwitch?: boolean;
  resetAbandonedAt?: boolean;
 } | null>(null);
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
 const isBacklogToolbarDisabled = backlogItems.length === 0;

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

 const handleOpenHome = useCallback(() => {
  router.push('/(tabs)');
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
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, getNextPlayNextPriority, showToast, t, update],
 );

 const handleToggleArchive = useCallback(
  async (item: BacklogItemEntity) => {
   if (!item.is_archived) {
    setPendingArchiveItem(item);
    return;
   }

   clearError();
   await update(item.id, { is_archived: false });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(t('backlog.archive.restoreSuccess'), 'success');
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const handleConfirmArchive = useCallback(async () => {
  if (!pendingArchiveItem) return;

  clearError();
  await update(pendingArchiveItem.id, {
   is_archived: true,
   is_play_next: false,
   play_next_priority: null,
  });
  const updateError = useBacklogStore.getState().error;

  if (!updateError) {
   showToast(t('backlog.archive.archiveSuccess'), 'success');
   void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
   showToast(updateError, 'error');
  }

  setPendingArchiveItem(null);
 }, [clearError, pendingArchiveItem, showToast, t, update]);

 const doQuickStatusUpdate = useCallback(
  async (
   item: BacklogItemEntity,
   status: BacklogStatusEnum,
   overrideStartedAt?: string,
   overrideCompletedAt?: string,
   overrideAbandonedAt?: string,
   overrideResumedAt?: string,
   resetAbandonedAt?: boolean,
  ) => {
   clearError();

   const dateFields = calculateBacklogDateFields(item, status, {
    startedAt: overrideStartedAt,
    completedAt: overrideCompletedAt,
    abandonedAt: overrideAbandonedAt,
    resumedAt: overrideResumedAt,
    resetAbandonedAt,
   });

   const ACTIVE_STATUSES = new Set([
    BacklogStatusEnum.PLAYING,
    BacklogStatusEnum.ONGOING,
    BacklogStatusEnum.COMPLETED,
    BacklogStatusEnum.ABANDONED,
   ]);
   const unpinFields =
    item.is_play_next === true && ACTIVE_STATUSES.has(status)
     ? { is_play_next: false as const, play_next_priority: null }
     : {};

   await update(item.id, { status, ...unpinFields, ...dateFields });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(t('gameDetail.updateSuccess'), 'success');
    void (status === BacklogStatusEnum.COMPLETED && !item.completed_at
     ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
     : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const handleQuickStatusChange = useCallback(
  async (item: BacklogItemEntity, status: BacklogStatusEnum) => {
   if (item.status === status) return;

   const isCompleted = status === BacklogStatusEnum.COMPLETED;
   const isAbandoned = status === BacklogStatusEnum.ABANDONED;
   const isWishlist = status === BacklogStatusEnum.WISHLIST;
   const isResumable =
    status === BacklogStatusEnum.PLAYING ||
    status === BacklogStatusEnum.ONGOING ||
    status === BacklogStatusEnum.COMPLETED;
   const hasAbandonedHistory = Boolean(item.abandoned_at);
   const wouldSetStarted = isResumable && !item.started_at;
   const wouldSetCompleted = isCompleted && !item.completed_at;
   const wouldSetResumed =
    isResumable &&
    hasAbandonedHistory &&
    (item.status === BacklogStatusEnum.ABANDONED || !item.resumed_at);

   const hasAnyDates = Boolean(
    item.started_at || item.completed_at || item.abandoned_at || item.resumed_at,
   );
   if (isWishlist && hasAnyDates) {
    setPendingQuickChange({ item, status, body: t('backlog.dateChange.bodyToWishlist') });
    return;
   }

   const isLeavingCompleted =
    item.status === BacklogStatusEnum.COMPLETED && !isCompleted && Boolean(item.completed_at);
   if (isLeavingCompleted) {
    const completedDate = formatDate(item.completed_at ?? new Date().toISOString(), i18n.language, {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
    });
    const body = t('backlog.dateChange.bodyLeavingCompleted', { date: completedDate });
    setPendingQuickChange({ item, status, body });
    return;
   }

   const isLeavingAbandoned =
    item.status === BacklogStatusEnum.ABANDONED && !isWishlist && Boolean(item.abandoned_at);
   if (isLeavingAbandoned) {
    const abandonedDate = formatDate(item.abandoned_at ?? new Date().toISOString(), i18n.language, {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
    });
    const body = t('backlog.dateChange.bodyLeavingAbandoned', { date: abandonedDate });
    setPendingQuickChange({
     item,
     status,
     body,
     startedAtInput: wouldSetStarted ? new Date() : undefined,
     completedAtInput: wouldSetCompleted ? new Date() : undefined,
     resumedAtInput: wouldSetResumed ? new Date() : undefined,
     showResetAbandonedSwitch: true,
     resetAbandonedAt: false,
    });
    return;
   }

   if (isAbandoned && !hasAbandonedHistory) {
    const body = t('backlog.dateChange.bodyAbandoned');
    setPendingQuickChange({ item, status, body, abandonedAtInput: new Date() });
    return;
   }

   if (wouldSetStarted || wouldSetCompleted || wouldSetResumed) {
    const today = formatDate(new Date().toISOString(), i18n.language, {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
    });
    let body: string;
    if (wouldSetResumed) {
     body = t('backlog.dateChange.bodyResumed');
    } else if (wouldSetStarted && wouldSetCompleted) {
     body = t('backlog.dateChange.bodyBoth', { date: today });
    } else if (wouldSetStarted) {
     body = t('backlog.dateChange.bodyPlaying', { date: today });
    } else {
     body = t('backlog.dateChange.bodyCompleted', { date: today });
    }
    setPendingQuickChange({
     item,
     status,
     body,
     startedAtInput: wouldSetStarted ? new Date() : undefined,
     completedAtInput: wouldSetCompleted ? new Date() : undefined,
     resumedAtInput: wouldSetResumed ? new Date() : undefined,
    });
    return;
   }

   await doQuickStatusUpdate(item, status);
  },
  [doQuickStatusUpdate, i18n.language, t],
 );

 const handleConfirmQuickChange = useCallback(async () => {
  if (!pendingQuickChange) return;
  await doQuickStatusUpdate(
   pendingQuickChange.item,
   pendingQuickChange.status,
   pendingQuickChange.startedAtInput?.toISOString(),
   pendingQuickChange.completedAtInput?.toISOString(),
   pendingQuickChange.abandonedAtInput?.toISOString(),
   pendingQuickChange.resumedAtInput?.toISOString(),
   pendingQuickChange.resetAbandonedAt,
  );
  setPendingQuickChange(null);
 }, [doQuickStatusUpdate, pendingQuickChange]);

 const handleQuickStartedAtChange = useCallback((date: Date) => {
  setPendingQuickChange((prev) => (prev ? { ...prev, startedAtInput: date } : null));
 }, []);

 const handleQuickCompletedAtChange = useCallback((date: Date) => {
  setPendingQuickChange((prev) => (prev ? { ...prev, completedAtInput: date } : null));
 }, []);

 const handleQuickAbandonedAtChange = useCallback((date: Date) => {
  setPendingQuickChange((prev) => (prev ? { ...prev, abandonedAtInput: date } : null));
 }, []);

 const handleQuickResumedAtChange = useCallback((date: Date) => {
  setPendingQuickChange((prev) => (prev ? { ...prev, resumedAtInput: date } : null));
 }, []);

 const handleQuickResetAbandonedToggle = useCallback(() => {
  setPendingQuickChange((prev) =>
   prev ? { ...prev, resetAbandonedAt: !prev.resetAbandonedAt } : null,
  );
 }, []);

 const handleRatingChange = useCallback(
  async (item: BacklogItemEntity, rating: number) => {
   clearError();
   await update(item.id, { personal_rating: rating });
   const updateError = useBacklogStore.getState().error;
   if (updateError) {
    showToast(updateError, 'error');
   } else {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   }
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
   void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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
   totalItems: backlogItems.length,
  }),
  [
   activeFilter,
   error,
   filteredItems,
   hasAppliedFilters,
   isReadingList,
   playNextItems.length,
   statusCounts,
   backlogItems.length,
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
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
     }}
    >
     {t('backlog.description')}
    </Text>

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
       isDisabled={isBacklogToolbarDisabled}
      />
     </View>
     <SortIconButton
      onPress={() => setIsSortSheetOpen(true)}
      accessibilityLabel={t('backlog.sort.label')}
      isActive={sortOrder !== BacklogSortEnum.NEWEST}
      isDisabled={isBacklogToolbarDisabled}
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
    onOpenHome={handleOpenHome}
    onTogglePlayNext={handleTogglePlayNext}
    onToggleArchive={handleToggleArchive}
    onQuickStatusChange={handleQuickStatusChange}
    onRefetch={handleRefetch}
    onRequestRemove={handleRequestRemove}
    onRatingChange={handleRatingChange}
    isUpdatingStatus={isMutating && activeMutation === 'update'}
    isUpdatingPlayNext={isMutating && activeMutation === 'update'}
    isUpdatingArchive={isMutating && activeMutation === 'update'}
    removeLabel={t('gameDetail.confirmRemove.confirm')}
    retryLabel={t('home.errorRetry')}
    emptyActionLabel={t('backlog.emptyAll.action')}
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

   <ConfirmModal
    visible={pendingArchiveItem !== null}
    title={t('backlog.archive.archiveModalTitle')}
    message={t('backlog.archive.archiveModalMessage')}
    confirmLabel={t('backlog.archive.action')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void handleConfirmArchive()}
    onCancel={() => setPendingArchiveItem(null)}
   />

   <ConfirmModal
    visible={pendingQuickChange !== null}
    title={t('backlog.dateChange.title')}
    message={pendingQuickChange?.body ?? ''}
    confirmLabel={t('backlog.dateChange.confirm')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void handleConfirmQuickChange()}
    onCancel={() => setPendingQuickChange(null)}
   >
    {pendingQuickChange?.startedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingQuickChange.startedAtInput}
      onChange={handleQuickStartedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.startedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingQuickChange?.completedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingQuickChange.completedAtInput}
      onChange={handleQuickCompletedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.completedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingQuickChange?.resumedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingQuickChange.resumedAtInput}
      onChange={handleQuickResumedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.resumedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingQuickChange?.abandonedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingQuickChange.abandonedAtInput}
      onChange={handleQuickAbandonedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.abandonedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingQuickChange?.showResetAbandonedSwitch ? (
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingVertical: spacing.xs,
      }}
     >
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.md,
        flex: 1,
       }}
      >
       {t('backlog.dateChange.resetAbandoned')}
      </Text>
      <Switch
       value={pendingQuickChange.resetAbandonedAt ?? false}
       onValueChange={handleQuickResetAbandonedToggle}
       thumbColor={
        pendingQuickChange.resetAbandonedAt ? colors.primary.DEFAULT : colors.text.disabled
       }
       trackColor={{ false: 'rgba(255,255,255,0.12)', true: `${colors.primary.DEFAULT}80` }}
       ios_backgroundColor="rgba(255,255,255,0.12)"
      />
     </View>
    ) : null}
   </ConfirmModal>
  </SafeAreaView>
 );
}
