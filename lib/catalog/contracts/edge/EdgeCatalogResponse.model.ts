import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';

export type EdgeCatalogResponse<TData> = {
 data?: TData;
 result?: TData;
 providerId?: CatalogProviderId;
};
