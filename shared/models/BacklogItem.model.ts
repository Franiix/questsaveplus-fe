import type { BacklogItemEntity } from '../entities/BacklogItem.entity';
import { BacklogStatusEnum } from '../enums/BacklogStatus.enum';

export interface BacklogItemModel extends BacklogItemEntity {
 is_rated: boolean;
}

function normalizePersonalRating(rating: number | null): number | null {
 if (rating === null) return null;
 return Math.max(0.5, Math.min(5, Math.round(rating * 2) / 2));
}

function normalizeStatus(status: string): BacklogStatusEnum {
 switch (status.toUpperCase()) {
  case BacklogStatusEnum.WISHLIST:
   return BacklogStatusEnum.WISHLIST;
  case BacklogStatusEnum.WANT_TO_PLAY:
   return BacklogStatusEnum.WANT_TO_PLAY;
  case BacklogStatusEnum.PLAYING:
   return BacklogStatusEnum.PLAYING;
  case BacklogStatusEnum.ONGOING:
   return BacklogStatusEnum.ONGOING;
  case BacklogStatusEnum.COMPLETED:
   return BacklogStatusEnum.COMPLETED;
  case BacklogStatusEnum.ABANDONED:
   return BacklogStatusEnum.ABANDONED;
  default:
   return BacklogStatusEnum.WANT_TO_PLAY;
 }
}

export function toBacklogItemModel(entity: BacklogItemEntity): BacklogItemModel {
 return {
  ...entity,
  status: normalizeStatus(entity.status),
  personal_rating: normalizePersonalRating(entity.personal_rating),
  is_play_next: entity.is_play_next === true,
  play_next_priority:
   typeof entity.play_next_priority === 'number' ? Math.max(1, entity.play_next_priority) : null,
  is_rated: entity.personal_rating !== null,
 };
}
