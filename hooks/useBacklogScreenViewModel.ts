import { useMemo } from 'react';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';

type BacklogMetadataMap = Map<
 number,
 {
  developers: string[];
  genres: string[];
  platforms: string[];
  publishers: string[];
 }
>;

type UseBacklogScreenViewModelParams = {
 activeFilter: BacklogStatusEnum | null;
 appliedFilters: GameDiscoveryFilters;
 backlogItems: BacklogItemEntity[];
 backlogMetadata?: BacklogMetadataMap;
 search: string;
};

export function useBacklogScreenViewModel({
 activeFilter,
 appliedFilters,
 backlogItems,
 backlogMetadata,
 search,
}: UseBacklogScreenViewModelParams) {
 return useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();
  const hasAppliedFilters =
   Boolean(activeFilter) ||
   normalizedSearch.length > 0 ||
   Boolean(appliedFilters.genre) ||
   Boolean(appliedFilters.platform) ||
   Boolean(appliedFilters.developer) ||
   Boolean(appliedFilters.publisher);

  const filteredItems = backlogItems.filter((item) => {
   const matchesStatus = !activeFilter || item.status === activeFilter;
   const matchesSearch =
    normalizedSearch.length === 0 || item.game_name.toLowerCase().includes(normalizedSearch);
   const metadata = backlogMetadata?.get(item.game_id);
   const matchesGenre = !appliedFilters.genre || (metadata?.genres ?? []).includes(appliedFilters.genre);
   const matchesPlatform =
    !appliedFilters.platform || (metadata?.platforms ?? []).includes(appliedFilters.platform);
   const matchesDeveloper =
    !appliedFilters.developer || (metadata?.developers ?? []).includes(appliedFilters.developer);
   const matchesPublisher =
    !appliedFilters.publisher || (metadata?.publishers ?? []).includes(appliedFilters.publisher);

   return (
    matchesStatus &&
    matchesSearch &&
    matchesGenre &&
    matchesPlatform &&
    matchesDeveloper &&
    matchesPublisher
   );
  });

  const activeFilterCount =
   Number(Boolean(appliedFilters.genre)) +
   Number(Boolean(appliedFilters.platform)) +
   Number(Boolean(appliedFilters.developer)) +
   Number(Boolean(appliedFilters.publisher));

  return {
   activeFilterCount,
   filteredItems,
   hasAppliedFilters,
  } as const;
 }, [activeFilter, appliedFilters, backlogItems, backlogMetadata, search]);
}
