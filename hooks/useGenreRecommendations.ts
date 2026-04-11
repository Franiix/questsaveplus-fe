import { useQuery } from '@tanstack/react-query';
import { searchCatalogGames } from '@/lib/catalog';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseGenreRecommendationsParams = {
 currentGameId: number;
 genreSlug?: string;
 excludeIds?: number[];
 enabled?: boolean;
};

export function useGenreRecommendations({
 currentGameId,
 genreSlug,
 excludeIds = [],
 enabled = true,
}: UseGenreRecommendationsParams) {
 const normalizedExcludeIds = [...excludeIds].sort((a, b) => a - b);

 return useQuery({
  queryKey: ['genre-recommendations', currentGameId, genreSlug, normalizedExcludeIds],
  queryFn: async () => {
   const response = await searchCatalogGames({
    page: 1,
    pageSize: 12,
    ordering: '-rating',
    dates: '1980-01-01,2030-12-31',
    genres: genreSlug,
   });

   return response.items
    .filter((game) => {
     const numericId = getCatalogGameNumericId(game);
     return numericId !== currentGameId && (numericId === null || !normalizedExcludeIds.includes(numericId));
    });
  },
  enabled: enabled && Number.isFinite(currentGameId) && Boolean(genreSlug),
 staleTime: 10 * 60 * 1000,
 });
}
