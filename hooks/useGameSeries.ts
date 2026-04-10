import { useQuery } from '@tanstack/react-query';
import { listCatalogRelatedGames } from '@/lib/catalog';
import type { CatalogGame } from '@/shared/models/Catalog.model';

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

function getCatalogGameNumericId(game: CatalogGame) {
 if (typeof game.gameId === 'number' && Number.isFinite(game.gameId)) {
  return game.gameId;
 }

 const externalId = Number(game.externalId);
 return Number.isFinite(externalId) ? externalId : null;
}
