import type { EdgeGameDetail } from './EdgeGameDetail.model';
import type { EdgeGameSearchItem, EdgeSourceProviderId } from './EdgeGameSearchItem.model';

export type EdgeSearchResponse = {
 provider: EdgeSourceProviderId;
 page: number;
 pageSize: number;
 total: number;
 nextPage?: number | null;
 results: EdgeGameSearchItem[];
};

export type EdgeDetailResponse = {
 provider: EdgeSourceProviderId;
 game: EdgeGameDetail;
};
