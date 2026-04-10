export type CatalogSearchParams = {
 page: number;
 pageSize?: number;
 search?: string;
 ordering?: string;
 dates?: string;
 genres?: string;
 tags?: string;
 platforms?: string;
 parentPlatforms?: string;
 developers?: string;
 publishers?: string;
 categories?: string;
 gameModes?: string;
 minRatingCount?: number;
 coop?: boolean;
};
