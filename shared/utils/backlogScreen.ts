import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { BacklogSortEnum } from '@/shared/enums/BacklogSort.enum';
import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';
import type { BacklogMetadataMap } from '@/shared/models/backlog/BacklogMetadataMap.model';
import type { BacklogScreenViewModel } from '@/shared/models/backlog/BacklogScreenViewModel.model';

const STATUS_ORDER: Record<string, number> = {
 PLAYING: 0,
 ONGOING: 1,
 WANT_TO_PLAY: 2,
 WISHLIST: 3,
 COMPLETED: 4,
 ABANDONED: 5,
};

type CreateBacklogScreenViewModelParams = {
 activeFilter: BacklogStatusEnum | null;
 appliedFilters: GameDiscoveryFilters;
 backlogItems: BacklogItemEntity[];
 backlogMetadata?: BacklogMetadataMap;
 search: string;
 sortOrder?: BacklogSortEnum;
};

const LOWEST_PLAY_NEXT_PRIORITY = Number.MAX_SAFE_INTEGER;

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

export function shouldLoadBacklogMetadata(filters: GameDiscoveryFilters) {
 return hasDiscoveryFilters(filters);
}

function getPlayNextPriority(item: BacklogItemEntity) {
 return typeof item.play_next_priority === 'number'
  ? item.play_next_priority
  : LOWEST_PLAY_NEXT_PRIORITY;
}

function getSortableUpdatedAt(item: BacklogItemEntity) {
 const timestamp = Date.parse(item.updated_at);
 return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getSortableAddedAt(item: BacklogItemEntity) {
 const timestamp = Date.parse(item.added_at);
 return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortItems(items: BacklogItemEntity[], sort: BacklogSortEnum): BacklogItemEntity[] {
 const sorted = [...items];
 switch (sort) {
  case BacklogSortEnum.NEWEST:
   return sorted.sort((a, b) => getSortableAddedAt(b) - getSortableAddedAt(a));
  case BacklogSortEnum.OLDEST:
   return sorted.sort((a, b) => getSortableAddedAt(a) - getSortableAddedAt(b));
  case BacklogSortEnum.TITLE_ASC:
   return sorted.sort((a, b) => a.game_name.localeCompare(b.game_name));
  case BacklogSortEnum.TITLE_DESC:
   return sorted.sort((a, b) => b.game_name.localeCompare(a.game_name));
  case BacklogSortEnum.RATING_DESC:
   return sorted.sort((a, b) => (b.personal_rating ?? -1) - (a.personal_rating ?? -1));
  case BacklogSortEnum.STATUS:
   return sorted.sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99),
   );
  default:
   return sorted;
 }
}

export function getPlayNextItems(backlogItems: BacklogItemEntity[]) {
 return [...backlogItems]
  .filter((item) => item.is_play_next === true)
  .sort((firstItem, secondItem) => {
   const priorityDiff = getPlayNextPriority(firstItem) - getPlayNextPriority(secondItem);
   if (priorityDiff !== 0) return priorityDiff;

   return getSortableUpdatedAt(secondItem) - getSortableUpdatedAt(firstItem);
  });
}

export function createBacklogScreenViewModel({
 activeFilter,
 appliedFilters,
 backlogItems,
 backlogMetadata,
 search,
 sortOrder = BacklogSortEnum.NEWEST,
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
  filteredItems: sortItems(filteredItems, sortOrder),
  hasAppliedFilters,
  playNextItems: getPlayNextItems(backlogItems),
 };
}
