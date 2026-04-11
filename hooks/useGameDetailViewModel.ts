import { useMemo } from 'react';
import type { TFunction } from 'i18next';
import {
 getCatalogGameCategoryTranslationKey,
 getGameCatalogFranchiseName,
 getGameCatalogOverviewText,
 getGameCatalogPrimaryReleaseDate,
 getGameCatalogRatings,
 getGameCatalogReleaseStatusLabel,
 getGameCatalogStoryline,
 getGameEditorialAudience,
 getGameEditorialPlacement,
 getGameEditorialPlaystyle,
 getGameEditorialReleaseReadiness,
 getGameEditorialSeriesNeighbors,
 hasGameCatalogInfoContent,
 hasGameCatalogMedia,
} from '@/shared/utils/gameCatalog';
import type { CatalogGame, CatalogGameDetail } from '@/shared/models/Catalog.model';
import { colors } from '@/shared/theme/tokens';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';
import { formatDate } from '@/shared/utils/date';

const DLC_CATEGORY_KEYS = new Set(['dlc_addon']);
const EXPANSION_CATEGORY_KEYS = new Set(['expansion', 'standalone_expansion']);
const EDITION_CATEGORY_KEYS = new Set(['bundle', 'pack', 'expanded_game']);

type StatusOption = {
 label: string;
 value: string;
};

type UseGameDetailViewModelParams = {
 additions: CatalogGame[];
 communityRating: {
  averageRating: number | null;
  ratingsCount: number;
 } | null;
 developerGames: CatalogGame[];
 game: CatalogGameDetail | null;
 gameId: number;
 gameSeries: CatalogGame[];
 isCommunityRatingLoading: boolean;
 isInBacklog: boolean;
 publisherGames: CatalogGame[];
 selectedStatus: string | null;
 similarGamesRaw: CatalogGame[];
 statusOptions: readonly StatusOption[];
 t: TFunction;
 language: string;
};

export function useGameDetailViewModel({
 additions,
 communityRating,
 developerGames,
 game,
 gameId,
 gameSeries,
 isCommunityRatingLoading,
 isInBacklog,
 language,
 publisherGames,
 selectedStatus,
 similarGamesRaw,
 statusOptions,
 t,
}: UseGameDetailViewModelParams) {
 return useMemo(() => {
  if (!game) {
   return null;
  }

  const igdbRaw = game.metadata?.raw ?? null;
  const sameSeriesGames = gameSeries.filter((seriesGame) => getCatalogGameNumericId(seriesGame) !== gameId);
  const dlcGames = additions.filter((item) => {
   const key = getCatalogGameCategoryTranslationKey(item);
   return key ? DLC_CATEGORY_KEYS.has(key) : false;
  });
  const editionGames = additions.filter((item) => {
   const key = getCatalogGameCategoryTranslationKey(item);
   return key ? EDITION_CATEGORY_KEYS.has(key) : false;
  });
  const expansionGames = additions.filter((item) => {
   const key = getCatalogGameCategoryTranslationKey(item);
   return key ? EXPANSION_CATEGORY_KEYS.has(key) : false;
  });
  const moreFromDeveloper = developerGames;
  const moreFromPublisher = publisherGames;
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
  const similarGames = similarGamesRaw.filter((item) => {
   const relatedId = getCatalogGameNumericId(item);
   return relatedId !== null && !excludedIds.has(relatedId);
  });
  const genres = game.genres
   .map((genre) => t(`genres.${genre.slug}`, { defaultValue: genre.name }))
   .join(', ');
  const developerName = game.developers[0]?.name ?? null;
  const publisherName = game.publishers[0]?.name ?? null;
  const releaseDate =
   getGameCatalogPrimaryReleaseDate(igdbRaw, language) ??
   (game.releasedAt
    ? formatDate(game.releasedAt, language, { day: 'numeric', month: 'long', year: 'numeric' })
    : null);
  const releaseYear = game.releasedAt
   ? new Date(game.releasedAt).getFullYear().toString()
   : typeof (igdbRaw as { first_release_date?: number | null } | null)?.first_release_date === 'number'
    ? new Date((igdbRaw as { first_release_date: number }).first_release_date * 1000)
       .getFullYear()
       .toString()
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
   totalRating: igdbCommunityRating,
   totalRatingCount: igdbVotesCount,
  } = getGameCatalogRatings(igdbRaw);
  const backlogStatusLabel =
   isInBacklog && selectedStatus
    ? sanitizeBacklogStatusLabel(
       statusOptions.find((option) => option.value === selectedStatus)?.label ?? '',
      )
    : null;
  const backlogStatusColor = isInBacklog ? getBacklogStatusColor(selectedStatus) : null;
  const catalogLocale = language.startsWith('it') ? 'it' : 'en';
  const howItPlays = getGameEditorialPlaystyle(igdbRaw, t, catalogLocale);
  const seriesNeighbors = getGameEditorialSeriesNeighbors(game, sameSeriesGames);
  const whereItFitsBase = getGameEditorialPlacement(game, t, sameSeriesGames);
  const whoItsFor = getGameEditorialAudience(game, igdbRaw, t);
  const releaseReadiness = getGameEditorialReleaseReadiness(game, t, language);
  const hasCatalogMediaSection = game.providerId === 'igdb' && hasGameCatalogMedia(igdbRaw);
  const hasCatalogInfoSection = game.providerId === 'igdb' && hasGameCatalogInfoContent(igdbRaw);

  return {
   backlogStatusColor,
   backlogStatusLabel,
   criticRating,
   criticRatingCount,
   developerName,
   dlcGames,
   editionGames,
   expansionGames,
   franchiseName,
   gameTypeLabel,
   genres,
   hasCatalogInfoSection,
   hasCatalogMediaSection,
   howItPlays,
   igdbCommunityRating,
   igdbRaw,
   igdbVotesCount,
   isCommunityRatingLoading,
   moreFromDeveloper,
   moreFromDeveloperTitle: t('gameDetail.moreFromDeveloper', {
    name: developerName ?? t('gameDetail.developer'),
   }),
   moreFromPublisher,
   moreFromPublisherTitle: t('gameDetail.moreFromPublisher', {
    name: publisherName ?? t('gameDetail.publisher'),
   }),
   overviewText,
   publisherName,
   questSaveRating: communityRating?.averageRating ?? null,
   questSaveRatingCount: communityRating?.ratingsCount ?? 0,
   releaseDate,
   releaseReadiness,
   releaseStatusLabel,
   releaseYear,
   sameSeriesGames,
   seriesNeighbors,
   seriesTitle: franchiseName
    ? t('gameDetail.seriesTitle', {
       name: franchiseName,
       defaultValue: `Serie ${franchiseName}`,
      })
    : t('gameDetail.otherSeriesGames'),
   similarGames,
   storylineText,
   whereItFitsBase,
   whoItsFor,
  } as const;
 }, [
  additions,
  communityRating?.averageRating,
  communityRating?.ratingsCount,
  developerGames,
  game,
  gameId,
  gameSeries,
  isCommunityRatingLoading,
  isInBacklog,
  language,
  publisherGames,
  selectedStatus,
  similarGamesRaw,
  statusOptions,
  t,
 ]);
}

function sanitizeBacklogStatusLabel(label: string) {
 return label.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function getBacklogStatusColor(status: string | null) {
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
