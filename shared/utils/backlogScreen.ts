import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { BacklogMetadataMap } from '@/shared/models/backlog/BacklogMetadataMap.model';
import type { BacklogScreenViewModel } from '@/shared/models/backlog/BacklogScreenViewModel.model';

type CreateBacklogScreenViewModelParams = {
 activeFilter: BacklogStatusEnum | null;
 appliedFilters: GameDiscoveryFilters;
 backlogItems: BacklogItemEntity[];
 backlogMetadata?: BacklogMetadataMap;
 search: string;
};

function hasDiscoveryFilters(filters: GameDiscoveryFilters) {
 return (
  Boolean(filters.genre) ||
  Boolean(filters.platform) ||
  Boolean(filters.developer) ||
  Boolean(filters.publisher)
 );
}

function countActiveDiscoveryFilters(filters: GameDiscoveryFilters) {
 return (
  Number(Boolean(filters.genre)) +
  Number(Boolean(filters.platform)) +
  Number(Boolean(filters.developer)) +
  Number(Boolean(filters.publisher))
 );
}

function matchesMetadataFilter(
 selectedValue: string | undefined,
 values: string[] | undefined,
) {
 return !selectedValue || (values ?? []).includes(selectedValue);
}

export function createEmptyGameDiscoveryFilters(): GameDiscoveryFilters {
 return {
  genre: undefined,
  platform: undefined,
  developer: undefined,
  publisher: undefined,
 };
}

export function shouldLoadBacklogMetadata(filters: GameDiscoveryFilters) {
 return hasDiscoveryFilters(filters);
}

export function createBacklogScreenViewModel({
 activeFilter,
 appliedFilters,
 backlogItems,
 backlogMetadata,
 search,
}: CreateBacklogScreenViewModelParams): BacklogScreenViewModel {
 const normalizedSearch = search.trim().toLowerCase();
 const hasAppliedFilters =
  Boolean(activeFilter) ||
  normalizedSearch.length > 0 ||
  hasDiscoveryFilters(appliedFilters);

 const filteredItems = backlogItems.filter((item) => {
  const matchesStatus = !activeFilter || item.status === activeFilter;
  const matchesSearch =
   normalizedSearch.length === 0 || item.game_name.toLowerCase().includes(normalizedSearch);
  const metadata = backlogMetadata?.get(item.game_id);
  const matchesGenre = matchesMetadataFilter(appliedFilters.genre, metadata?.genres);
  const matchesPlatform = matchesMetadataFilter(appliedFilters.platform, metadata?.platforms);
  const matchesDeveloper = matchesMetadataFilter(appliedFilters.developer, metadata?.developers);
  const matchesPublisher = matchesMetadataFilter(appliedFilters.publisher, metadata?.publishers);

  return (
   matchesStatus &&
   matchesSearch &&
   matchesGenre &&
   matchesPlatform &&
   matchesDeveloper &&
   matchesPublisher
  );
 });

 return {
  activeFilterCount: countActiveDiscoveryFilters(appliedFilters),
  filteredItems,
  hasAppliedFilters,
 };
}
