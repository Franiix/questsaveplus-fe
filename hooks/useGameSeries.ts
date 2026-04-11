import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseGameSeriesParams = {
 gameId: number;
 enabled?: boolean;
};

export function useGameSeries({ gameId, enabled = true }: UseGameSeriesParams) {
 return useQuery({
  queryKey: ['game-series', gameId],
  queryFn: async () => {
   const response = await listCatalogRelatedGames(gameId, 'series');
   return response.items.filter((game) => getCatalogGameNumericId(game) !== gameId);
  },
  enabled: enabled && Number.isFinite(gameId),
 staleTime: 10 * 60 * 1000,
 });
}
