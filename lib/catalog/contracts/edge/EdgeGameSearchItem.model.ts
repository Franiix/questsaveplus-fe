import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';

export type EdgeSourceProviderId = 'igdb';

export type EdgeGameSearchItem = {
 gameId: number | null;
 provider: EdgeSourceProviderId;
 providerGameId: number;
 slug: string | null;
 name: string;
 coverUrl: string | null;
 releasedAt: string | null;
 rating: number | null;
 aggregatedRating: number | null;
 aggregatedRatingCount: number | null;
 totalRating: number | null;
 totalRatingCount: number | null;
 ratingsCount: number | null;
 status: string | null;
 platforms: string[];
 genres: string[];
 summary: string | null;
 raw?: IgdbRawExtras | null;
};
