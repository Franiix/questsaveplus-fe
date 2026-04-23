import type { BaseEntity } from '@/shared/entities/BaseEntity.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

export interface BacklogItemEntity extends BaseEntity {
 user_id: string; // uuid — FK → profiles.id
 game_id: number; // ID interno del gioco
 game_name: string; // salvato localmente, aggiornato lazy
 game_cover_url: string | null; // salvato localmente, aggiornato lazy
 status: BacklogStatusEnum;
 personal_rating: number | null; // 0-5, step 0.5
 notes: string | null;
 is_play_next?: boolean | null;
 play_next_priority?: number | null;
 added_at: string; // ISO 8601
 updated_at: string; // ISO 8601
}
