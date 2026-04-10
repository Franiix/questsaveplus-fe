import type { CatalogProviderId } from '@/shared/enums/CatalogProvider.enum';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import type { GameReleaseReadiness } from '@/shared/models/GameReleaseReadiness.model';

export type CatalogGameMetadata = {
 gameId?: number | null;
 summary?: string | null;
 gameType?: string | null;
 releaseStatus?: string | null;
 aggregatedRating?: number | null;
 aggregatedRatingCount?: number | null;
 totalRating?: number | null;
 totalRatingCount?: number | null;
 follows?: number | null;
 hypes?: number | null;
 versionTitle?: string | null;
 parentGameName?: string | null;
 versionParentName?: string | null;
 versionFamilyCount?: number | null;
 franchises?: string[];
 collections?: string[];
 releaseReadiness?: GameReleaseReadiness | null;
 raw?: IgdbRawExtras | null;
 websites?: string[];
 provider?: CatalogProviderId;
};
