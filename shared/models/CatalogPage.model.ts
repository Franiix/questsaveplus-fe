import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';

export type CatalogPage<TItem> = {
 items: TItem[];
 total: number;
 page: number;
 pageSize: number;
 nextPage?: number;
 previousPage?: number;
 providerId: CatalogProviderId;
 metadata?: Record<string, unknown>;
};
