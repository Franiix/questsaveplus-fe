import type {
 EdgeCatalogFunctionConfig,
 EdgeCatalogResponse,
 EdgeDetailResponse,
 EdgeSearchResponse,
} from '@/lib/catalog/contracts/edge';
import { mapEdgeDetailToCatalog, mapEdgeGameToCatalog } from '@/lib/catalog/providers/edgeCatalogMappers';
import { supabase } from '@/lib/supabase';
import type {
 CatalogCompany,
 CatalogGame,
 CatalogGameDetail,
 CatalogGenre,
 CatalogPage,
 CatalogPlatform,
} from '@/shared/models/Catalog.model';
import type { CatalogTaxonomyKind } from '@/shared/enums/CatalogTaxonomyKind.enum';
import type { CatalogSearchParams } from '@/shared/models/CatalogSearchParams.model';

const EDGE_FUNCTIONS: EdgeCatalogFunctionConfig = {
 searchGames: process.env.EXPO_PUBLIC_CATALOG_EDGE_SEARCH_GAMES_FN ?? 'search-games',
 gameDetail: process.env.EXPO_PUBLIC_CATALOG_EDGE_GAME_DETAIL_FN ?? 'get-game-detail',
 gameSeries: process.env.EXPO_PUBLIC_CATALOG_EDGE_GAME_SERIES_FN ?? 'catalog-get-game-series',
 gameAdditions:
  process.env.EXPO_PUBLIC_CATALOG_EDGE_GAME_ADDITIONS_FN ?? 'catalog-get-game-additions',
 gameSimilar: process.env.EXPO_PUBLIC_CATALOG_EDGE_GAME_SIMILAR_FN ?? 'catalog-get-game-similar',
 genres: process.env.EXPO_PUBLIC_CATALOG_EDGE_GENRES_FN ?? 'catalog-list-genres',
 parentPlatforms:
  process.env.EXPO_PUBLIC_CATALOG_EDGE_PARENT_PLATFORMS_FN ?? 'catalog-list-parent-platforms',
 developers: process.env.EXPO_PUBLIC_CATALOG_EDGE_DEVELOPERS_FN ?? 'catalog-list-developers',
 publishers: process.env.EXPO_PUBLIC_CATALOG_EDGE_PUBLISHERS_FN ?? 'catalog-list-publishers',
};

function unwrapEdgeData<TData>(payload: EdgeCatalogResponse<TData> | TData | null): TData | null {
 if (!payload) return null;
 if (typeof payload === 'object') {
  const response = payload as EdgeCatalogResponse<TData>;
  if ('data' in response || 'result' in response) {
   return response.data ?? response.result ?? null;
  }
  return payload as TData;
 }
 return payload;
}

async function invokeEdgeFunction<TData>(
 functionName: string,
 body?: Record<string, unknown>,
): Promise<TData> {
 const { data, error } = await supabase.functions.invoke(functionName, {
  body,
 });

 if (error) {
  throw error;
 }

 const unwrapped = unwrapEdgeData<TData>(data as TData | EdgeCatalogResponse<TData> | null);
 if (unwrapped === null) {
  throw new Error(`Empty catalog response from edge function: ${functionName}`);
 }

 return unwrapped;
}

export async function searchEdgeCatalogGames(params: CatalogSearchParams) {
 const response = await invokeEdgeFunction<EdgeSearchResponse>(EDGE_FUNCTIONS.searchGames, params);
 return {
  items: response.results.map(mapEdgeGameToCatalog),
  total: response.total,
  page: response.page,
  pageSize: response.pageSize,
  nextPage: response.nextPage ?? undefined,
  providerId: response.provider,
 metadata: { provider: response.provider },
 } satisfies CatalogPage<CatalogGame>;
}

export async function getEdgeCatalogGameDetail(gameId: number): Promise<CatalogGameDetail> {
 const response = await invokeEdgeFunction<EdgeDetailResponse>(EDGE_FUNCTIONS.gameDetail, {
  gameId,
 });
 return mapEdgeDetailToCatalog(response.game, {
  provider: response.provider,
 });
}

export function listEdgeCatalogTaxonomy(kind: CatalogTaxonomyKind) {
 const fnByKind: Record<CatalogTaxonomyKind, string> = {
  genres: EDGE_FUNCTIONS.genres,
  'parent-platforms': EDGE_FUNCTIONS.parentPlatforms,
  developers: EDGE_FUNCTIONS.developers,
  publishers: EDGE_FUNCTIONS.publishers,
 };

 return invokeEdgeFunction<CatalogGenre[] | CatalogPlatform[] | CatalogCompany[]>(fnByKind[kind]);
}

export function listEdgeCatalogRelatedGames(gameId: number, relation: 'series' | 'additions' | 'similar') {
 return invokeEdgeFunction<CatalogPage<CatalogGame>>(
  relation === 'series'
   ? EDGE_FUNCTIONS.gameSeries
   : relation === 'similar'
     ? EDGE_FUNCTIONS.gameSimilar
     : EDGE_FUNCTIONS.gameAdditions,
  { gameId },
 );
}
