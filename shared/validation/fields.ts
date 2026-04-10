import type { TFunction } from 'i18next';
import { z } from 'zod';

/**
 * Building blocks Zod riutilizzabili per i singoli campi form.
 *
 * Ogni funzione è una factory che accetta `t` per messaggi localizzati
 * e restituisce uno schema Zod per un singolo campo.
 */

/** Campo email: obbligatorio + formato RFC valido. */
export const emailField = (t: TFunction) =>
 z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid'));

/** Campo password: obbligatorio + minimo 6 caratteri. */
export const passwordField = (t: TFunction) =>
 z
  .string()
  .min(1, t('auth.validation.passwordRequired'))
  .min(6, t('auth.validation.passwordTooShort'));

/** Campo username: obbligatorio, 3-30 caratteri, solo lettere/numeri/underscore.
 *  Accetta maiuscole — la normalizzazione a lowercase avviene al submit. */
export const usernameField = (t: TFunction) =>
 z
  .string()
  .min(1, t('auth.profileSetup.validation.usernameRequired'))
  .min(3, t('auth.profileSetup.validation.usernameTooShort'))
  .max(30, t('auth.profileSetup.validation.usernameTooLong'))
  .regex(/^[a-zA-Z0-9_]+$/, t('auth.profileSetup.validation.usernameInvalid'));
