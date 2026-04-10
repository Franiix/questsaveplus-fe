import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';
import type { CatalogNamedItemMetadata } from '@/shared/models/CatalogNamedItemMetadata.model';

export type CatalogNamedItem = {
 id: string;
 providerId: CatalogProviderId;
 externalId: string;
 name: string;
 slug?: string | null;
 domain?: string | null;
 metadata?: CatalogNamedItemMetadata;
};

export type CatalogPlatform = CatalogNamedItem;
export type CatalogGenre = CatalogNamedItem;
export type CatalogCompany = CatalogNamedItem;
