import type { ProfileGender } from '@/shared/enums/ProfileGender.enum';

export interface CreateProfileDto {
 id: string; // uuid — deve corrispondere all'utente Auth appena creato
 username: string;
 first_name: string;
 last_name: string;
 avatar_url?: string;
 birth_date?: string; // formato: YYYY-MM-DD
 gender?: ProfileGender;
}

export interface UpdateProfileDto {
 username?: string;
 first_name?: string;
 last_name?: string;
 avatar_url?: string | null;
 birth_date?: string | null;
 gender?: ProfileGender | null;
}
