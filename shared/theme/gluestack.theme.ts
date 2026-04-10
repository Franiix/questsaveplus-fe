import { borderRadius, colors, spacing, typography } from './tokens';

/**
 * Configurazione tema Gluestack UI — QuestSave+
 * Estende i token in tokens.ts per il provider Gluestack.
 */
export const gluestackConfig = {
 aliases: {},
 tokens: {
  colors: {
   // Background
   backgroundPrimary: colors.background.primary,
   backgroundSurface: colors.background.surface,
   backgroundElevated: colors.background.elevated,

   // Brand
   primary: colors.primary.DEFAULT,
   primaryLight: colors.primary['200'],
   primaryDark: colors.primary['700'],

   // Semantici
   success: colors.success,
   warning: colors.warning,
   error: colors.error,
   info: colors.info,

   // Testo
   textPrimary: colors.text.primary,
   textSecondary: colors.text.secondary,
   textDisabled: colors.text.disabled,

   // Bordi
   border: colors.border.DEFAULT,
   borderFocus: colors.border.focus,
  },
  space: spacing,
  radii: borderRadius,
  fontSizes: typography.size,
 },
} as const;

export type GluestackConfig = typeof gluestackConfig;
