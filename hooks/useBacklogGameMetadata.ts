import { useQuery } from '@tanstack/react-query';
import { getCatalogGameDetail } from '@/lib/catalog';
import type { BacklogGameMetadata } from '@/shared/models/BacklogGameMetadata.model';

export function useBacklogGameMetadata(gameIds: number[], enabled = true) {
 const sortedGameIds = [...gameIds].sort((a, b) => a - b);

 return useQuery({
  queryKey: ['backlog-game-metadata', sortedGameIds],
  queryFn: async () => {
   const results = await Promise.all(
    sortedGameIds.map(async (gameId) => {
     const detail = await getCatalogGameDetail(gameId);
      const metadata: BacklogGameMetadata = {
       gameId,
      genres: detail.genres.map((genre) => genre.externalId).filter(Boolean) as string[],
      platforms: detail.platforms.map((platform) => platform.externalId).filter(Boolean),
      developers: detail.developers.map((developer) => developer.externalId).filter(Boolean) as string[],
      publishers: detail.publishers.map((publisher) => publisher.externalId).filter(Boolean) as string[],
     };
     return metadata;
    }),
   );

   return new Map(results.map((item) => [item.gameId, item]));
  },
  enabled: enabled && sortedGameIds.length > 0,
  staleTime: 30 * 60 * 1000,
 });
}
