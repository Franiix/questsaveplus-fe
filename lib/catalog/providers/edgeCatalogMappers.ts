import type {
 CatalogCompany,
 CatalogGame,
 CatalogGameDetail,
 CatalogImage,
} from '@/shared/models/Catalog.model';
import type { CatalogGameMetadata } from '@/shared/models/CatalogGameMetadata.model';
import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';
import { getGameCatalogParentPlatformItems } from '@/shared/utils/gameCatalog';
import type {
 EdgeGameDetail,
 EdgeGameSearchItem,
 EdgeSourceProviderId,
} from '@/lib/catalog/contracts/edge';

type EdgeGameMetadataSource = EdgeGameSearchItem & Partial<EdgeGameDetail>;

function createCatalogId(providerId: CatalogProviderId, externalId: string | number) {
 return `${providerId}:${externalId}`;
}

function namedItemsToCatalog(
 providerId: CatalogProviderId,
 values: string[],
 kind: 'genre' | 'platform' | 'company' | 'tag' = 'genre',
) {
 return values.map((value) => ({
  id: createCatalogId(providerId, `${kind}:${value.toLowerCase()}`),
  providerId,
  externalId: value.toLowerCase(),
  name: value,
  slug: value.toLowerCase().replace(/\s+/g, '-'),
 }));
}

function imageToCatalog(url: string | null | undefined, kind: CatalogImage['kind']) {
 if (!url) return null;
 return { url, kind };
}

function createGameMetadata(game: EdgeGameMetadataSource): CatalogGameMetadata {
 return {
  gameId: game.gameId,
  summary: game.summary,
  gameType: game.gameType ?? game.raw?.game_type?.type?.trim() ?? null,
  releaseStatus:
   game.status ??
   game.raw?.game_status?.name?.trim() ??
   game.raw?.status?.status?.trim() ??
   game.raw?.status?.name?.trim() ??
   null,
  aggregatedRating: game.aggregatedRating,
  aggregatedRatingCount: game.aggregatedRatingCount,
  totalRating: game.totalRating,
  totalRatingCount: game.totalRatingCount,
  follows: game.follows ?? game.raw?.follows ?? null,
  hypes: game.hypes ?? game.raw?.hypes ?? null,
  versionTitle: game.versionTitle ?? game.raw?.version_title?.trim() ?? null,
  parentGameName: game.parentGameName ?? game.raw?.parent_game?.name?.trim() ?? null,
  versionParentName: game.versionParentName ?? game.raw?.version_parent?.name?.trim() ?? null,
  versionFamilyCount: game.versionFamilyCount ?? null,
  franchises: game.franchises ?? [],
  collections: game.collections ?? [],
  releaseReadiness: game.releaseReadiness ?? null,
  raw: game.raw ?? null,
 };
}

export function mapEdgeGameToCatalog(game: EdgeGameSearchItem): CatalogGame {
 const providerId = game.provider;

 return {
  id: createCatalogId(providerId, game.providerGameId),
  gameId: game.gameId,
  providerId,
  externalId: String(game.providerGameId),
  name: game.name,
  slug: game.slug,
  releasedAt: game.releasedAt,
  rating: game.rating,
  criticScore: game.aggregatedRating,
  ratingsCount: game.ratingsCount,
  coverImage: imageToCatalog(game.coverUrl, 'cover'),
  backgroundImage: imageToCatalog(game.coverUrl, 'background'),
  genres: namedItemsToCatalog(providerId, game.genres, 'genre'),
  platforms: namedItemsToCatalog(providerId, game.platforms, 'platform'),
  metadata: createGameMetadata(game),
 };
}

export function mapEdgeDetailToCatalog(
 game: EdgeGameDetail,
 metadata?: { provider?: EdgeSourceProviderId },
): CatalogGameDetail {
 const providerId = game.provider;
 const parentPlatforms = getGameCatalogParentPlatformItems(game.platforms).map((platform) => ({
  id: createCatalogId(providerId, `platform-family:${platform.slug}`),
  providerId,
  externalId: platform.slug,
  name: platform.name,
  slug: platform.slug,
 }));

 return {
  ...mapEdgeGameToCatalog(game),
  summary: game.description ?? game.summary,
  website: game.websites[0] ?? null,
  parentPlatforms,
  developers: namedItemsToCatalog(providerId, game.developers, 'company') as CatalogCompany[],
  publishers: namedItemsToCatalog(providerId, game.publishers, 'company') as CatalogCompany[],
  tags: [],
  images: game.screenshots.map((image) => ({
   url: image,
   kind: 'screenshot' as const,
  })),
  follows: game.follows ?? null,
  hypes: game.hypes ?? null,
  versionTitle: game.versionTitle ?? null,
  parentGameName: game.parentGameName ?? null,
  versionParentName: game.versionParentName ?? null,
  versionFamilyCount: game.versionFamilyCount ?? null,
  franchises: game.franchises ?? [],
  collections: game.collections ?? [],
  releaseReadiness: game.releaseReadiness ?? null,
  metadata: {
   ...createGameMetadata(game),
   raw: game.raw,
   websites: game.websites,
   provider: metadata?.provider ?? providerId,
  },
 };
}
