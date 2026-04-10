import type { CatalogImage } from '@/shared/models/CatalogImage.model';
import type { CatalogGame } from '@/shared/models/CatalogGame.model';
import type { GameReleaseReadiness } from '@/shared/models/GameReleaseReadiness.model';
import type {
 CatalogCompany,
 CatalogNamedItem,
 CatalogPlatform,
} from '@/shared/models/CatalogNamedItem.model';

export type CatalogGameDetail = CatalogGame & {
 summary: string | null;
 website: string | null;
 parentPlatforms: CatalogPlatform[];
 developers: CatalogCompany[];
 publishers: CatalogCompany[];
 tags: CatalogNamedItem[];
 images: CatalogImage[];
 follows: number | null;
 hypes: number | null;
 versionTitle: string | null;
 parentGameName: string | null;
 versionParentName: string | null;
 versionFamilyCount: number | null;
 franchises: string[];
 collections: string[];
 releaseReadiness: GameReleaseReadiness | null;
};
