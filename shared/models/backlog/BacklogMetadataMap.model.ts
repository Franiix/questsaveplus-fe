export type BacklogMetadataEntry = {
 developers: string[];
 genres: string[];
 platforms: string[];
 publishers: string[];
 releasedAt?: string | null;
 releaseStatusKey?: string | null;
 firstReleaseDate?: number | null;
};

export type BacklogMetadataMap = Map<number, BacklogMetadataEntry>;
