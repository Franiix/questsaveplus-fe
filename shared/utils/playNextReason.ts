import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogGameMetadata } from '@/shared/models/BacklogGameMetadata.model';

export type PlayNextReasonKey =
 | 'criticExcellent'
 | 'communityLoved'
 | 'questSaveFavorite'
 | 'waitingLong';

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const CRITIC_THRESHOLD = 70;
const IGDB_THRESHOLD = 70;
const QUESTSAVE_THRESHOLD = 3.0;

export function getPlayNextReasonKey(
 item: BacklogItemEntity,
 metadata?: BacklogGameMetadata | null,
): PlayNextReasonKey | null {
 if (metadata) {
  if (metadata.criticScore !== null && metadata.criticScore >= CRITIC_THRESHOLD) {
   return 'criticExcellent';
  }
  if (metadata.igdbRating !== null && metadata.igdbRating >= IGDB_THRESHOLD) {
   return 'communityLoved';
  }
  if (metadata.questSaveRating !== null && metadata.questSaveRating >= QUESTSAVE_THRESHOLD) {
   return 'questSaveFavorite';
  }
 }

 const addedAt = Date.parse(item.added_at);
 if (!Number.isNaN(addedAt) && Date.now() - addedAt >= ONE_MONTH_MS) {
  return 'waitingLong';
 }

 return null;
}
