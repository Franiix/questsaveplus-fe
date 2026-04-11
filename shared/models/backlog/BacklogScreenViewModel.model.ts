import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';

export type BacklogScreenViewModel = {
 activeFilterCount: number;
 filteredItems: BacklogItemEntity[];
 hasAppliedFilters: boolean;
};
