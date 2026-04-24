import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

export interface CreateBacklogItemDto {
 user_id: string;
 game_id: number;
 game_name: string;
 game_cover_url?: string;
 status?: BacklogStatusEnum; // default: 'WANT_TO_PLAY'
 personal_rating?: number; // 0-5, step 0.5
 notes?: string;
 is_play_next?: boolean;
 play_next_priority?: number | null;
 platform_played?: string[];
 started_at?: string;
 completed_at?: string;
 abandoned_at?: string;
 resumed_at?: string;
}

export interface UpdateBacklogItemDto {
 id: string;
 game_name?: string;
 game_cover_url?: string | null;
 status?: BacklogStatusEnum;
 personal_rating?: number | null; // 0-5, step 0.5
 notes?: string | null;
 is_play_next?: boolean;
 play_next_priority?: number | null;
 platform_played?: string[] | null;
 started_at?: string | null;
 completed_at?: string | null;
 abandoned_at?: string | null;
 resumed_at?: string | null;
}
