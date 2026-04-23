export const PROFILE_GENDERS = ['MALE', 'FEMALE', 'UNSPECIFIED'] as const;

export type ProfileGender = (typeof PROFILE_GENDERS)[number];
