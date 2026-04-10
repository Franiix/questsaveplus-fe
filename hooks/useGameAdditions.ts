import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import type { CatalogGame } from '@/shared/models/Catalog.model';

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

function getCatalogGameNumericId(game: CatalogGame) {
 if (typeof game.gameId === 'number' && Number.isFinite(game.gameId)) {
  return game.gameId;
 }

 const externalId = Number(game.externalId);
 return Number.isFinite(externalId) ? externalId : null;
}
