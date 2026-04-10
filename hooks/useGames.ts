import { useInfiniteQuery } from '@tanstack/react-query';
import { searchCatalogGames } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';
import type { CatalogPage, CatalogGame } from '@/shared/models/Catalog.model';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';

type UseGamesParams = {
 search: string;
 filters?: GameDiscoveryFilters;
 ordering?: string;
};

export function useGames({ search, filters, ordering }: UseGamesParams) {
 const catalogSignature = getCatalogQuerySignature();
 const trimmedSearch = search.trim();
 const genre = filters?.genre;
 const platform = filters?.platform;
 const developer = filters?.developer;
 const publisher = filters?.publisher;
 const hasActiveFilters =
  Boolean(genre) ||
  Boolean(platform) ||
  Boolean(developer) ||
  Boolean(publisher);

 return useInfiniteQuery<CatalogPage<CatalogGame>>({
  queryKey: [
   'games',
   catalogSignature,
   {
    search: trimmedSearch,
    genre,
    platform,
    developer,
    publisher,
    ordering,
   },
  ],
  queryFn: ({ pageParam }) =>
    searchCatalogGames({
     page: typeof pageParam === 'number' ? pageParam : 1,
     search: trimmedSearch || undefined,
     genres: genre || undefined,
     platforms: platform || undefined,
     developers: developer || undefined,
     publishers: publisher || undefined,
    ordering: ordering ?? (trimmedSearch ? undefined : hasActiveFilters ? '-rating' : '-added'),
   }),
  getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  initialPageParam: 1,
  staleTime: 5 * 60 * 1000,
 });
}
