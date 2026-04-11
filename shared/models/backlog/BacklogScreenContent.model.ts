import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

export type BacklogStatusLabelMap = Record<BacklogStatusEnum, string>;

export type BacklogStatusColorMap = Record<BacklogStatusEnum, string>;

export type BacklogScreenContentState = {
 activeFilter: BacklogStatusEnum | null;
 error?: string | null;
 filteredItems: BacklogItemEntity[];
 hasAppliedFilters: boolean;
 isReadingList: boolean;
};
