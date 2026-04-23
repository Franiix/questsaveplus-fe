import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { getCatalogGameDetail } from '@/lib/catalog';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';
import { getGamePrefetchImageUris } from '@/shared/utils/gamePrefetch';

const DETAIL_STALE_TIME_MS = 10 * 60 * 1000;
const prefetchedImageUris = new Set<string>();
const prefetchedGameIds = new Set<number>();

async function prefetchImageUris(uris: string[]) {
 const nextUris = uris.filter((uri) => !prefetchedImageUris.has(uri));

 if (nextUris.length === 0) {
  return;
 }

 nextUris.forEach((uri) => prefetchedImageUris.add(uri));

 try {
  await Image.prefetch(nextUris, 'memory-disk');
 } catch {
  nextUris.forEach((uri) => prefetchedImageUris.delete(uri));
 }
}

export function usePrefetchGameResources() {
 const queryClient = useQueryClient();

 const prefetchGameById = useCallback(
  async (gameId: number, imageUris: string[] = []) => {
   if (!Number.isFinite(gameId) || gameId <= 0) {
    return;
   }

   await prefetchImageUris(imageUris);

   if (prefetchedGameIds.has(gameId) || queryClient.getQueryData(['game', gameId])) {
    prefetchedGameIds.add(gameId);
    return;
   }

   prefetchedGameIds.add(gameId);

   try {
    await queryClient.prefetchQuery({
     queryKey: ['game', gameId],
     queryFn: () => getCatalogGameDetail(gameId),
     staleTime: DETAIL_STALE_TIME_MS,
    });
   } catch {
    prefetchedGameIds.delete(gameId);
   }
  },
  [queryClient],
 );

 const prefetchGame = useCallback(
  async (game: CatalogGame | null | undefined) => {
   const gameId = getCatalogGameNumericId(game ?? null);

   if (gameId === null) {
    return;
   }

   await prefetchGameById(gameId, getGamePrefetchImageUris(game));
  },
  [prefetchGameById],
 );

 const prefetchGames = useCallback(
  async (games: readonly CatalogGame[], limit = games.length) => {
   const candidates = games.slice(0, limit);
   await Promise.all(candidates.map((game) => prefetchGame(game)));
  },
  [prefetchGame],
 );

 return {
  prefetchGame,
  prefetchGames,
  prefetchGameById,
 } as const;
}
