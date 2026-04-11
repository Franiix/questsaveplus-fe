import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
 useAnimatedScrollHandler,
 useAnimatedStyle,
 useDerivedValue,
 useSharedValue,
 withSpring,
 withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { RetryState } from '@/components/base/feedback/RetryState';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { SearchFilterToolbar } from '@/components/base/layout/SearchFilterToolbar';
import { AppliedGameFiltersRow } from '@/components/game/AppliedGameFiltersRow';
import { DiscoveryContextCard } from '@/components/game/DiscoveryContextCard';
import { DiscoverySortBar } from '@/components/game/DiscoverySortBar';
import { GameCard } from '@/components/game/GameCard';
import { GameCardSkeleton } from '@/components/game/GameCardSkeleton';
import { GameCarouselSection } from '@/components/game/GameCarouselSection';
import { GameDetailSheet } from '@/components/game/GameDetailSheet';
import { GameFilterSheet } from '@/components/game/GameFilterSheet';
import { QuickDiscoveryPresetsRow } from '@/components/game/QuickDiscoveryPresetsRow';
import { RecentlyAddedRow } from '@/components/game/RecentlyAddedRow';
import { useDebounce } from '@/hooks/useDebounce';
import { useGames } from '@/hooks/useGames';
import { useHomeSectionGames } from '@/hooks/useHomeSectionGames';
import { useCatalogDevelopers } from '@/hooks/useCatalogDevelopers';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useCatalogParentPlatforms } from '@/hooks/useCatalogParentPlatforms';
import { useCatalogPublishers } from '@/hooks/useCatalogPublishers';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';

const NUM_COLUMNS = 2;
const COLUMN_GAP = spacing.sm;
const HORIZONTAL_PADDING = spacing.md;

function matchesCatalogFilterValue(
 value: string | undefined,
 item: { externalId: string; slug?: string | null },
) {
 if (!value) return false;
 return item.externalId === value || item.slug === value;
}

function formatDate(date: Date): string {
 return date.toISOString().split('T')[0];
}

type HomeSection = {
 key: string;
 title: string;
 games: CatalogGame[];
 query: ReturnType<typeof useHomeSectionGames>;
};

function sortByEditorialScore(games: CatalogGame[]) {
 return [...games].sort((left, right) => {
  const rightRating = right.rating ?? 0;
  const leftRating = left.rating ?? 0;
  if (rightRating !== leftRating) return rightRating - leftRating;

  const rightCount = right.ratingsCount ?? 0;
  const leftCount = left.ratingsCount ?? 0;
  return rightCount - leftCount;
 });
}

export default function HomeScreen() {
 const { t } = useTranslation();
 const params = useLocalSearchParams<{
  genreSlug?: string;
  genreName?: string;
  developerId?: string;
  developerName?: string;
  publisherId?: string;
  publisherName?: string;
  parentPlatformId?: string;
  originGameName?: string;
  pivotType?: 'genre' | 'developer' | 'publisher';
 }>();
 const { width: screenWidth, height: screenHeight } = useWindowDimensions();
 const router = useRouter();
 const appVersion = Constants.expoConfig?.version ?? '1.0.0';
 const [search, setSearch] = useState('');
 const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
 const [appliedFilters, setAppliedFilters] = useState<GameDiscoveryFilters>({
  genre: undefined,
  platform: undefined,
 });
 const [draftFilters, setDraftFilters] = useState<GameDiscoveryFilters>({
  genre: undefined,
  platform: undefined,
 });
 const [selectedOrdering, setSelectedOrdering] = useState<
  'relevance' | '-rating' | '-released' | '-added' | null
 >(null);
 const lastRouteFilterSignatureRef = useRef<string | null>(null);
 const debouncedSearch = useDebounce(search, 400);
 const [sheetGame, setSheetGame] = useState<CatalogGame | null>(null);
 const flatListRef = useRef<FlatList<CatalogGame>>(null);
 const today = useMemo(() => new Date(), []);
 const threeMonthsAgo = useMemo(() => {
  const date = new Date(today);
  date.setMonth(date.getMonth() - 3);
  return date;
 }, [today]);
 const nextYearEnd = useMemo(() => new Date(today.getFullYear() + 1, 11, 31), [today]);
 const tomorrow = useMemo(() => {
  const date = new Date(today);
  date.setDate(date.getDate() + 1);
  return date;
 }, [today]);
 const startOfYear = useMemo(() => new Date(today.getFullYear(), 0, 1), [today]);
 const endOfYear = useMemo(() => new Date(today.getFullYear(), 11, 31), [today]);
 const classicStartDate = useMemo(() => new Date(1990, 0, 1), []);
 const classicEndDate = useMemo(() => new Date(2012, 11, 31), []);

 const cardWidth = useMemo(() => {
  return Math.floor(
   (screenWidth - HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS,
  );
 }, [screenWidth]);
 const carouselCardWidth = useMemo(
  () => Math.min(170, Math.floor(screenWidth * 0.42)),
  [screenWidth],
 );

 const defaultOrdering = useMemo(() => {
  if (debouncedSearch.trim().length > 0) {
   return 'relevance' as const;
  }

  return '-rating' as const;
 }, [debouncedSearch]);
 const activeOrdering = selectedOrdering ?? defaultOrdering;
 const orderingParam = activeOrdering === 'relevance' ? undefined : activeOrdering;
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
 const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, isError, refetch } =
  useGames({
   search: debouncedSearch,
   filters: appliedFilters,
   ordering: orderingParam,
  });
 const indieGenreId = useMemo(
  () => genres.find((genre) => genre.slug === 'indie')?.externalId,
  [genres],
 );
 const trendingQuery = useHomeSectionGames({
  queryKey: 'trending',
  dates: `${formatDate(threeMonthsAgo)},${formatDate(today)}`,
  ordering: '-added',
 });
 const newGamesQuery = useHomeSectionGames({
  queryKey: 'new',
  dates: `${formatDate(startOfYear)},${formatDate(today)}`,
  ordering: '-released',
 });
 const upcomingGamesQuery = useHomeSectionGames({
  queryKey: 'upcoming',
  dates: `${formatDate(tomorrow)},${formatDate(endOfYear)}`,
  ordering: 'released',
 });
 const bestOfYearQuery = useHomeSectionGames({
  queryKey: 'best-of-year',
  dates: `${formatDate(startOfYear)},${formatDate(today)}`,
  ordering: '-added',
 });
 const allTimeTopQuery = useHomeSectionGames({
  queryKey: 'all-time-top-250',
  dates: `1980-01-01,${formatDate(today)}`,
   ordering: '-added',
  pageSize: 50,
  maxPages: 5,
 });
 const classicsQuery = useHomeSectionGames({
  queryKey: 'classics',
   dates: `${formatDate(classicStartDate)},${formatDate(classicEndDate)}`,
  ordering: '-added',
  pageSize: 30,
 });
 const indieWatchQuery = useHomeSectionGames({
  queryKey: 'indie-watchlist',
  dates: `${formatDate(startOfYear)},${formatDate(nextYearEnd)}`,
  ordering: '-added',
  genres: indieGenreId,
 });
 const coopGamesQuery = useHomeSectionGames({
  queryKey: 'local-coop-games',
  dates: `2000-01-01,${formatDate(today)}`,
  ordering: '-added',
  gameModes: '4',
 });

 const games = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
 const trendingGames = useMemo(
  () => trendingQuery.data?.pages.flatMap((page) => page.items) ?? [],
  [trendingQuery.data],
 );
 const newGames = useMemo(
  () => newGamesQuery.data?.pages.flatMap((page) => page.items) ?? [],
  [newGamesQuery.data],
 );
 const upcomingGames = useMemo(
  () => upcomingGamesQuery.data?.pages.flatMap((page) => page.items) ?? [],
  [upcomingGamesQuery.data],
 );
 const bestOfYearGames = useMemo(
  () =>
   sortByEditorialScore(
    (bestOfYearQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
     (game) => (game.ratingsCount ?? 0) >= 25,
    ),
   ),
  [bestOfYearQuery.data],
 );
 const allTimeTopGames = useMemo(
  () =>
   sortByEditorialScore(
    (allTimeTopQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
     (game) => (game.ratingsCount ?? 0) >= 120,
    ),
   ),
  [allTimeTopQuery.data],
 );
 const classicGames = useMemo(
  () =>
   sortByEditorialScore(
    (classicsQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
     (game) => (game.ratingsCount ?? 0) >= 60,
    ),
   ),
  [classicsQuery.data],
 );
 const indieWatchGames = useMemo(
  () => indieWatchQuery.data?.pages.flatMap((page) => page.items) ?? [],
  [indieWatchQuery.data],
 );
 const coopGames = useMemo(
  () => coopGamesQuery.data?.pages.flatMap((page) => page.items) ?? [],
  [coopGamesQuery.data],
 );
 const routeDiscoveryFilters = useMemo(
  () => ({
   genre: typeof params.genreSlug === 'string' ? params.genreSlug : undefined,
   developer: typeof params.developerId === 'string' ? params.developerId : undefined,
   publisher: typeof params.publisherId === 'string' ? params.publisherId : undefined,
   platform: typeof params.parentPlatformId === 'string' ? params.parentPlatformId : undefined,
  }),
  [
   params.developerId,
   params.genreSlug,
   params.parentPlatformId,
   params.publisherId,
  ],
 );
 const hasActiveFilters =
  Boolean(appliedFilters.genre) ||
  Boolean(appliedFilters.platform) ||
  Boolean(appliedFilters.developer) ||
  Boolean(appliedFilters.publisher);
 const isDiscoveryMode = debouncedSearch.trim().length > 0 || hasActiveFilters;
 const platformMap = useMemo(
  () => new Map(parentPlatforms.map((platform) => [platform.externalId, platform.name])),
  [parentPlatforms],
 );
 const activeFilters = useMemo(() => {
  const fallbackLabels = {
   genre: typeof params.genreName === 'string' ? params.genreName : undefined,
   developer: typeof params.developerName === 'string' ? params.developerName : undefined,
   publisher: typeof params.publisherName === 'string' ? params.publisherName : undefined,
  };
  const resolveGenreLabel = (value: string) => {
   const genre = genres.find((item) => matchesCatalogFilterValue(value, item));
   if (genre) {
    return genre.slug ? t(`genres.${genre.slug}`, { defaultValue: genre.name }) : genre.name;
   }
   return fallbackLabels.genre ?? value;
  };
  const resolveDeveloperLabel = (value: string) =>
   developers.find((item) => matchesCatalogFilterValue(value, item))?.name ??
   fallbackLabels.developer ??
   value;
  const resolvePublisherLabel = (value: string) =>
   publishers.find((item) => matchesCatalogFilterValue(value, item))?.name ??
   fallbackLabels.publisher ??
   value;

  return [
   ...(appliedFilters.genre
    ? [
       {
        key: `genre-${appliedFilters.genre}`,
        label: resolveGenreLabel(appliedFilters.genre),
        onRemove: () =>
         setAppliedFilters((current) => ({
          ...current,
          genre: undefined,
         })),
       },
      ]
    : []),
   ...(appliedFilters.platform
    ? [
       {
        key: `platform-${appliedFilters.platform}`,
        label: platformMap.get(appliedFilters.platform) ?? appliedFilters.platform,
        onRemove: () =>
         setAppliedFilters((current) => ({
          ...current,
          platform: undefined,
         })),
       },
      ]
    : []),
   ...(appliedFilters.developer
    ? [
       {
        key: `developer-${appliedFilters.developer}`,
        label: resolveDeveloperLabel(appliedFilters.developer),
        onRemove: () =>
         setAppliedFilters((current) => ({
          ...current,
          developer: undefined,
         })),
       },
      ]
    : []),
   ...(appliedFilters.publisher
    ? [
       {
        key: `publisher-${appliedFilters.publisher}`,
        label: resolvePublisherLabel(appliedFilters.publisher),
        onRemove: () =>
         setAppliedFilters((current) => ({
          ...current,
          publisher: undefined,
         })),
       },
      ]
    : []),
  ];
 }, [appliedFilters, developers, genres, params.developerName, params.genreName, params.publisherName, platformMap, publishers, t]);
 const discoveryContextLabel = useMemo(() => {
  if (appliedFilters.developer) {
   const developer = developers.find((item) => matchesCatalogFilterValue(appliedFilters.developer, item));
   const name = developer?.name ?? params.developerName;
   return name ? t('home.discoveryDeveloper', { name }) : null;
  }

  if (appliedFilters.publisher) {
   const publisher = publishers.find((item) => matchesCatalogFilterValue(appliedFilters.publisher, item));
   const name = publisher?.name ?? params.publisherName;
   return name ? t('home.discoveryPublisher', { name }) : null;
  }

  if (appliedFilters.genre) {
   const genre = genres.find((item) => matchesCatalogFilterValue(appliedFilters.genre, item));
   const name = genre
    ? genre.slug
      ? t(`genres.${genre.slug}`, { defaultValue: genre.name })
      : genre.name
    : params.genreName;
   return name ? t('home.discoveryGenre', { name }) : null;
  }

  if (appliedFilters.platform) {
   const name = platformMap.get(appliedFilters.platform) ?? appliedFilters.platform;
   return name ? t('home.discoveryPlatform', { name }) : null;
  }

  return null;
 }, [appliedFilters, developers, genres, params.developerName, params.genreName, params.publisherName, platformMap, publishers, t]);
 const discoveryContextCard = useMemo(() => {
  if (appliedFilters.developer) {
   const developer = developers.find((item) => matchesCatalogFilterValue(appliedFilters.developer, item));
   const name = developer?.name ?? params.developerName;
   return name
    ? {
       title: t('home.discoveryDeveloperTitle', { name }),
       subtitle: t('home.discoveryDeveloperSubtitle', { name }),
       icon: 'code' as const,
      }
    : null;
  }

  if (appliedFilters.publisher) {
   const publisher = publishers.find((item) => matchesCatalogFilterValue(appliedFilters.publisher, item));
   const name = publisher?.name ?? params.publisherName;
   return name
    ? {
       title: t('home.discoveryPublisherTitle', { name }),
       subtitle: t('home.discoveryPublisherSubtitle', { name }),
       icon: 'building' as const,
      }
    : null;
  }

  if (appliedFilters.genre) {
   const genre = genres.find((item) => matchesCatalogFilterValue(appliedFilters.genre, item));
   const genreName = genre
    ? genre.slug
      ? t(`genres.${genre.slug}`, { defaultValue: genre.name })
      : genre.name
    : params.genreName ?? appliedFilters.genre;
   return {
    title: t('home.discoveryGenreTitle', { name: genreName }),
    subtitle: t('home.discoveryGenreSubtitle', { name: genreName }),
    icon: 'compass' as const,
   };
  }

  if (appliedFilters.platform) {
   const name = platformMap.get(appliedFilters.platform) ?? appliedFilters.platform;
   return name
    ? {
       title: t('home.discoveryPlatformTitle', { name }),
       subtitle: t('home.discoveryPlatformSubtitle', { name }),
       icon: 'cpu' as const,
      }
    : null;
  }

 return null;
}, [appliedFilters, developers, genres, params.developerName, params.genreName, params.publisherName, platformMap, publishers, t]);
const discoveryOriginLabel = useMemo(() => {
  const isRouteDrivenDiscovery =
   appliedFilters.genre === routeDiscoveryFilters.genre &&
   appliedFilters.developer === routeDiscoveryFilters.developer &&
   appliedFilters.publisher === routeDiscoveryFilters.publisher &&
   appliedFilters.platform === routeDiscoveryFilters.platform;

  if (!params.originGameName || !hasActiveFilters || !isRouteDrivenDiscovery) return null;
  return t('home.discoveryOrigin', { name: params.originGameName });
 }, [appliedFilters, hasActiveFilters, params.originGameName, routeDiscoveryFilters, t]);
 const discoveryEmptyState = useMemo(() => {
  if (discoveryContextCard) {
   return {
    title: t('home.emptyDiscovery.title', { context: discoveryContextCard.title }),
    subtitle: t('home.emptyDiscovery.subtitle'),
   };
  }

  if (debouncedSearch.trim().length > 0) {
   return {
    title: t('home.emptySearch.title'),
    subtitle: t('home.emptySearch.subtitle'),
   };
  }

  return {
   title: t('home.emptyBrowse.title'),
   subtitle: t('home.emptyBrowse.subtitle'),
  };
 }, [debouncedSearch, discoveryContextCard, t]);
 const quickDiscoveryPresets = useMemo(() => {
  const indie = genres.find((genre) => genre.slug === 'indie');
  const rpg = genres.find((genre) => genre.slug === 'role-playing-games-rpg');
  const strategy = genres.find((genre) => genre.slug === 'strategy');
  const shooter = genres.find((genre) => genre.slug === 'shooter');
  return [
   ...(indie
    ? [
       {
        key: `preset-${indie.slug}`,
        label: t(`genres.${indie.slug}`, { defaultValue: indie.name }),
        onPress: () => {
         const nextFilters = { genre: indie.externalId };
         setSearch('');
         setDraftFilters(nextFilters);
         setAppliedFilters(nextFilters);
        },
       },
      ]
    : []),
   ...(rpg
    ? [
       {
        key: `preset-${rpg.slug}`,
        label: t(`genres.${rpg.slug}`, { defaultValue: rpg.name }),
        onPress: () => {
         const nextFilters = { genre: rpg.externalId };
         setSearch('');
         setDraftFilters(nextFilters);
         setAppliedFilters(nextFilters);
        },
       },
      ]
    : []),
   ...(strategy
    ? [
       {
        key: `preset-${strategy.slug}`,
        label: t(`genres.${strategy.slug}`, { defaultValue: strategy.name }),
        onPress: () => {
         const nextFilters = { genre: strategy.externalId };
         setSearch('');
         setDraftFilters(nextFilters);
         setAppliedFilters(nextFilters);
        },
       },
      ]
    : []),
   ...(shooter
    ? [
       {
        key: `preset-${shooter.slug}`,
        label: t(`genres.${shooter.slug}`, { defaultValue: shooter.name }),
        onPress: () => {
         const nextFilters = { genre: shooter.externalId };
         setSearch('');
         setDraftFilters(nextFilters);
         setAppliedFilters(nextFilters);
        },
       },
      ]
    : []),
  ];
 }, [genres, t]);

 const scrollDiscoveryToTop = useCallback(() => {
  flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
 }, []);

 useEffect(() => {
  const signature = JSON.stringify(routeDiscoveryFilters);
  if (signature === lastRouteFilterSignatureRef.current) {
   return;
  }

  const hasRouteFilters = Object.values(routeDiscoveryFilters).some((value) => value !== undefined);
  if (!hasRouteFilters) {
   return;
  }

  lastRouteFilterSignatureRef.current = signature;
  setSearch('');
  setDraftFilters(routeDiscoveryFilters);
  setAppliedFilters(routeDiscoveryFilters);
  setSelectedOrdering(null);
  scrollDiscoveryToTop();
 }, [
  routeDiscoveryFilters,
  scrollDiscoveryToTop,
 ]);
 useEffect(() => {
  if (!isDiscoveryMode) {
   setSelectedOrdering(null);
  }
 }, [isDiscoveryMode]);
 const sortOptions = useMemo(() => {
  const options: Array<{
   key: 'relevance' | '-rating' | '-released' | '-added';
   label: string;
  }> = [];

  if (debouncedSearch.trim().length > 0) {
   options.push({ key: 'relevance', label: t('home.sortRelevance') });
  }

  options.push(
   { key: '-rating', label: t('home.sortTopRated') },
   { key: '-released', label: t('home.sortNewest') },
   { key: '-added', label: t('home.sortPopular') },
  );

  return options;
 }, [debouncedSearch, t]);
 const homeSections: HomeSection[] = [
  {
   key: 'trending',
   title: t('home.trendingNow'),
   games: trendingGames,
   query: trendingQuery,
  },
  {
   key: 'new',
   title: t('home.newGames'),
   games: newGames,
   query: newGamesQuery,
  },
  {
   key: 'upcoming',
   title: t('home.upcomingGames'),
   games: upcomingGames,
   query: upcomingGamesQuery,
  },
  {
   key: 'best-of-year',
   title: t('home.bestOfYear'),
   games: bestOfYearGames,
   query: bestOfYearQuery,
  },
  {
   key: 'classics',
   title: t('home.classicMustPlays'),
   games: classicGames,
   query: classicsQuery,
  },
  {
   key: 'all-time-top-250',
   title: t('home.allTimeTop250'),
   games: allTimeTopGames,
   query: allTimeTopQuery,
  },
  {
   key: 'indie-watchlist',
   title: t('home.indieWatchlist'),
   games: indieWatchGames,
   query: indieWatchQuery,
  },
  {
   key: 'coop-games',
   title: t('home.localCoopGames'),
   games: coopGames,
   query: coopGamesQuery,
  },
 ];

 const handleEndReached = useCallback(() => {
  if (hasNextPage && !isFetchingNextPage) {
   fetchNextPage();
  }
 }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

 const handleGamePress = useCallback(
  (game: CatalogGame) => {
   const nextId = Number(game.gameId ?? game.externalId);
   if (!Number.isFinite(nextId)) return;
   router.push({ pathname: '/game/[id]', params: { id: nextId } });
  },
  [router],
 );

 const handleGameLongPress = useCallback((game: CatalogGame) => {
  setSheetGame(game);
 }, []);

 const renderItem = useCallback(
  ({ item }: { item: CatalogGame }) => (
   <GameCard
    game={item}
     width={cardWidth}
    onPress={handleGamePress}
    onLongPress={handleGameLongPress}
   />
  ),
  [cardWidth, handleGamePress, handleGameLongPress],
 );

 const keyExtractor = useCallback((item: CatalogGame) => item.id, []);

 const ListFooter = useMemo(() => {
  if (!isFetchingNextPage) return null;
  return (
   <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
    <LoadingSpinner size="small" />
   </View>
  );
 }, [isFetchingNextPage]);

 const isInitialLoading = isFetching && games.length === 0;
 const isSectionsLoading = homeSections.every(
  ({ query, games }) => query.isFetching && games.length === 0,
 );
 const areAllSectionsError = homeSections.every(({ query }) => query.isError);

 // â”€â”€â”€ Animated header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

 const scrollY = useSharedValue(0);
 const scrollHandler = useAnimatedScrollHandler((e) => {
  scrollY.value = e.contentOffset.y;
 });

 const fabThreshold = screenHeight * 3;

 const fabVisible = useDerivedValue(() => scrollY.value > fabThreshold);

 const fabStyle = useAnimatedStyle(() => ({
  opacity: withTiming(fabVisible.value ? 1 : 0, { duration: 200 }),
  transform: [{ scale: withSpring(fabVisible.value ? 1 : 0.6, { damping: 15, stiffness: 180 }) }],
 }));

 function handleOpenFilters() {
  setDraftFilters(appliedFilters);
  setIsFilterSheetOpen(true);
 }

function handleApplyFilters() {
 setAppliedFilters(draftFilters);
 setIsFilterSheetOpen(false);
 scrollDiscoveryToTop();
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
 setSelectedOrdering(null);
  lastRouteFilterSignatureRef.current = null;
  router.replace('/');
 scrollDiscoveryToTop();
}

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <View
    style={{
     paddingHorizontal: HORIZONTAL_PADDING,
     paddingTop: spacing.lg,
     paddingBottom: spacing.sm,
     gap: spacing.sm,
    }}
   >
    <View>
     <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs }}>
      <Text
       style={{
        fontFamily: typography.font.bold,
        fontSize: typography.size['2xl'],
        color: colors.text.primary,
        letterSpacing: -0.8,
       }}
      >
       QuestSave<Text style={{ color: colors.primary.DEFAULT }}>+</Text>
      </Text>
      <Text
       style={{
        fontFamily: typography.font.mono,
        fontSize: typography.size.xs,
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wide,
       }}
      >
       v{appVersion}
      </Text>
     </View>
     {isDiscoveryMode && games.length > 0 && (
      <Text
       style={{
        fontFamily: typography.font.regular,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginTop: 2,
       }}
      >
       {t('home.gamesFound', { count: games.length })}
      </Text>
     )}
     {discoveryContextLabel ? (
      <Text
       style={{
        fontFamily: typography.font.medium,
        fontSize: typography.size.sm,
        color: colors.primary['200'],
        marginTop: 2,
       }}
      >
       {discoveryContextLabel}
      </Text>
     ) : null}
    </View>

    <SearchFilterToolbar
     value={search}
     onChangeText={setSearch}
     onClear={() => setSearch('')}
     placeholder={t('home.searchPlaceholder')}
     isLoading={isFetching && !isFetchingNextPage && (search.length > 0 || hasActiveFilters)}
     onFilterPress={handleOpenFilters}
     filterAccessibilityLabel={t('home.filtersButton')}
     activeCount={
      Number(Boolean(appliedFilters.genre)) +
      Number(Boolean(appliedFilters.platform)) +
      Number(Boolean(appliedFilters.developer)) +
      Number(Boolean(appliedFilters.publisher))
     }
     isFilterActive={hasActiveFilters || isFilterSheetOpen}
    />

    <AppliedGameFiltersRow filters={activeFilters} />

    {!isDiscoveryMode ? (
     <QuickDiscoveryPresetsRow
      title={t('home.quickDiscoveryTitle')}
      presets={quickDiscoveryPresets}
     />
    ) : null}
   </View>

   {isDiscoveryMode && isError ? (
    <RetryState
     message={t('auth.errors.generic')}
     actionLabel={t('home.errorRetry')}
     onRetry={() => refetch()}
    />
   ) : isDiscoveryMode && isInitialLoading ? (
    <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: spacing.sm }}>
     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: COLUMN_GAP }}>
      {Array.from({ length: 6 }).map((_, i) => (
       // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid, no reordering
       <GameCardSkeleton key={i} width={cardWidth} />
      ))}
     </View>
    </View>
   ) : isDiscoveryMode && games.length === 0 ? (
    <EmptyState
     icon="gamepad"
     title={discoveryEmptyState.title}
     subtitle={discoveryEmptyState.subtitle}
     action={
      hasActiveFilters
       ? {
          label: t('home.clearFilters'),
          onPress: handleResetFilters,
         }
       : undefined
     }
    />
   ) : isDiscoveryMode ? (
    <Animated.FlatList
     ref={flatListRef as never}
     onScroll={scrollHandler}
     scrollEventThrottle={16}
     data={games}
     renderItem={renderItem}
     keyExtractor={keyExtractor}
     numColumns={NUM_COLUMNS}
     onEndReached={handleEndReached}
     onEndReachedThreshold={0.4}
     ListHeaderComponent={
      <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
       {discoveryContextCard ? (
        <View style={{ marginBottom: spacing.md }}>
         <DiscoveryContextCard
          eyebrow={discoveryOriginLabel ?? undefined}
          title={discoveryContextCard.title}
          subtitle={discoveryContextCard.subtitle}
          icon={discoveryContextCard.icon}
          clearLabel={t('home.clearFilters')}
          onClear={handleResetFilters}
         />
        </View>
       ) : null}

       <DiscoverySortBar
        options={sortOptions}
        selectedKey={activeOrdering}
        onSelect={(key) => {
         setSelectedOrdering(key as 'relevance' | '-rating' | '-released' | '-added');
         scrollDiscoveryToTop();
        }}
       />
      </View>
     }
     ListFooterComponent={ListFooter}
     contentContainerStyle={{
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacing.sm,
      paddingBottom: 80,
      gap: COLUMN_GAP,
     }}
     columnWrapperStyle={{ gap: COLUMN_GAP }}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
     keyboardDismissMode="on-drag"
     style={{ flex: 1 }}
    />
   ) : areAllSectionsError ? (
    <RetryState
     message={t('auth.errors.generic')}
     actionLabel={t('home.errorRetry')}
     onRetry={() => {
      homeSections.forEach(({ query }) => {
       void query.refetch();
      });
     }}
    />
   ) : isSectionsLoading ? (
    <View style={{ paddingTop: spacing.sm }}>
     {homeSections.map((section) => (
      <GameCarouselSection
       key={section.key}
       title={section.title}
       games={[]}
       cardWidth={carouselCardWidth}
       isLoading
       onPress={handleGamePress}
       onLongPress={handleGameLongPress}
      />
     ))}
    </View>
   ) : (
    <Animated.ScrollView
     onScroll={scrollHandler}
     scrollEventThrottle={16}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
     keyboardDismissMode="on-drag"
     contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 96 }}
     style={{ flex: 1 }}
    >
     <RecentlyAddedRow />
     {homeSections.map((section) => (
      <GameCarouselSection
       key={section.key}
       title={section.title}
       games={section.games}
       cardWidth={carouselCardWidth}
       isLoading={section.query.isFetching && section.games.length === 0}
       isFetchingNextPage={section.query.isFetchingNextPage}
       hasNextPage={section.query.hasNextPage}
       isError={section.query.isError}
       errorText={t('auth.errors.generic')}
       retryLabel={t('home.errorRetry')}
       onEndReached={() => void section.query.fetchNextPage()}
       onRetry={() => void section.query.refetch()}
       onPress={handleGamePress}
       onLongPress={handleGameLongPress}
      />
     ))}
    </Animated.ScrollView>
   )}

   {/* Scroll-to-top FAB */}
   <Animated.View
    style={[
     fabStyle,
     {
      position: 'absolute',
      bottom: 96,
      right: HORIZONTAL_PADDING,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
     },
    ]}
   >
    <Pressable
     onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
     accessibilityRole="button"
     accessibilityLabel="Torna in cima"
     hitSlop={8}
     style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
    >
     <FontAwesome5 name="arrow-up" size={16} color="#fff" solid />
    </Pressable>
   </Animated.View>

   {sheetGame ? (
    <GameDetailSheet game={sheetGame} isOpen onClose={() => setSheetGame(null)} />
   ) : null}

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
  </SafeAreaView>
 );
}
