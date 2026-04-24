import { describe, expect, it } from 'vitest';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { createBacklogScreenViewModel } from '@/shared/utils/backlogScreen';
import { createEmptyGameDiscoveryFilters } from '@/shared/utils/gameDiscoveryFilters';

function createBacklogItem(
 id: string,
 status: BacklogStatusEnum,
 overrides: Partial<BacklogItemEntity> = {},
): BacklogItemEntity {
 return {
  id,
  user_id: 'user-1',
  game_id: Number(id),
  game_name: `Game ${id}`,
  game_cover_url: null,
  status,
  personal_rating: null,
  notes: null,
  platform_played: null,
  added_at: '2026-04-23T00:00:00.000Z',
  updated_at: '2026-04-23T00:00:00.000Z',
  started_at: null,
  completed_at: null,
  abandoned_at: null,
  resumed_at: null,
  ...overrides,
 };
}

describe('backlogScreen utilities', () => {
 it('builds a play next list from pinned items ordered by priority', () => {
  const viewModel = createBacklogScreenViewModel({
   activeFilter: null,
   appliedFilters: createEmptyGameDiscoveryFilters(),
   backlogItems: [
    createBacklogItem('1', BacklogStatusEnum.WANT_TO_PLAY, {
     is_play_next: true,
     play_next_priority: 2,
    }),
    createBacklogItem('2', BacklogStatusEnum.PLAYING),
    createBacklogItem('3', BacklogStatusEnum.COMPLETED, {
     is_play_next: true,
     play_next_priority: 1,
    }),
   ],
   search: '',
  });

  expect(viewModel.playNextItems.map((item) => item.id)).toEqual(['3', '1']);
 });

 it('keeps play next items without a priority after prioritized games', () => {
  const viewModel = createBacklogScreenViewModel({
   activeFilter: null,
   appliedFilters: createEmptyGameDiscoveryFilters(),
   backlogItems: [
    createBacklogItem('1', BacklogStatusEnum.WANT_TO_PLAY, {
     is_play_next: true,
     play_next_priority: null,
    }),
    createBacklogItem('2', BacklogStatusEnum.WANT_TO_PLAY, {
     is_play_next: true,
     play_next_priority: 1,
    }),
   ],
   search: '',
  });

  expect(viewModel.playNextItems.map((item) => item.id)).toEqual(['2', '1']);
 });
});
