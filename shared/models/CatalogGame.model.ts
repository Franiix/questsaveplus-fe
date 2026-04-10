import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';
import type { CatalogImage } from '@/shared/models/CatalogImage.model';
import type { CatalogGameMetadata } from '@/shared/models/CatalogGameMetadata.model';
import type {
 CatalogGenre,
 CatalogPlatform,
} from '@/shared/models/CatalogNamedItem.model';

export type CatalogGame = {
 id: string;
 gameId?: number | null;
 providerId: CatalogProviderId;
 externalId: string;
 name: string;
 slug?: string | null;
 releasedAt?: string | null;
 rating?: number | null;
 ratingsCount?: number | null;
 criticScore?: number | null;
 coverImage?: CatalogImage | null;
 backgroundImage?: CatalogImage | null;
 genres: CatalogGenre[];
 platforms: CatalogPlatform[];
 metadata?: CatalogGameMetadata;
};
