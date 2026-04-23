import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogGenres } from '@/hooks/useCatalogGenres';
import { useDeferredHomeSectionsGate } from '@/hooks/useDeferredHomeSectionsGate';
import { useHomeSectionGames } from '@/hooks/useHomeSectionGames';
import type { HomeSectionViewModel } from '@/shared/models/home/HomeSectionViewModel.model';
import {
 createHomeSectionViewModel,
 formatHomeEditorialDate,
 getGenreExternalIdBySlug,
 sortGamesByEditorialScore,
} from '@/shared/utils/homeEditorial';

export function useHomeEditorialSections() {
 const { t } = useTranslation();
 const { data: genres = [] } = useCatalogGenres();
 const deferredSectionsEnabled = useDeferredHomeSectionsGate();
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
 const indieGenreId = useMemo(() => getGenreExternalIdBySlug(genres, 'indie'), [genres]);

 const trendingQuery = useHomeSectionGames({
  queryKey: 'trending',
  dates: `${formatHomeEditorialDate(threeMonthsAgo)},${formatHomeEditorialDate(today)}`,
  ordering: '-added',
  enabled: true,
 });
 const newGamesQuery = useHomeSectionGames({
  queryKey: 'new',
  dates: `${formatHomeEditorialDate(startOfYear)},${formatHomeEditorialDate(today)}`,
  ordering: '-released',
  enabled: true,
 });
 const upcomingGamesQuery = useHomeSectionGames({
  queryKey: 'upcoming',
  dates: `${formatHomeEditorialDate(tomorrow)},${formatHomeEditorialDate(endOfYear)}`,
  ordering: 'released',
  enabled: true,
 });
 const bestOfYearQuery = useHomeSectionGames({
  queryKey: 'best-of-year',
  dates: `${formatHomeEditorialDate(startOfYear)},${formatHomeEditorialDate(today)}`,
  ordering: '-added',
  enabled: deferredSectionsEnabled,
 });
 const allTimeTopQuery = useHomeSectionGames({
  queryKey: 'all-time-top-250',
  dates: `1980-01-01,${formatHomeEditorialDate(today)}`,
  ordering: '-added',
  enabled: deferredSectionsEnabled,
  pageSize: 50,
  maxPages: 5,
 });
 const classicsQuery = useHomeSectionGames({
  queryKey: 'classics',
  dates: `${formatHomeEditorialDate(classicStartDate)},${formatHomeEditorialDate(classicEndDate)}`,
  ordering: '-added',
  enabled: deferredSectionsEnabled,
  pageSize: 30,
 });
 const indieWatchQuery = useHomeSectionGames({
  queryKey: 'indie-watchlist',
  dates: `${formatHomeEditorialDate(startOfYear)},${formatHomeEditorialDate(nextYearEnd)}`,
  ordering: '-added',
  enabled: deferredSectionsEnabled,
  genres: indieGenreId,
 });
 const coopGamesQuery = useHomeSectionGames({
  queryKey: 'local-coop-games',
  dates: `2000-01-01,${formatHomeEditorialDate(today)}`,
  ordering: '-added',
  enabled: deferredSectionsEnabled,
  gameModes: '4',
 });

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
   sortGamesByEditorialScore(
    (bestOfYearQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
     (game) => (game.ratingsCount ?? 0) >= 25,
    ),
   ),
  [bestOfYearQuery.data],
 );
 const allTimeTopGames = useMemo(
  () =>
   sortGamesByEditorialScore(
    (allTimeTopQuery.data?.pages.flatMap((page) => page.items) ?? []).filter(
     (game) => (game.ratingsCount ?? 0) >= 120,
    ),
   ),
  [allTimeTopQuery.data],
 );
 const classicGames = useMemo(
  () =>
   sortGamesByEditorialScore(
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

 const primarySections = useMemo<HomeSectionViewModel[]>(
  () => [
   createHomeSectionViewModel('trending', t('home.trendingNow'), trendingGames, trendingQuery),
   createHomeSectionViewModel('new', t('home.newGames'), newGames, newGamesQuery),
   createHomeSectionViewModel('upcoming', t('home.upcomingGames'), upcomingGames, upcomingGamesQuery),
  ],
  [newGames, newGamesQuery, t, trendingGames, trendingQuery, upcomingGames, upcomingGamesQuery],
 );

 const deferredSections = useMemo<HomeSectionViewModel[]>(
  () => [
   createHomeSectionViewModel('best-of-year', t('home.bestOfYear'), bestOfYearGames, bestOfYearQuery),
   createHomeSectionViewModel('classics', t('home.classicMustPlays'), classicGames, classicsQuery),
   createHomeSectionViewModel('all-time-top-250', t('home.allTimeTop250'), allTimeTopGames, allTimeTopQuery),
   createHomeSectionViewModel('indie-watchlist', t('home.indieWatchlist'), indieWatchGames, indieWatchQuery),
   createHomeSectionViewModel('coop-games', t('home.localCoopGames'), coopGames, coopGamesQuery),
  ],
  [
   allTimeTopGames,
   allTimeTopQuery,
   bestOfYearGames,
   bestOfYearQuery,
   classicGames,
   classicsQuery,
   coopGames,
   coopGamesQuery,
   indieWatchGames,
   indieWatchQuery,
   t,
  ],
 );

 const homeSections = useMemo<HomeSectionViewModel[]>(
  () => (deferredSectionsEnabled ? [...primarySections, ...deferredSections] : primarySections),
  [deferredSections, deferredSectionsEnabled, primarySections],
 );

 const isSectionsLoading = primarySections.every((section) => section.isLoading);
 const areAllSectionsError = primarySections.every((section) => section.isError);

 return {
  areAllSectionsError,
  deferredSectionsEnabled,
  homeSections,
  isSectionsLoading,
 } as const;
}
