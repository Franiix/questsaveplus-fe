import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, KeyboardAvoidingView, Platform, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { RetryState } from '@/components/base/feedback/RetryState';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { GameDetailContentSections } from '@/components/game/GameDetailContentSections';
import { GameDetailOverviewSection } from '@/components/game/GameDetailOverviewSection';
import { GameDetailRelatedSections } from '@/components/game/GameDetailRelatedSections';
import { GameHeroBanner } from '@/components/game/GameHeroBanner';
import { GameStickyHeader } from '@/components/game/GameStickyHeader';
import { useDeferredGameDetailSectionsGate } from '@/hooks/useDeferredGameDetailSectionsGate';
import { useGameAdditions } from '@/hooks/useGameAdditions';
import { useGameBacklogController } from '@/hooks/useGameBacklogController';
import { useGameCommunityRating } from '@/hooks/useGameCommunityRating';
import { useGameDetail } from '@/hooks/useGameDetail';
import { useGameDetailNavigation } from '@/hooks/useGameDetailNavigation';
import { useGameDetailScreenState } from '@/hooks/useGameDetailScreenState';
import { useGameDetailViewModel } from '@/hooks/useGameDetailViewModel';
import { useGameSeries } from '@/hooks/useGameSeries';
import { useGameSimilar } from '@/hooks/useGameSimilar';
import { useRelatedCompanyGames } from '@/hooks/useRelatedCompanyGames';
import { colors, spacing } from '@/shared/theme/tokens';
import { getIgdbNamedItemExternalId } from '@/shared/utils/gameCatalog';

const HERO_HEIGHT = 320;

export default function GameDetailScreen() {
 const { id } = useLocalSearchParams<{ id: string }>();
 const gameId = Number(id);
 const { t, i18n } = useTranslation();
 const insets = useSafeAreaInsets();
 const { width: screenWidth } = useWindowDimensions();
 const stickyThreshold = HERO_HEIGHT - 88;
 const {
  confirmRemoveVisible,
  descriptionExpanded,
  handleNotesFocus,
  handleScroll,
  isStickyVisible,
  registerSectionOffset,
  scrollToSection,
  scrollViewRef,
  scrollY,
  setConfirmRemoveVisible,
  setDescriptionExpanded,
  setStorylineExpanded,
  stickyHeaderOpacity,
  stickyHeaderTranslateY,
  storylineExpanded,
 } = useGameDetailScreenState({ stickyThreshold });
 const { data: game, isLoading, isError } = useGameDetail(gameId);
 const secondarySectionsEnabled = useDeferredGameDetailSectionsGate(Boolean(game));
 const { data: communityRating, isLoading: isCommunityRatingLoading } =
  useGameCommunityRating(gameId);
 const { data: additions = [], isLoading: isAdditionsLoading } = useGameAdditions({
  gameId,
  enabled: Number.isFinite(gameId) && secondarySectionsEnabled,
 });
 const { data: gameSeries = [], isLoading: isSeriesLoading } = useGameSeries({
  gameId,
  enabled: Number.isFinite(gameId) && secondarySectionsEnabled,
 });
 const { data: similarGamesRaw = [], isLoading: isSimilarGamesLoading } = useGameSimilar({
  gameId,
  enabled: Number.isFinite(gameId) && secondarySectionsEnabled,
 });
 const primaryDeveloper = game?.developers[0] ?? null;
 const primaryPublisher = game?.publishers[0] ?? null;
 const igdbRaw = game?.metadata?.raw ?? null;
 const primaryDeveloperCatalogId = getIgdbNamedItemExternalId(igdbRaw, 'developers', 0);
 const primaryPublisherCatalogId = getIgdbNamedItemExternalId(igdbRaw, 'publishers', 0);
 const { data: developerGames = [], isLoading: isDeveloperGamesLoading } = useRelatedCompanyGames({
  currentGameId: gameId,
  companyExternalId: primaryDeveloperCatalogId,
  companyName: primaryDeveloper?.name ?? null,
  companyType: 'developers',
  enabled:
   Number.isFinite(gameId) && secondarySectionsEnabled && Boolean(primaryDeveloperCatalogId),
 });
 const { data: publisherGames = [], isLoading: isPublisherGamesLoading } = useRelatedCompanyGames({
  currentGameId: gameId,
  companyExternalId: primaryPublisherCatalogId,
  companyName: primaryPublisher?.name ?? null,
  companyType: 'publishers',
  enabled:
   Number.isFinite(gameId) &&
   secondarySectionsEnabled &&
   Boolean(primaryPublisherCatalogId) &&
   primaryPublisher?.name !== primaryDeveloper?.name,
 });
 const { handleBackPress, handleDeveloperPress, handlePublisherPress, handleRelatedGamePress } =
  useGameDetailNavigation({
   developerCatalogId: primaryDeveloperCatalogId,
   developerName: primaryDeveloper?.name ?? null,
   developerSlug: primaryDeveloper?.slug ?? null,
   gameName: game?.name ?? null,
   publisherCatalogId: primaryPublisherCatalogId,
   publisherName: primaryPublisher?.name ?? null,
   publisherSlug: primaryPublisher?.slug ?? null,
  });
 const relatedCardWidth = useMemo(
  () => Math.min(170, Math.floor(screenWidth * 0.42)),
  [screenWidth],
 );

 const {
  backlogItem,
  isBacklogLoading,
  isMutating,
  isInBacklog,
  isCreateMutating,
  isUpdateMutating,
  isDeleteMutating,
  selectedStatus,
  selectedRating,
  localNotes,
  statusOptions,
  hasPendingChanges,
  setLocalNotes,
  handleStatusChange,
  handleRatingChange,
  handleAddToBacklog,
  handleUpdateBacklog,
  handleRemoveFromBacklog,
 } = useGameBacklogController({
  game: game
   ? {
      id: Number(game.gameId ?? game.externalId),
      name: game.name,
      background_image: game.backgroundImage?.url ?? game.coverImage?.url ?? null,
     }
   : null,
 });

 const viewModel = useGameDetailViewModel({
  additions,
  communityRating: communityRating ?? null,
  developerGames,
  game,
  gameId,
  gameSeries,
  isCommunityRatingLoading,
  isInBacklog,
  language: i18n.language,
  publisherGames,
  selectedStatus,
  similarGamesRaw,
  statusOptions,
  t,
 });
 const hasAdditionsSection =
  (viewModel?.dlcGames.length ?? 0) > 0 ||
  (viewModel?.editionGames.length ?? 0) > 0 ||
  (viewModel?.expansionGames.length ?? 0) > 0 ||
  isAdditionsLoading;

 if (isLoading) {
  return (
   <View
    style={{
     flex: 1,
     backgroundColor: colors.background.primary,
    }}
   >
    <AppBackground />
    <LoadingSpinner fullScreen />
   </View>
  );
 }

 if (isError || !game) {
  return (
   <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <RetryState
     message={t('gameDetail.errorGeneric')}
     actionLabel={t('home.errorRetry')}
     onRetry={handleBackPress}
    />
   </View>
  );
 }

 if (!viewModel) {
  return null;
 }
 const whereItFits = !viewModel.whereItFitsBase?.rows
  ? viewModel.whereItFitsBase
  : {
     ...viewModel.whereItFitsBase,
     rows: viewModel.whereItFitsBase.rows.map((row) => {
      if (row.key === 'version-family') {
       return {
        ...row,
        onPress: hasAdditionsSection ? () => scrollToSection('contents') : null,
       };
      }

      if (row.key === 'prequel' || row.key === 'sequel') {
       const neighbor = [viewModel.seriesNeighbors.prequel, viewModel.seriesNeighbors.sequel].find(
        (item) => item?.name === row.value,
       );

       return {
        ...row,
        onPress: neighbor ? () => handleRelatedGamePress(neighbor) : null,
       };
      }

      return row;
     }),
    };
 return (
  <KeyboardAvoidingView
   style={{ flex: 1, backgroundColor: colors.background.primary }}
   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   keyboardVerticalOffset={insets.top}
  >
   <AppBackground />
   <Animated.ScrollView
    ref={scrollViewRef}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    contentInsetAdjustmentBehavior="automatic"
    scrollEventThrottle={16}
    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
     useNativeDriver: true,
     listener: handleScroll,
    })}
    contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
   >
    <GameHeroBanner
     imageUri={game.backgroundImage?.url ?? game.coverImage?.url ?? null}
     width={screenWidth}
     height={HERO_HEIGHT}
     metacritic={game.criticScore ?? null}
     gradientColors={[
      'rgba(8,8,16,0.35)',
      'transparent',
      'rgba(8,8,16,0.85)',
      colors.background.primary,
     ]}
     gradientLocations={[0, 0.25, 0.7, 1]}
     topInset={insets.top}
     onBackPress={handleBackPress}
     style={{ height: HERO_HEIGHT, width: screenWidth }}
    />

    <View style={{ paddingHorizontal: spacing.md, marginTop: -spacing.lg }}>
     <GameDetailOverviewSection
      game={game}
      viewModel={viewModel}
      onDeveloperPress={primaryDeveloper ? handleDeveloperPress : null}
      onPublisherPress={primaryPublisher ? handlePublisherPress : null}
      backlogController={{
       isInBacklog,
       isBacklogLoading,
       isMutating,
       isCreateMutating,
       isUpdateMutating,
       isDeleteMutating,
       selectedStatus,
       selectedRating,
       localNotes,
       hasPendingChanges,
       statusOptions,
       onStatusChange: handleStatusChange,
       onRatingChange: handleRatingChange,
       onChangeNotes: setLocalNotes,
       onNotesFocus: handleNotesFocus,
       onAdd: () => void handleAddToBacklog(),
       onUpdate: () => void handleUpdateBacklog(),
       onRemove: () => setConfirmRemoveVisible(true),
       addedAt: backlogItem?.added_at ?? null,
      }}
      onRegisterBacklogOffset={(y) => registerSectionOffset('backlog', y)}
     />

     <GameDetailContentSections
      game={game}
      locale={i18n.language}
      onDescriptionToggle={() => setDescriptionExpanded((prev) => !prev)}
      onRegisterSectionOffset={registerSectionOffset}
      onStorylineToggle={() => setStorylineExpanded((prev) => !prev)}
      uiState={{
       isDescriptionExpanded: descriptionExpanded,
       isStorylineExpanded: storylineExpanded,
      }}
      viewModel={viewModel}
      whereItFits={whereItFits}
     />

     {secondarySectionsEnabled ? (
      <GameDetailRelatedSections
       sameSeriesGames={viewModel.sameSeriesGames}
       isSeriesLoading={isSeriesLoading}
       seriesTitle={viewModel.seriesTitle}
       dlcGames={viewModel.dlcGames}
       isAdditionsLoading={isAdditionsLoading}
       dlcTitle={t('gameDetail.dlc')}
       editionGames={viewModel.editionGames}
       editionsTitle={t('gameDetail.editions')}
       expansionGames={viewModel.expansionGames}
       expansionsTitle={t('gameDetail.expansions')}
       moreFromDeveloper={viewModel.moreFromDeveloper}
       isDeveloperGamesLoading={isDeveloperGamesLoading}
       moreFromDeveloperTitle={viewModel.moreFromDeveloperTitle}
       moreFromPublisher={viewModel.moreFromPublisher}
       isPublisherGamesLoading={isPublisherGamesLoading}
       moreFromPublisherTitle={viewModel.moreFromPublisherTitle}
       similarGames={viewModel.similarGames}
       isSimilarGamesLoading={isSimilarGamesLoading}
       similarGamesTitle={t('gameDetail.similarGames')}
       relatedCardWidth={relatedCardWidth}
       onRelatedGamePress={handleRelatedGamePress}
       registerSectionOffset={registerSectionOffset}
      />
     ) : null}
    </View>
   </Animated.ScrollView>

   <Animated.View
    pointerEvents={isStickyVisible ? 'auto' : 'none'}
    style={{
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     opacity: stickyHeaderOpacity,
     transform: [{ translateY: stickyHeaderTranslateY }],
    }}
   >
    <GameStickyHeader
     title={game.name}
     subtitle={viewModel.genres}
     imageUri={game.backgroundImage?.url ?? game.coverImage?.url ?? null}
     topInset={insets.top}
     onBackPress={handleBackPress}
    />
   </Animated.View>

   <ConfirmModal
    visible={confirmRemoveVisible}
    title={t('gameDetail.confirmRemove.title')}
    message={t('gameDetail.confirmRemove.message')}
    confirmLabel={t('gameDetail.confirmRemove.confirm')}
    cancelLabel={t('common.cancel')}
    isDestructive
    onConfirm={() => {
     setConfirmRemoveVisible(false);
     void handleRemoveFromBacklog();
    }}
    onCancel={() => setConfirmRemoveVisible(false)}
   />
  </KeyboardAvoidingView>
 );
}
