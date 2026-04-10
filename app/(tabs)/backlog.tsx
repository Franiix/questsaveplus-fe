import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { FilterChipRow } from '@/components/game/FilterChipRow';
import { useBacklogGameMetadata } from '@/hooks/useBacklogGameMetadata';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const HORIZONTAL_PADDING = spacing.md;

export default function BacklogScreen() {
  const { t } = useTranslation();
  const { labelMap, colorMap } = useBacklogStatusPresentation();
  const router = useRouter();
  const { showToast } = useToastStore();
  const handleBackPress = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);
  const { session } = useAuthStore();
  const { backlogItems, isReadingList, error, readAll, clearBacklog, clearError, delete: deleteBacklogItem } =
    useBacklogStore();
  const [activeFilter, setActiveFilter] = useState<BacklogStatusEnum | null>(null);
  const [search, setSearch] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<BacklogItemEntity | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>({
    genre: undefined,
    platform: undefined,
  });
  const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>({
    genre: undefined,
    platform: undefined,
  });
 const { data: genres = [], isLoading: isGenresLoading, isError: isGenresError } = useCatalogGenres();
 const {
  data: parentPlatforms = [],
  isLoading: isParentPlatformsLoading,
  isError: isParentPlatformsError,
 } = useCatalogParentPlatforms();
 const {
  data: developers = [],
  isLoading: isDevelopersLoading,
  isError: isDevelopersError,
 } = useCatalogDevelopers();
 const {
  data: publishers = [],
  isLoading: isPublishersLoading,
  isError: isPublishersError,
 } = useCatalogPublishers();
  const shouldLoadBacklogMetadata =
  Boolean(appliedFilters.genre) ||
  Boolean(appliedFilters.platform) ||
  Boolean(appliedFilters.developer) ||
  Boolean(appliedFilters.publisher);
  const { data: backlogMetadata } = useBacklogGameMetadata(
    backlogItems.map((item) => item.game_id),
    shouldLoadBacklogMetadata,
  );

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      clearBacklog();
      return;
    }

    void readAll(userId);
  }, [clearBacklog, readAll, userId]);

  const filtered = useMemo(() => {
    return backlogItems.filter((item) => {
      const matchesStatus = !activeFilter || item.status === activeFilter;
      const matchesSearch =
        search.trim().length === 0 ||
        item.game_name.toLowerCase().includes(search.trim().toLowerCase());
      const metadata = backlogMetadata?.get(item.game_id);
      const matchesGenre =
        !appliedFilters.genre ||
        (metadata?.genres ?? []).includes(appliedFilters.genre);
      const matchesPlatform =
        !appliedFilters.platform ||
        (metadata?.platforms ?? []).includes(appliedFilters.platform);
      const matchesDeveloper =
        !appliedFilters.developer ||
        (metadata?.developers ?? []).includes(appliedFilters.developer);
      const matchesPublisher =
        !appliedFilters.publisher ||
        (metadata?.publishers ?? []).includes(appliedFilters.publisher);

      return (
        matchesStatus &&
        matchesSearch &&
        matchesGenre &&
        matchesPlatform &&
        matchesDeveloper &&
        matchesPublisher
      );
    });
  }, [activeFilter, appliedFilters, backlogItems, backlogMetadata, search]);

  function handleOpenFilters() {
    setDraftFilters(appliedFilters);
    setIsFilterSheetOpen(true);
  }

  function handleApplyFilters() {
    setAppliedFilters(draftFilters);
    setIsFilterSheetOpen(false);
  }

  function handleResetFilters() {
    setDraftFilters({
       genre: undefined,
       platform: undefined,
       developer: undefined,
       publisher: undefined,
      });
    setAppliedFilters({
       genre: undefined,
       platform: undefined,
       developer: undefined,
       publisher: undefined,
      });
  }

  const refetch = useCallback(() => {
    if (!userId) return Promise.resolve([]);
    return readAll(userId);
  }, [readAll, userId]);

  const handleItemPress = useCallback(
    (item: BacklogItemEntity) => {
      router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
    },
    [router],
  );

  const handleRequestRemove = useCallback((item: BacklogItemEntity) => {
    setPendingDeleteItem(item);
  }, []);

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

  const renderItem = useCallback(
    ({ item }: { item: BacklogItemEntity }) => (
      <BacklogListItem
        item={item}
        onPress={handleItemPress}
        onRequestRemove={handleRequestRemove}
        removeLabel={t('gameDetail.confirmRemove.confirm')}
        labelMap={labelMap}
        colorMap={colorMap}
      />
    ),
    [colorMap, handleItemPress, handleRequestRemove, labelMap, t],
  );

  const keyExtractor = useCallback((item: BacklogItemEntity) => item.id, []);

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
          activeCount={
             Number(Boolean(appliedFilters.genre)) +
             Number(Boolean(appliedFilters.platform)) +
             Number(Boolean(appliedFilters.developer)) +
             Number(Boolean(appliedFilters.publisher))
            }
          isFilterActive={isFilterSheetOpen}
        />
      </View>

      <View style={{ marginBottom: spacing.xs }}>
        <FilterChipRow activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      {isReadingList ? (
        <LoadingSpinner fullScreen />
      ) : error ? (
        <View style={{ paddingTop: spacing.md }}>
          <EmptyState
            icon="exclamation-triangle"
            title={t('auth.errors.generic')}
            action={{ label: t('home.errorRetry'), onPress: () => refetch() }}
          />
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ paddingTop: spacing.md }}>
          <EmptyState
            icon="gamepad"
            title={
              activeFilter ||
              search.trim() ||
              appliedFilters.genre ||
              appliedFilters.platform ||
              appliedFilters.developer ||
              appliedFilters.publisher
                ? t('backlog.emptyFiltered.title')
                : t('backlog.emptyAll.title')
            }
            subtitle={
              activeFilter ||
              search.trim() ||
              appliedFilters.genre ||
              appliedFilters.platform ||
              appliedFilters.developer ||
              appliedFilters.publisher
                ? t('backlog.emptyFiltered.subtitle')
                : t('backlog.emptyAll.subtitle')
            }
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
            paddingTop: spacing.sm,
            paddingBottom: 110,
            gap: spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}

      <GameFilterSheet
        isVisible={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title={t('home.filtersTitle')}
        genresTitle={t('home.genresTitle')}
        platformsTitle={t('home.platformsTitle')}
        applyLabel={t('home.applyFilters')}
        resetLabel={t('home.resetFilters')}
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
         developerPlaceholder={t('home.selectDeveloper')}
        publisherPlaceholder={t('home.selectPublisher')}
        genrePlaceholder={t('home.selectGenre')}
        platformPlaceholder={t('home.selectPlatform')}
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
