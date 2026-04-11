import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseGameSimilarParams = {
 gameId: number;
 enabled?: boolean;
};

export function useGameSimilar({ gameId, enabled = true }: UseGameSimilarParams) {
 return useQuery({
  queryKey: ['game-similar', gameId],
  queryFn: async () => {
   const response = await listCatalogRelatedGames(gameId, 'similar');
   return response.items.filter((game) => getCatalogGameNumericId(game) !== gameId);
  },
  enabled: enabled && Number.isFinite(gameId),
 staleTime: 10 * 60 * 1000,
 });
}
