import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';
import type { JsonObject } from '@/shared/models/JsonValue.model';

export type CatalogPage<TItem> = {
 items: TItem[];
 total: number;
 page: number;
 pageSize: number;
 nextPage?: number;
 previousPage?: number;
 providerId: CatalogProviderId;
 metadata?: JsonObject;
};
