import { describe, expect, it } from 'vitest';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { isBacklogStatusReleaseLocked, isStartedAtBeforeRelease } from '@/shared/utils/backlogRelease';

describe('backlogRelease utilities', () => {
 it('blocks active statuses for future release dates', () => {
  expect(
   isBacklogStatusReleaseLocked(BacklogStatusEnum.PLAYING, {
    releasedAt: '2099-01-10T00:00:00.000Z',
   }),
  ).toBe(true);
 });

 it('blocks active statuses when the game is still TBD/not released', () => {
  expect(
   isBacklogStatusReleaseLocked(BacklogStatusEnum.COMPLETED, {
    releaseStatusKey: 'not_released',
   }),
  ).toBe(true);
 });

 it('allows inactive statuses even if the game is unreleased', () => {
  expect(
   isBacklogStatusReleaseLocked(BacklogStatusEnum.WISHLIST, {
    releaseStatusKey: 'upcoming',
   }),
  ).toBe(false);
 });

 it('detects start dates earlier than release date', () => {
  expect(
   isStartedAtBeforeRelease('2025-01-09T12:00:00.000Z', {
    releasedAt: '2025-01-10T00:00:00.000Z',
   }),
  ).toBe(true);
 });
});
