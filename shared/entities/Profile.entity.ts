import type { BaseEntity } from '@/shared/entities/BaseEntity.entity';
import type { ProfileGender } from '@/shared/enums/ProfileGender.enum';

export interface ProfileEntity extends BaseEntity {
 username: string; // unico, min 3 / max 30 caratteri
 first_name: string; // min 2 / max 50 caratteri
 last_name: string; // min 2 / max 50 caratteri
 avatar_url: string | null;
 birth_date: string | null; // formato: YYYY-MM-DD
 gender: ProfileGender | null;
 created_at: string; // ISO 8601
 updated_at: string; // ISO 8601
}
