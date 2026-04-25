import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

type DateFields = {
 started_at?: string | null;
 completed_at?: string | null;
 abandoned_at?: string | null;
 resumed_at?: string | null;
};

export type BacklogDateFieldOverrides = {
 startedAt?: string;
 completedAt?: string;
 abandonedAt?: string;
 resumedAt?: string;
 resetAbandonedAt?: boolean;
};

/**
 * Calcola i campi data da aggiornare quando cambia lo status di un backlog item.
 * Centralizza la logica duplicata tra backlog.tsx e play-next.tsx.
 */
export function calculateBacklogDateFields(
 item: Pick<
  BacklogItemEntity,
  'started_at' | 'completed_at' | 'abandoned_at' | 'resumed_at' | 'status'
 >,
 newStatus: BacklogStatusEnum,
 overrides?: BacklogDateFieldOverrides,
): DateFields {
 const now = new Date().toISOString();
 const isWishlist = newStatus === BacklogStatusEnum.WISHLIST;
 const isCompleted = newStatus === BacklogStatusEnum.COMPLETED;
 const isAbandoned = newStatus === BacklogStatusEnum.ABANDONED;
 const isResumable =
  newStatus === BacklogStatusEnum.PLAYING ||
  newStatus === BacklogStatusEnum.ONGOING ||
  newStatus === BacklogStatusEnum.COMPLETED;
 const hasAbandonedHistory = Boolean(item.abandoned_at);

 if (isWishlist) {
  return { started_at: null, completed_at: null, abandoned_at: null, resumed_at: null };
 }

 const fields: DateFields = {};

 if (isResumable && !item.started_at) fields.started_at = overrides?.startedAt ?? now;
 if (isCompleted && !item.completed_at) fields.completed_at = overrides?.completedAt ?? now;
 if (isAbandoned && !hasAbandonedHistory) fields.abandoned_at = overrides?.abandonedAt ?? now;
 if (
  isResumable &&
  hasAbandonedHistory &&
  (item.status === BacklogStatusEnum.ABANDONED || !item.resumed_at)
 ) {
  fields.resumed_at = overrides?.resumedAt ?? now;
 }
 if (item.status === BacklogStatusEnum.COMPLETED && !isCompleted) fields.completed_at = null;
 if (overrides?.resetAbandonedAt) fields.abandoned_at = null;

 return fields;
}
