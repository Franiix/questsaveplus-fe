import type { IgdbRelationKind } from '@/shared/consts/IgdbRelationKinds.const';
import type { IgdbAgeRating } from './igdb/IgdbAgeRating.model';
import type { IgdbAlternativeName } from './igdb/IgdbAlternativeName.model';
import type { IgdbExternalGame } from './igdb/IgdbExternalGame.model';
import type { IgdbGameStatus } from './igdb/IgdbGameStatus.model';
import type { IgdbGameType } from './igdb/IgdbGameType.model';
import type { IgdbImage } from './igdb/IgdbImage.model';
import type { IgdbInvolvedCompany } from './igdb/IgdbInvolvedCompany.model';
import type { IgdbLanguageSupport } from './igdb/IgdbLanguageSupport.model';
import type { IgdbMultiplayerMode } from './igdb/IgdbMultiplayerMode.model';
import type { IgdbNamedItem } from './igdb/IgdbNamedItem.model';
import type { IgdbReleaseDate } from './igdb/IgdbReleaseDate.model';
import type { IgdbVideo } from './igdb/IgdbVideo.model';
import type { IgdbWebsite } from './igdb/IgdbWebsite.model';

export type CatalogLocale = 'it' | 'en';

export type { IgdbAgeRating } from './igdb/IgdbAgeRating.model';
export type { IgdbAlternativeName } from './igdb/IgdbAlternativeName.model';
export type { IgdbExternalGame } from './igdb/IgdbExternalGame.model';
export type { IgdbGameStatus } from './igdb/IgdbGameStatus.model';
export type { IgdbGameType } from './igdb/IgdbGameType.model';
export type { IgdbImage } from './igdb/IgdbImage.model';
export type { IgdbInvolvedCompany } from './igdb/IgdbInvolvedCompany.model';
export type {
 IgdbLanguage,
 IgdbLanguageSupport,
 IgdbLanguageSupportType,
} from './igdb/IgdbLanguageSupport.model';
export type { IgdbMultiplayerMode } from './igdb/IgdbMultiplayerMode.model';
export type { IgdbNamedItem } from './igdb/IgdbNamedItem.model';
export type { IgdbReleaseDate } from './igdb/IgdbReleaseDate.model';
export type { IgdbVideo } from './igdb/IgdbVideo.model';
export type { IgdbWebsite } from './igdb/IgdbWebsite.model';

export type IgdbRawExtras = {
 relationKind?: IgdbRelationKind | null;
 game_modes?: IgdbNamedItem[];
 player_perspectives?: IgdbNamedItem[];
 themes?: IgdbNamedItem[];
 game_type?: IgdbGameType | null;
 game_type_id?: number | null;
 game_status?: IgdbGameStatus | null;
 status?: IgdbGameStatus | null;
 franchises?: IgdbNamedItem[];
 franchise_ids?: number[];
 collections?: IgdbNamedItem[];
 collection_ids?: number[];
 franchise?: IgdbNamedItem | null;
 collection?: IgdbNamedItem | null;
 first_release_date?: number;
 aggregated_rating?: number;
 aggregated_rating_count?: number;
 total_rating?: number;
 total_rating_count?: number;
 follows?: number;
 hypes?: number;
 version_title?: string | null;
 alternative_names?: IgdbAlternativeName[];
 storyline?: string | null;
 release_dates?: IgdbReleaseDate[];
 age_ratings?: IgdbAgeRating[];
 category?: number;
 game_engines?: IgdbNamedItem[];
 parent_game?: IgdbNamedItem | null;
 version_parent?: IgdbNamedItem | null;
 multiplayer_modes?: IgdbMultiplayerMode[] | IgdbMultiplayerMode;
 language_supports?: IgdbLanguageSupport[] | IgdbLanguageSupport;
 websites?: IgdbWebsite[];
 external_games?: IgdbExternalGame[];
 screenshots?: IgdbImage[];
 artworks?: IgdbImage[];
 videos?: IgdbVideo[];
 involved_companies?: IgdbInvolvedCompany[];
 genres?: IgdbNamedItem[];
};
