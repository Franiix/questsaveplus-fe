import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
 NativeScrollEvent,
 NativeSyntheticEvent,
 ScrollView as RNScrollView,
} from 'react-native';
import { Animated, KeyboardAvoidingView, Platform, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { RetryState } from '@/components/base/feedback/RetryState';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { GameCatalogAlternativeNamesButton } from '@/components/game/catalog/GameCatalogAlternativeNamesButton';
import { GameCatalogInfoSection } from '@/components/game/catalog/GameCatalogInfoSection';
import { GameStoreActionRow } from '@/components/game/catalog/GameStoreActionRow';
import { GameEditorialFeatureCard } from '@/components/game/GameEditorialFeatureCard';
import {
 getCatalogGameCategoryTranslationKey,
 getGameEditorialAudience,
 getGameEditorialPlacement,
 getGameEditorialPlaystyle,
 getGameEditorialReleaseReadiness,
 getGameEditorialSeriesNeighbors,
 getGameCatalogFranchiseName,
 getGameCatalogOverviewText,
 getGameCatalogRatings,
 getGameCatalogReleaseStatusLabel,
 getGameCatalogStoryline,
 getIgdbNamedItemExternalId,
 getGameCatalogPrimaryReleaseDate,
 hasGameCatalogInfoContent,
 hasGameCatalogMedia,
} from '@/shared/utils/gameCatalog';
import { GameBacklogPanel } from '@/components/game/GameBacklogPanel';
import { GameDescriptionSection } from '@/components/game/GameDescriptionSection';
import { GameDetailRelatedSections } from '@/components/game/GameDetailRelatedSections';
import { GameDetailJumpRow } from '@/components/game/GameDetailJumpRow';
import { GameHeroBanner } from '@/components/game/GameHeroBanner';
import { GameMetaSection } from '@/components/game/GameMetaSection';
import { GameMediaSection } from '@/components/game/GameMediaSection';
import { GameReleaseReadinessCard } from '@/components/game/GameReleaseReadinessCard';
import { GameStickyHeader } from '@/components/game/GameStickyHeader';
import { GameSummaryHeader } from '@/components/game/GameSummaryHeader';
import { useGameAdditions } from '@/hooks/useGameAdditions';
import { useGameBacklogController } from '@/hooks/useGameBacklogController';
import { useGameCommunityRating } from '@/hooks/useGameCommunityRating';
import { useGameDetail } from '@/hooks/useGameDetail';
import { useGameSeries } from '@/hooks/useGameSeries';
import { useGameSimilar } from '@/hooks/useGameSimilar';
import { useRelatedCompanyGames } from '@/hooks/useRelatedCompanyGames';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { colors, spacing } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';

const HERO_HEIGHT = 320;
const DESCRIPTION_COLLAPSE_LINES = 4;
const OVERVIEW_COLLAPSE_LINES = 3;
const DLC_CATEGORY_KEYS = new Set(['dlc_addon']);
const EXPANSION_CATEGORY_KEYS = new Set(['expansion', 'standalone_expansion']);
const EDITION_CATEGORY_KEYS = new Set(['bundle', 'pack', 'expanded_game']);

export default function GameDetailScreen() {
 const { id } = useLocalSearchParams<{ id: string }>();
 const gameId = Number(id);
 const { t, i18n } = useTranslation();
 const router = useRouter();
 const insets = useSafeAreaInsets();
 const { width: screenWidth } = useWindowDimensions();
 const { data: game, isLoading, isError } = useGameDetail(gameId);
 const { data: communityRating, isLoading: isCommunityRatingLoading } =
  useGameCommunityRating(gameId);
 const scrollViewRef = useRef<RNScrollView | null>(null);
 const sectionOffsetsRef = useRef<Record<string, number>>({});
 const scrollY = useRef(new Animated.Value(0)).current;
 const [descriptionExpanded, setDescriptionExpanded] = useState(false);
 const [storylineExpanded, setStorylineExpanded] = useState(false);
 const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
 const [isStickyVisible, setIsStickyVisible] = useState(false);
 const { data: additions = [], isLoading: isAdditionsLoading } = useGameAdditions({
  gameId,
  enabled: Number.isFinite(gameId),
 });
 const { data: gameSeries = [], isLoading: isSeriesLoading } = useGameSeries({
  gameId,
  enabled: Number.isFinite(gameId),
 });
 const { data: similarGamesRaw = [], isLoading: isSimilarGamesLoading } = useGameSimilar({
  gameId,
  enabled: Number.isFinite(gameId),
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
  enabled: Number.isFinite(gameId) && Boolean(primaryDeveloperCatalogId),
 });
 const { data: publisherGames = [], isLoading: isPublisherGamesLoading } = useRelatedCompanyGames({
  currentGameId: gameId,
  companyExternalId: primaryPublisherCatalogId,
  companyName: primaryPublisher?.name ?? null,
  companyType: 'publishers',
  enabled:
    Number.isFinite(gameId) &&
    Boolean(primaryPublisherCatalogId) &&
    primaryPublisher?.name !== primaryDeveloper?.name,
  });
 const sameSeriesGames = useMemo(
  () => gameSeries.filter((seriesGame) => getCatalogGameNumericId(seriesGame) !== gameId),
  [gameId, gameSeries],
 );
 const dlcGames = useMemo(
  () =>
   additions.filter((item) => {
    const key = getCatalogGameCategoryTranslationKey(item);
    return key ? DLC_CATEGORY_KEYS.has(key) : false;
   }),
  [additions],
 );
 const editionGames = useMemo(
  () =>
   additions.filter((item) => {
    const key = getCatalogGameCategoryTranslationKey(item);
    return key ? EDITION_CATEGORY_KEYS.has(key) : false;
   }),
  [additions],
 );
 const expansionGames = useMemo(
  () =>
   additions.filter((item) => {
    const key = getCatalogGameCategoryTranslationKey(item);
    return key ? EXPANSION_CATEGORY_KEYS.has(key) : false;
   }),
  [additions],
 );
 const moreFromDeveloper = useMemo(() => developerGames, [developerGames]);
 const moreFromPublisher = useMemo(() => publisherGames, [publisherGames]);
 const similarGames = useMemo(() => {
  const excludedIds = new Set(
   [
    gameId,
    ...sameSeriesGames.map(getCatalogGameNumericId),
    ...dlcGames.map(getCatalogGameNumericId),
    ...editionGames.map(getCatalogGameNumericId),
    ...expansionGames.map(getCatalogGameNumericId),
    ...moreFromDeveloper.map(getCatalogGameNumericId),
    ...moreFromPublisher.map(getCatalogGameNumericId),
   ].filter((value): value is number => value !== null),
  );

  return similarGamesRaw.filter((item) => {
   const relatedId = getCatalogGameNumericId(item);
   return relatedId !== null && !excludedIds.has(relatedId);
  });
 }, [
  dlcGames,
  editionGames,
  expansionGames,
  gameId,
  moreFromDeveloper,
  moreFromPublisher,
  sameSeriesGames,
  similarGamesRaw,
 ]);
 const relatedCardWidth = useMemo(
  () => Math.min(170, Math.floor(screenWidth * 0.42)),
  [screenWidth],
 );
 const handleRelatedGamePress = useCallback(
  (relatedGame: CatalogGame) => {
   const relatedGameId = getCatalogGameNumericId(relatedGame);
   if (relatedGameId === null) return;
   router.push({ pathname: '/game/[id]', params: { id: relatedGameId } });
  },
  [router],
 );
 const handleDeveloperPress = useCallback(() => {
  const developerParam = primaryDeveloperCatalogId ?? primaryDeveloper?.slug;
  if (!developerParam) return;
  router.push({
   pathname: '/',
   params: {
    developerId: developerParam,
    developerName: primaryDeveloper?.name ?? '',
    originGameName: game?.name ?? '',
    pivotType: 'developer',
   },
  });
 }, [game?.name, primaryDeveloper?.name, primaryDeveloper?.slug, primaryDeveloperCatalogId, router]);
 const handlePublisherPress = useCallback(() => {
  const publisherParam = primaryPublisherCatalogId ?? primaryPublisher?.slug;
  if (!publisherParam) return;
  router.push({
   pathname: '/',
   params: {
    publisherId: publisherParam,
    publisherName: primaryPublisher?.name ?? '',
    originGameName: game?.name ?? '',
    pivotType: 'publisher',
   },
  });
 }, [game?.name, primaryPublisher?.name, primaryPublisher?.slug, primaryPublisherCatalogId, router]);
 const registerSectionOffset = useCallback((key: string, y: number) => {
  sectionOffsetsRef.current[key] = y;
 }, []);
 const scrollToSection = useCallback((key: string) => {
  const y = sectionOffsetsRef.current[key];
  if (typeof y !== 'number') return;
  scrollViewRef.current?.scrollTo({ y: Math.max(0, y - spacing.lg), animated: true });
 }, []);
 const stickyThreshold = HERO_HEIGHT - 88;
 const stickyHeaderOpacity = scrollY.interpolate({
  inputRange: [stickyThreshold - 40, stickyThreshold],
  outputRange: [0, 1],
  extrapolate: 'clamp',
 });
 const stickyHeaderTranslateY = scrollY.interpolate({
  inputRange: [stickyThreshold - 40, stickyThreshold],
  outputRange: [-12, 0],
  extrapolate: 'clamp',
 });
 const hasCatalogMediaSection = game?.providerId === 'igdb' && hasGameCatalogMedia(igdbRaw);
 const hasCatalogInfoSection = game?.providerId === 'igdb' && hasGameCatalogInfoContent(igdbRaw);
 const handleScroll = useCallback(
  (event: NativeSyntheticEvent<NativeScrollEvent>) => {
   const offsetY = event.nativeEvent.contentOffset.y;
   const shouldShow = offsetY >= stickyThreshold;
   if (shouldShow !== isStickyVisible) {
    setIsStickyVisible(shouldShow);
   }
  },
  [isStickyVisible, stickyThreshold],
 );
 const hasSeriesSection = sameSeriesGames.length > 0 || isSeriesLoading;
 const hasAdditionsSection =
  dlcGames.length > 0 ||
 editionGames.length > 0 ||
 expansionGames.length > 0 ||
 isAdditionsLoading;
 const hasDeveloperSection = moreFromDeveloper.length > 0 || isDeveloperGamesLoading;
 const hasPublisherSection = moreFromPublisher.length > 0 || isPublisherGamesLoading;

 const jumpItems = useMemo(
  () => [
   {
    key: 'backlog',
    label: t('gameDetail.jumpToBacklog'),
    onPress: () => scrollToSection('backlog'),
   },
   ...(hasCatalogInfoSection
    ? [
       {
        key: 'game-info',
        label: t('gameDetail.jumpToGameInfo'),
        onPress: () => scrollToSection('game-info'),
       },
      ]
    : []),
   ...(hasCatalogMediaSection
    ? [
       {
        key: 'media',
       label: t('gameDetail.jumpToMedia'),
       onPress: () => scrollToSection('media'),
       },
      ]
    : []),
   ...(hasSeriesSection
    ? [
       {
        key: 'series',
        label: t('gameDetail.jumpToSeries'),
        onPress: () => scrollToSection('series'),
       },
      ]
    : []),
   ...(hasAdditionsSection
    ? [
       {
        key: 'contents',
        label: t('gameDetail.jumpToContents'),
        onPress: () => scrollToSection('contents'),
       },
      ]
    : []),
   ...(hasDeveloperSection
    ? [
       {
        key: 'studio',
        label: t('gameDetail.jumpToDeveloperGames'),
        onPress: () => scrollToSection('developer-games'),
       },
      ]
    : []),
   ...(hasPublisherSection
    ? [
       {
        key: 'publisher',
        label: t('gameDetail.jumpToPublisherGames'),
        onPress: () => scrollToSection('publisher-games'),
       },
      ]
    : []),
  ],
  [
   hasSeriesSection,
   hasAdditionsSection,
   hasCatalogInfoSection,
   hasCatalogMediaSection,
   hasDeveloperSection,
   hasPublisherSection,
   scrollToSection,
   t,
  ],
 );

 const {
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

function handleNotesFocus() {
  setTimeout(() => {
    const backlogOffset = sectionOffsetsRef.current.backlog;
    if (typeof backlogOffset === 'number') {
     scrollViewRef.current?.scrollTo({
      y: Math.max(0, backlogOffset - spacing.md),
      animated: true,
     });
     return;
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, 200);
 }

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
     onRetry={() => router.back()}
    />
   </View>
  );
 }

 const genres = game.genres
  .map((genre) => t(`genres.${genre.slug}`, { defaultValue: genre.name }))
  .join(', ');
 const developerName = game.developers[0]?.name ?? null;
 const publisherName = game.publishers[0]?.name ?? null;
 const releaseDate =
  getGameCatalogPrimaryReleaseDate(igdbRaw, i18n.language) ??
  (game.releasedAt
   ? formatDate(game.releasedAt, i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })
   : null);
 const releaseYear = game.releasedAt
  ? new Date(game.releasedAt).getFullYear().toString()
  : typeof (igdbRaw as { first_release_date?: number | null } | null)?.first_release_date === 'number'
   ? new Date((igdbRaw as { first_release_date: number }).first_release_date * 1000).getFullYear().toString()
   : null;
 const overviewText = getGameCatalogOverviewText(game.summary, igdbRaw) ?? '';
 const storyline = getGameCatalogStoryline(igdbRaw) ?? '';
 const storylineText = storyline && storyline !== overviewText ? storyline : '';
 const franchiseName = getGameCatalogFranchiseName(igdbRaw);
 const igdbCategoryKey = getCatalogGameCategoryTranslationKey(game);
 const gameTypeLabel = igdbCategoryKey
  ? t(`gameDetail.gameTypes.${igdbCategoryKey}`, { defaultValue: igdbCategoryKey })
  : null;
 const releaseStatusLabel = getGameCatalogReleaseStatusLabel(igdbRaw, t);
 const {
  aggregatedRating: criticRating,
  aggregatedRatingCount: criticRatingCount,
  totalRating: igdbTotalRating,
  totalRatingCount: igdbVotesCount,
 } = getGameCatalogRatings(igdbRaw);
 const backlogStatusLabel =
  isInBacklog && selectedStatus
   ? sanitizeBacklogStatusLabel(
      statusOptions.find((option) => option.value === selectedStatus)?.label ?? '',
     )
   : null;
 const backlogStatusColor = isInBacklog ? getBacklogStatusColor(selectedStatus) : null;
 const howItPlays = getGameEditorialPlaystyle(
  igdbRaw,
  t,
  i18n.language.startsWith('it') ? 'it' : 'en',
 );
 const seriesNeighbors = getGameEditorialSeriesNeighbors(game, sameSeriesGames);
 const whereItFitsBase = getGameEditorialPlacement(game, t, sameSeriesGames);
 const whoItsFor = getGameEditorialAudience(game, igdbRaw, t);
 const releaseReadiness = getGameEditorialReleaseReadiness(game, t, i18n.language);
 const whereItFits = !whereItFitsBase?.rows
  ? whereItFitsBase
  : {
     ...whereItFitsBase,
     rows: whereItFitsBase.rows.map((row) => {
      if (row.key === 'version-family') {
       return {
        ...row,
        onPress: hasAdditionsSection ? () => scrollToSection('contents') : null,
       };
      }

      if (row.key === 'prequel' || row.key === 'sequel') {
       const neighbor = [seriesNeighbors.prequel, seriesNeighbors.sequel].find(
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
     onBackPress={() => router.back()}
     style={{ height: HERO_HEIGHT, width: screenWidth }}
    />

    <View style={{ paddingHorizontal: spacing.md, marginTop: -spacing.lg }}>
      <GameSummaryHeader
        title={game.name}
        genreText={genres || null}
        gameTypeLabel={gameTypeLabel}
        releaseStatusLabel={releaseStatusLabel}
        statusLabel={backlogStatusLabel}
        statusColor={backlogStatusColor}
        releaseYear={releaseYear}
        platforms={game.platforms}
        variant="screen"
       />

       <GameMetaSection
        title={t('gameDetail.editorial.snapshot.title')}
        subtitle={t('gameDetail.editorial.snapshot.subtitle')}
        criticRating={criticRating}
        criticRatingCount={criticRatingCount}
        igdbCommunityRating={igdbTotalRating}
        igdbCommunityRatingCount={igdbVotesCount}
        isQuestSaveRatingLoading={isCommunityRatingLoading}
        questSaveRating={communityRating?.averageRating ?? null}
        questSaveRatingCount={communityRating?.ratingsCount ?? 0}
      releaseDate={releaseDate}
      developerName={developerName}
      publisherName={publisherName}
      onDeveloperPress={primaryDeveloper ? handleDeveloperPress : null}
      onPublisherPress={primaryPublisher ? handlePublisherPress : null}
         labels={{
          critic: t('gameDetail.critic'),
          igdbCommunity: t('gameDetail.igdbCommunity'),
          questSavePlus: t('gameDetail.questSavePlus'),
          noVotes: t('gameDetail.noVotes'),
          ratingsCount: (count: number) =>
           t('gameDetail.ratingsCount', { count, defaultValue: `${count}` }),
          releaseDate: t('gameDetail.releaseDate'),
          developer: t('gameDetail.developer'),
          publisher: t('gameDetail.publisher'),
         }}
      />

     <View
     style={{ marginTop: spacing.xl, marginBottom: spacing.md }}
      onLayout={(event) => registerSectionOffset('backlog', event.nativeEvent.layout.y)}
     >
      <GameBacklogPanel
       isInBacklog={isInBacklog}
       isBacklogLoading={isBacklogLoading}
       isMutating={isMutating}
       isCreateMutating={isCreateMutating}
       isUpdateMutating={isUpdateMutating}
       isDeleteMutating={isDeleteMutating}
       selectedStatus={selectedStatus}
       selectedRating={selectedRating}
       localNotes={localNotes}
       showNotes
       hasPendingChanges={hasPendingChanges}
       statusOptions={statusOptions}
       onStatusChange={handleStatusChange}
       onRatingChange={handleRatingChange}
       onChangeNotes={setLocalNotes}
       onNotesFocus={handleNotesFocus}
       onAdd={() => void handleAddToBacklog()}
       onUpdate={() => void handleUpdateBacklog()}
       onRemove={() => setConfirmRemoveVisible(true)}
      />
      </View>

      <View style={{ marginBottom: spacing.md }}>
       <GameReleaseReadinessCard
        title={t('gameDetail.editorial.releaseReadiness.title')}
        subtitle={releaseReadiness?.subtitle ?? null}
        statusLabel={releaseStatusLabel}
        rows={releaseReadiness?.rows ?? []}
       />
      </View>

      <GameDescriptionSection
       title={t('gameDetail.about')}
      description={overviewText}
      isExpanded={descriptionExpanded}
      collapsedLines={OVERVIEW_COLLAPSE_LINES}
      onToggle={() => setDescriptionExpanded((prev) => !prev)}
     />

      <GameStoreActionRow
       providerId={game.providerId}
       raw={game.metadata?.raw}
       title={t('gameDetail.storeActions')}
       ctaLabel={t('gameDetail.openStore')}
      />

      <GameEditorialFeatureCard
       title={t('gameDetail.editorial.playstyle.title')}
       subtitle={howItPlays?.subtitle ?? null}
       icon="gamepad"
       accentColor={colors.primary.DEFAULT}
       rows={howItPlays?.rows ?? []}
       closeLabel={t('gameDetail.closeInfo')}
      />

      <GameEditorialFeatureCard
       title={t('gameDetail.editorial.placement.title')}
       subtitle={whereItFits?.subtitle ?? null}
       icon="layer-group"
       accentColor={colors.accent.DEFAULT}
       rows={whereItFits?.rows ?? []}
       closeLabel={t('gameDetail.closeInfo')}
      />

      <View style={{ marginBottom: spacing.md }}>
       <GameEditorialFeatureCard
        title={t('gameDetail.editorial.audience.title')}
        subtitle={whoItsFor?.subtitle ?? null}
       icon="compass"
       accentColor={colors.success}
       bullets={whoItsFor?.bullets ?? []}
       closeLabel={t('gameDetail.closeInfo')}
       />
      </View>

     <GameDescriptionSection
      title={t('gameDetail.storyline')}
      description={storylineText}
      isExpanded={storylineExpanded}
      collapsedLines={DESCRIPTION_COLLAPSE_LINES}
      onToggle={() => setStorylineExpanded((prev) => !prev)}
     />

     <GameCatalogAlternativeNamesButton
      providerId={game.providerId}
      raw={game.metadata?.raw}
      title={t('gameDetail.openAlsoKnownAs')}
      closeLabel={t('gameDetail.closeInfo')}
     />

     <GameDetailJumpRow title={t('gameDetail.jumpTo')} items={jumpItems} />

     {hasCatalogInfoSection ? (
      <View onLayout={(event) => registerSectionOffset('game-info', event.nativeEvent.layout.y)}>
       <GameCatalogInfoSection
        providerId={game.providerId}
        raw={game.metadata?.raw}
        labels={{
         title: t('gameDetail.gameInfo'),
         gameModes: t('gameDetail.gameModes'),
         playerPerspectives: t('gameDetail.playerPerspectives'),
         themes: t('gameDetail.themes'),
         franchise: t('gameDetail.franchise'),
         collection: t('gameDetail.collection'),
         releaseDates: t('gameDetail.releaseDates'),
         releaseDatesOpen: t('gameDetail.releaseDatesOpen'),
         ageRatings: t('gameDetail.ageRatings'),
         engines: t('gameDetail.engines'),
         type: t('gameDetail.type'),
         parentGame: t('gameDetail.parentGame'),
         multiplayer: t('gameDetail.multiplayer'),
         languageSupport: t('gameDetail.languageSupport'),
         languageSupportOpen: t('gameDetail.languageSupportOpen'),
         websites: t('gameDetail.websites'),
         websitesOpen: t('gameDetail.websites'),
         storeHint: t('gameDetail.storeHint'),
         closeInfo: t('gameDetail.closeInfo'),
         language: t('gameDetail.language'),
         interface: t('gameDetail.interface'),
         audio: t('gameDetail.audio'),
         subtitles: t('gameDetail.subtitles'),
         gameplaySection: t('gameDetail.gameplaySection'),
         universeSection: t('gameDetail.universeSection'),
         multiplayerSection: t('gameDetail.multiplayerSection'),
         firstRelease: t('gameDetail.firstRelease'),
         showAllDates: (count: number) => t('gameDetail.showAllDates', { count }),
         showLessDates: t('gameDetail.showLessDates'),
         linkGroups: {
          official: t('gameDetail.linkGroups.official'),
          store: t('gameDetail.linkGroups.store'),
          community: t('gameDetail.linkGroups.community'),
          video: t('gameDetail.linkGroups.video'),
          social: t('gameDetail.linkGroups.social'),
         },
        }}
        locale={i18n.language}
       />
      </View>
     ) : null}

     {hasCatalogMediaSection ? (
      <View
       onLayout={(event) => {
        registerSectionOffset('media', event.nativeEvent.layout.y);
       }}
      >
       <GameMediaSection
        providerId={game.providerId}
        raw={game.metadata?.raw}
        labels={{
         title: t('gameDetail.media'),
         screenshots: t('gameDetail.screenshots'),
         artworks: t('gameDetail.artworks'),
         trailers: t('gameDetail.trailers'),
         empty: t('gameDetail.noScreenshots'),
         watchTrailer: t('gameDetail.watchTrailer'),
        }}
       />
      </View>
     ) : null}

      <GameDetailRelatedSections
       sameSeriesGames={sameSeriesGames}
       isSeriesLoading={isSeriesLoading}
       seriesTitle={
        franchiseName
         ? t('gameDetail.seriesTitle', {
            name: franchiseName,
            defaultValue: `Serie ${franchiseName}`,
           })
         : t('gameDetail.otherSeriesGames')
       }
       dlcGames={dlcGames}
       isAdditionsLoading={isAdditionsLoading}
       dlcTitle={t('gameDetail.dlc')}
       editionGames={editionGames}
       editionsTitle={t('gameDetail.editions')}
       expansionGames={expansionGames}
       expansionsTitle={t('gameDetail.expansions')}
       moreFromDeveloper={moreFromDeveloper}
       isDeveloperGamesLoading={isDeveloperGamesLoading}
       moreFromDeveloperTitle={t('gameDetail.moreFromDeveloper', {
        name: primaryDeveloper?.name ?? t('gameDetail.developer'),
       })}
       moreFromPublisher={moreFromPublisher}
       isPublisherGamesLoading={isPublisherGamesLoading}
       moreFromPublisherTitle={t('gameDetail.moreFromPublisher', {
        name: primaryPublisher?.name ?? t('gameDetail.publisher'),
       })}
       similarGames={similarGames}
       isSimilarGamesLoading={isSimilarGamesLoading}
       similarGamesTitle={t('gameDetail.similarGames')}
       relatedCardWidth={relatedCardWidth}
       onRelatedGamePress={handleRelatedGamePress}
       registerSectionOffset={registerSectionOffset}
      />

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
     subtitle={genres}
     imageUri={game.backgroundImage?.url ?? game.coverImage?.url ?? null}
     topInset={insets.top}
     onBackPress={() => router.back()}
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

function getCatalogGameNumericId(game: CatalogGame) {
 if (typeof game.gameId === 'number' && Number.isFinite(game.gameId)) {
  return game.gameId;
 }

 const externalId = Number(game.externalId);
 return Number.isFinite(externalId) ? externalId : null;
}

function sanitizeBacklogStatusLabel(label: string) {
 return label.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function getBacklogStatusColor(status: string) {
 switch (status) {
  case 'WISHLIST':
   return colors.status.wishlist;
  case 'WANT_TO_PLAY':
   return colors.status.want_to_play;
  case 'PLAYING':
   return colors.status.playing;
  case 'ONGOING':
   return colors.status.ongoing;
  case 'COMPLETED':
   return colors.status.completed;
  case 'ABANDONED':
   return colors.status.abandoned;
  default:
   return colors.primary.DEFAULT;
 }
}
