import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import type { CatalogGame } from '@/shared/models/Catalog.model';

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

function getCatalogGameNumericId(game: CatalogGame) {
 if (typeof game.gameId === 'number' && Number.isFinite(game.gameId)) {
  return game.gameId;
 }

 const externalId = Number(game.externalId);
 return Number.isFinite(externalId) ? externalId : null;
}
