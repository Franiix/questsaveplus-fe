import type { CatalogGame, CatalogGenre } from '@/shared/models/Catalog.model';
import type { HomeSectionViewModel } from '@/shared/models/home/HomeSectionViewModel.model';

export function formatHomeEditorialDate(date: Date): string {
 return date.toISOString().split('T')[0];
}

export function sortGamesByEditorialScore(games: CatalogGame[]) {
 return [...games].sort((left, right) => {
  const rightRating = right.rating ?? 0;
  const leftRating = left.rating ?? 0;
  if (rightRating !== leftRating) return rightRating - leftRating;

  const rightCount = right.ratingsCount ?? 0;
  const leftCount = left.ratingsCount ?? 0;
  return rightCount - leftCount;
 });
}

export function getGenreExternalIdBySlug(genres: CatalogGenre[], slug: string) {
 return genres.find((genre) => genre.slug === slug)?.externalId;
}

export function createHomeSectionViewModel(
 key: string,
 title: string,
 games: CatalogGame[],
 query: {
  fetchNextPage: () => Promise<object>;
  hasNextPage?: boolean;
  isError: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  refetch: () => Promise<object>;
 },
): HomeSectionViewModel {
 return {
  key,
  title,
  games,
  isLoading: query.isFetching && games.length === 0,
  isFetchingNextPage: query.isFetchingNextPage,
  hasNextPage: Boolean(query.hasNextPage),
  isError: query.isError,
  onEndReached: () => {
   void query.fetchNextPage();
  },
  onRetry: () => {
   void query.refetch();
  },
 };
}
