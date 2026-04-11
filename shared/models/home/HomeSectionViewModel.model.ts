import type { CatalogGame } from '@/shared/models/Catalog.model';

export type HomeSectionViewModel = {
 games: CatalogGame[];
 hasNextPage: boolean;
 isError: boolean;
 isFetchingNextPage: boolean;
 isLoading: boolean;
 key: string;
 onEndReached: () => void;
 onRetry: () => void;
 title: string;
};
