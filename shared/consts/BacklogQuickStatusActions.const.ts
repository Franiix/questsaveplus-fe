import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { BacklogQuickStatusAction } from '@/shared/models/backlog/BacklogQuickStatusAction.model';

export const BACKLOG_QUICK_STATUS_ACTIONS: Record<
 BacklogStatusEnum,
 readonly BacklogQuickStatusAction[]
> = {
 [BacklogStatusEnum.WISHLIST]: [
  { status: BacklogStatusEnum.WANT_TO_PLAY, isPrimary: true },
  { status: BacklogStatusEnum.PLAYING },
  { status: BacklogStatusEnum.COMPLETED },
  { status: BacklogStatusEnum.ONGOING },
  { status: BacklogStatusEnum.ABANDONED },
 ],
 [BacklogStatusEnum.WANT_TO_PLAY]: [
  { status: BacklogStatusEnum.PLAYING, isPrimary: true },
  { status: BacklogStatusEnum.COMPLETED },
  { status: BacklogStatusEnum.ABANDONED },
  { status: BacklogStatusEnum.ONGOING },
  { status: BacklogStatusEnum.WISHLIST },
 ],
 [BacklogStatusEnum.PLAYING]: [
  { status: BacklogStatusEnum.COMPLETED, isPrimary: true },
  { status: BacklogStatusEnum.WANT_TO_PLAY },
  { status: BacklogStatusEnum.ABANDONED },
  { status: BacklogStatusEnum.ONGOING },
  { status: BacklogStatusEnum.WISHLIST },
 ],
 [BacklogStatusEnum.ONGOING]: [
  { status: BacklogStatusEnum.COMPLETED, isPrimary: true },
  { status: BacklogStatusEnum.PLAYING },
  { status: BacklogStatusEnum.WANT_TO_PLAY },
  { status: BacklogStatusEnum.WISHLIST },
  { status: BacklogStatusEnum.ABANDONED },
 ],
 [BacklogStatusEnum.COMPLETED]: [
  { status: BacklogStatusEnum.PLAYING, isPrimary: true },
  { status: BacklogStatusEnum.WANT_TO_PLAY },
  { status: BacklogStatusEnum.ABANDONED },
  { status: BacklogStatusEnum.WISHLIST },
  { status: BacklogStatusEnum.ONGOING },
 ],
 [BacklogStatusEnum.ABANDONED]: [
  { status: BacklogStatusEnum.WANT_TO_PLAY, isPrimary: true },
  { status: BacklogStatusEnum.PLAYING },
  { status: BacklogStatusEnum.COMPLETED },
  { status: BacklogStatusEnum.WISHLIST },
  { status: BacklogStatusEnum.ONGOING },
 ],
} as const;

export function getBacklogQuickStatusGroups(currentStatus: BacklogStatusEnum, primaryCount = 3) {
 const actions = BACKLOG_QUICK_STATUS_ACTIONS[currentStatus];

 return {
  primaryActions: actions.slice(0, primaryCount),
  secondaryActions: actions.slice(primaryCount),
 } as const;
}
