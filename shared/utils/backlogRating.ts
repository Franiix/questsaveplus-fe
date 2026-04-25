import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

const NON_RATEABLE_BACKLOG_STATUSES = new Set<BacklogStatusEnum>([
 BacklogStatusEnum.WISHLIST,
 BacklogStatusEnum.WANT_TO_PLAY,
 BacklogStatusEnum.PLAYING,
]);

export function isBacklogStatusRateable(status: BacklogStatusEnum): boolean {
 return !NON_RATEABLE_BACKLOG_STATUSES.has(status);
}

export function normalizeBacklogRatingForStatus(
 status: BacklogStatusEnum,
 rating: number | null | undefined,
): number | null {
 if (!isBacklogStatusRateable(status)) {
  return null;
 }

 return rating ?? null;
}
