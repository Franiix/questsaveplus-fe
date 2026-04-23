import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { BacklogScreenContent } from '@/components/backlog/BacklogScreenContent';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { useDeferredInteractionGate } from '@/hooks/useDeferredInteractionGate';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useBacklogGameMetadata } from '@/hooks/useBacklogGameMetadata';
import { useBacklogScreenViewModel } from '@/hooks/useBacklogScreenViewModel';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';
import {
 shouldLoadBacklogMetadata,
} from '@/shared/utils/backlogScreen';
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
 const [pendingDeleteItem, setPendingDeleteItem] = useState<BacklogItemEntity | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
  const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>(createEmptyGameDiscoveryFilters);
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

  const { activeFilterCount, filteredItems, hasAppliedFilters } = useBacklogScreenViewModel({
    activeFilter,
    appliedFilters,
    backlogItems,
    backlogMetadata,
    search,
  });
  const deferredPrefetchEnabled = useDeferredInteractionGate({
    enabled: filteredItems.length > 0,
    delayMs: 500,
  });

  useEffect(() => {
    if (!deferredPrefetchEnabled) {
      return;
    }

    void Promise.all(
      filteredItems.slice(0, 3).map((item) =>
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

  const handleRequestRemove = useCallback((item: BacklogItemEntity) => {
    setPendingDeleteItem(item);
  }, []);

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

  const contentState = useMemo(
    () => ({
      activeFilter,
      error,
      filteredItems,
      hasAppliedFilters,
      isReadingList,
    }),
    [activeFilter, error, filteredItems, hasAppliedFilters, isReadingList],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <AppBackground />
      <ScreenHeader title={t('tabs.backlog')} onBack={handleBackPress} />
      <View
        style={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingTop: 84,
          paddingBottom: spacing.sm,
          gap: spacing.sm,
        }}
      >
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

      <BacklogScreenContent
        colorMap={colorMap}
        iconMap={iconMap}
        labelMap={labelMap}
        state={contentState}
        onFilterChange={setActiveFilter}
        onItemPress={handleItemPress}
        onItemPressIn={handleItemPressIn}
        onQuickStatusChange={handleQuickStatusChange}
        onRefetch={handleRefetch}
        onRequestRemove={handleRequestRemove}
        isUpdatingStatus={isMutating && activeMutation === 'update'}
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
