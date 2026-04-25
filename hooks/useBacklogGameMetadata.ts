import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getCatalogGameDetail } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';
import type { BacklogGameMetadata } from '@/shared/models/BacklogGameMetadata.model';
import { getGameCatalogReleaseStatusKey } from '@/shared/utils/gameCatalog';

export function useBacklogGameMetadata(gameIds: number[], enabled = true) {
 // biome-ignore lint/correctness/useExhaustiveDependencies: stable string key avoids per-render re-sort when caller creates a new array reference with the same IDs
 const sortedGameIds = useMemo(() => [...gameIds].sort((a, b) => a - b), [gameIds.join(',')]);

 const isEnabled = enabled && sortedGameIds.length > 0;

 const detailQueries = useQueries({
  queries: sortedGameIds.map((gameId) => ({
   queryKey: ['game', gameId] as const,
   queryFn: () => getCatalogGameDetail(gameId),
   staleTime: 10 * 60 * 1000,
   enabled: isEnabled,
  })),
 });

 const { data: questSaveRows } = useQuery({
  queryKey: ['qs-ratings', sortedGameIds],
  queryFn: async () => {
   const { data } = await supabase
    .from('backlog_items')
    .select('game_id, personal_rating')
    .in('game_id', sortedGameIds)
    .not('personal_rating', 'is', null);
   return data ?? [];
  },
  enabled: isEnabled,
  staleTime: 15 * 60 * 1000,
 });

 const data = useMemo(() => {
  const questSaveMap = new Map<number, { sum: number; count: number }>();
  for (const row of questSaveRows ?? []) {
   const entry = questSaveMap.get(row.game_id) ?? { sum: 0, count: 0 };
   entry.sum += row.personal_rating as number;
   entry.count += 1;
   questSaveMap.set(row.game_id, entry);
  }

  const results: BacklogGameMetadata[] = [];
  for (let i = 0; i < sortedGameIds.length; i++) {
   const detail = detailQueries[i]?.data;
   const gameId = sortedGameIds[i] as number;
   if (!detail) continue;
   const qs = questSaveMap.get(gameId);
   results.push({
    gameId,
    genres: detail.genres.map((g) => g.externalId).filter(Boolean) as string[],
    platforms: detail.platforms.map((p) => p.externalId).filter(Boolean),
    developers: detail.developers.map((d) => d.externalId).filter(Boolean) as string[],
    publishers: detail.publishers.map((p) => p.externalId).filter(Boolean) as string[],
    releasedAt: detail.releasedAt ?? null,
    releaseStatusKey: getGameCatalogReleaseStatusKey(detail.metadata?.raw ?? null),
    firstReleaseDate: detail.metadata?.raw?.first_release_date ?? null,
    igdbRating: detail.rating ?? null,
    criticScore: detail.criticScore ?? null,
    questSaveRating: qs ? Math.round((qs.sum / qs.count) * 10) / 10 : null,
   });
  }

  if (results.length === 0) return undefined;
  return new Map(results.map((item) => [item.gameId, item]));
 }, [detailQueries, questSaveRows, sortedGameIds]);

 const loadingGameIds = useMemo(() => {
  const set = new Set<number>();
  for (let i = 0; i < sortedGameIds.length; i++) {
   if (detailQueries[i]?.isLoading) {
    set.add(sortedGameIds[i] as number);
   }
  }
  return set;
 }, [detailQueries, sortedGameIds]);

 return { data, loadingGameIds };
}
