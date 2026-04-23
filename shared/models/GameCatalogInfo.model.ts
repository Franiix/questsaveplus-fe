import type { GameCatalogLabel } from './GameCatalogLabel.model';
import type { GameCatalogLanguageSupportRow } from './GameCatalogLanguageSupportRow.model';

export type GameCatalogAgeRating = {
 key: string;
 system: string;
 rating: string;
};

export type GameCatalogInfo = {
 gameModes: GameCatalogLabel[];
 playerPerspectives: GameCatalogLabel[];
 themes: GameCatalogLabel[];
 franchise: string | null;
 collection: string | null;
 alternativeNames: string[];
 releaseDates: string[];
 ageRatingItems: GameCatalogAgeRating[];
 typeValue: GameCatalogLabel | null;
 engines: string[];
 parentGame: string | null;
 multiplayer: GameCatalogLabel[];
 languageSupportRows: GameCatalogLanguageSupportRow[];
 websites: string[];
};

export type { GameCatalogLanguageSupportRow } from './GameCatalogLanguageSupportRow.model';
export type { GameCatalogLinkItem } from './GameCatalogLinkItem.model';
export type { GameCatalogReleaseDateItem } from './GameCatalogReleaseDateItem.model';
