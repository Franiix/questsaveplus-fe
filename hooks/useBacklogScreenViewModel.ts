import { useMemo } from 'react';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogMetadataMap } from '@/shared/models/backlog/BacklogMetadataMap.model';
import { createBacklogScreenViewModel } from '@/shared/utils/backlogScreen';

type UseBacklogScreenViewModelParams = {
 activeFilter: BacklogStatusEnum | null;
 appliedFilters: GameDiscoveryFilters;
 backlogItems: BacklogItemEntity[];
 backlogMetadata?: BacklogMetadataMap;
 search: string;
 sortOrder?: BacklogSortEnum;
};

export function useBacklogScreenViewModel({
 activeFilter,
 appliedFilters,
 backlogItems,
 backlogMetadata,
 search,
 sortOrder,
}: UseBacklogScreenViewModelParams) {
 return useMemo(
  () =>
   createBacklogScreenViewModel({
    activeFilter,
    appliedFilters,
    backlogItems,
    backlogMetadata,
    search,
    sortOrder,
   }),
  [activeFilter, appliedFilters, backlogItems, backlogMetadata, search, sortOrder],
 );
}
