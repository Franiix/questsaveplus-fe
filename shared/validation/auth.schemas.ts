import type { TFunction } from 'i18next';
import { z } from 'zod';
import { emailField, passwordField } from './fields';

export const createLoginSchema = (t: TFunction) =>
 z.object({
  email: emailField(t),
  password: passwordField(t),
 });

export const createRegisterSchema = (t: TFunction) =>
 z
  .object({
   email: emailField(t),
   password: passwordField(t),
   confirmPassword: z.string().min(1, t('auth.validation.passwordRequired')),
  })
  .refine((data) => data.password === data.confirmPassword, {
   message: t('auth.validation.passwordsNotMatch'),
   path: ['confirmPassword'],
  });

export const createForgotPasswordSchema = (t: TFunction) =>
 z.object({
  email: emailField(t),
 });

export const createChangeEmailSchema = (t: TFunction) =>
 z.object({
  email: emailField(t),
 });

export const createChangePasswordSchema = (t: TFunction) =>
 z
  .object({
   currentPassword: passwordField(t),
   newPassword: passwordField(t),
   confirmNewPassword: z.string().min(1, t('auth.validation.passwordRequired')),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
   message: t('auth.validation.passwordsNotMatch'),
   path: ['confirmNewPassword'],
  });

export type ForgotPasswordForm = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ChangeEmailForm = z.infer<ReturnType<typeof createChangeEmailSchema>>;
export type ChangePasswordForm = z.infer<ReturnType<typeof createChangePasswordSchema>>;
