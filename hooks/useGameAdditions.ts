import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseGameAdditionsParams = {
 gameId: number;
 enabled?: boolean;
};

export function useGameAdditions({ gameId, enabled = true }: UseGameAdditionsParams) {
 return useQuery({
  queryKey: ['game-additions', gameId],
  queryFn: async () => {
   const response = await listCatalogRelatedGames(gameId, 'additions');
   return response.items.filter((game) => getCatalogGameNumericId(game) !== gameId);
  },
  enabled: enabled && Number.isFinite(gameId),
  staleTime: 10 * 60 * 1000,
 });
}
