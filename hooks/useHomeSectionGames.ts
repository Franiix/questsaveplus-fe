import { useInfiniteQuery } from '@tanstack/react-query';
import { searchCatalogGames } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';
import type { CatalogGame, CatalogPage } from '@/shared/models/Catalog.model';

type HomeSectionParams = {
 queryKey: string;
 dates: string;
 ordering: string;
 enabled?: boolean;
 genres?: string;
 tags?: string;
 categories?: string;
 gameModes?: string;
 minRatingCount?: number;
 coop?: boolean;
 pageSize?: number;
 maxPages?: number;
};

export function useHomeSectionGames({
 queryKey,
 dates,
 ordering,
 enabled = true,
 genres,
 tags,
 categories,
 gameModes,
 minRatingCount,
 coop,
 pageSize = 10,
 maxPages,
}: HomeSectionParams) {
 const catalogSignature = getCatalogQuerySignature();
 return useInfiniteQuery<CatalogPage<CatalogGame>>({
  queryKey: [
   'home-section-games',
   catalogSignature,
   queryKey,
   dates,
   ordering,
   genres,
   tags,
   categories,
   gameModes,
   minRatingCount,
   coop,
   pageSize,
  ],
  queryFn: ({ pageParam }) =>
   searchCatalogGames({
    page: typeof pageParam === 'number' ? pageParam : 1,
    pageSize,
    ordering,
    dates,
    genres,
    tags,
    categories,
    gameModes,
    minRatingCount,
    coop,
   }),
  getNextPageParam: (lastPage) => {
   const nextPage = lastPage.nextPage;
   if (!nextPage) return undefined;
   if (maxPages && nextPage > maxPages) return undefined;
   return nextPage;
  },
  initialPageParam: 1,
  staleTime: 5 * 60 * 1000,
  enabled,
 });
}
