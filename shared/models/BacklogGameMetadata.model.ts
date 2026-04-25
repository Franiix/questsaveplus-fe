export type BacklogGameMetadata = {
 gameId: number;
 genres: string[];
 platforms: string[];
 developers: string[];
 publishers: string[];
 releasedAt: string | null;
 releaseStatusKey: string | null;
 firstReleaseDate: number | null;
 igdbRating: number | null;
 criticScore: number | null;
 questSaveRating: number | null;
};
