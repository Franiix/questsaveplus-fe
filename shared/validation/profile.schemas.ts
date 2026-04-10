import type { TFunction } from 'i18next';
import { z } from 'zod';
import { PROFILE_GENDERS } from '@/shared/enums/ProfileGender.enum';
import { usernameField } from './fields';

export const createProfileSetupSchema = (t: TFunction) =>
 z.object({
  first_name: z
   .string()
   .min(1, t('auth.profileSetup.validation.firstNameRequired'))
   .min(2, t('auth.profileSetup.validation.firstNameTooShort')),
  last_name: z
   .string()
   .min(1, t('auth.profileSetup.validation.lastNameRequired'))
   .min(2, t('auth.profileSetup.validation.lastNameTooShort')),
  username: usernameField(t),
  birth_date: z.date().nullable().optional(),
  gender: z.enum(PROFILE_GENDERS).nullable().optional(),
 });

export type ProfileSetupForm = z.infer<ReturnType<typeof createProfileSetupSchema>>;

export const createEditProfileSchema = (t: TFunction) =>
 z.object({
  first_name: z
   .string()
   .min(1, t('auth.profileSetup.validation.firstNameRequired'))
   .min(2, t('auth.profileSetup.validation.firstNameTooShort')),
  last_name: z
   .string()
   .min(1, t('auth.profileSetup.validation.lastNameRequired'))
   .min(2, t('auth.profileSetup.validation.lastNameTooShort')),
  birth_date: z.date().nullable().optional(),
  gender: z.enum(PROFILE_GENDERS).nullable().optional(),
 });

export type EditProfileForm = z.infer<ReturnType<typeof createEditProfileSchema>>;
