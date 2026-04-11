export type BacklogMetadataEntry = {
 developers: string[];
 genres: string[];
 platforms: string[];
 publishers: string[];
};

export type BacklogMetadataMap = Map<number, BacklogMetadataEntry>;
