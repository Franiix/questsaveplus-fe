import type { EdgeGameSearchItem } from './EdgeGameSearchItem.model';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import type { GameReleaseReadiness } from '@/shared/models/GameReleaseReadiness.model';

export type EdgeGameDetail = EdgeGameSearchItem & {
 description: string | null;
 developers: string[];
 publishers: string[];
 screenshots: string[];
 websites: string[];
 gameType: string | null;
 follows: number | null;
 hypes: number | null;
 versionTitle: string | null;
 parentGameName: string | null;
 versionParentName: string | null;
 versionFamilyCount: number | null;
 releaseReadiness: GameReleaseReadiness | null;
 franchises: string[];
 collections: string[];
 raw: IgdbRawExtras;
};
