/**
 * Design Tokens — QuestSave+
 * Fonte unica di verità per colori, tipografia, spacing e altro.
 * Usati da tutti i componenti base, Gluestack e NativeWind.
 */

export const colors = {
 background: {
  primary: '#080810',
  surface: '#0F0F1E',
  elevated: '#1A1A30',
  overlay: '#050508',
  glass: 'rgba(15, 15, 30, 0.72)',
 },
 primary: {
  '50': '#F0EEFF',
  '100': '#DDD9FF',
  '200': '#BAB3FF',
  '300': '#9790FF',
  DEFAULT: '#6C63FF',
  '500': '#5A52E0',
  '600': '#4D46CC',
  '700': '#3B35B3',
  '800': '#2A2480',
  '900': '#1A164D',
  glow: 'rgba(108, 99, 255, 0.35)',
  glowSoft: 'rgba(108, 99, 255, 0.15)',
 },
 accent: {
  DEFAULT: '#00D4FF',
  light: '#66E8FF',
  dark: '#0099CC',
  glow: 'rgba(0, 212, 255, 0.30)',
 },
 gradient: {
  brand: ['#6C63FF', '#4D46CC', '#2A2480'],
  cardScrim: ['transparent', 'rgba(8, 8, 16, 0.60)', 'rgba(8, 8, 16, 0.95)'],
  cardHero: ['transparent', 'rgba(8, 8, 16, 0.40)', '#080810'],
  profileHero: ['#1A1430', '#0F0F1E'],
  shimmer: ['#1A1A30', '#252542', '#1A1A30'],
  violetRadial: ['rgba(108, 99, 255, 0.20)', 'transparent'],
  iridescent: ['#6C63FF', '#00D4FF', '#FF6B9D', '#6C63FF'],
 },
 success: '#4ADE80',
 warning: '#FB923C',
 error: '#F87171',
 info: '#38BDF8',
 text: {
  primary: '#F4F4FF',
  secondary: '#8E8EAA',
  tertiary: '#5C5C78',
  disabled: '#3E3E58',
  inverse: '#080810',
  accent: '#6C63FF',
 },
 border: {
  subtle: '#151524',
  DEFAULT: '#1E1E34',
  strong: '#2E2E4A',
  focus: '#6C63FF',
  glow: 'rgba(108, 99, 255, 0.60)',
  accent: '#00D4FF',
 },
 status: {
  wishlist: '#FF5FA2',
  want_to_play: '#38BDF8',
  playing: '#FB923C',
  ongoing: '#8B7BFF',
  completed: '#4ADE80',
  abandoned: '#F87171',
 },
 glow: {
  violet: 'rgba(108, 99, 255, 0.40)',
  cyan: 'rgba(0, 212, 255, 0.35)',
  green: 'rgba(74, 222, 128, 0.35)',
  orange: 'rgba(251, 146, 60, 0.35)',
  red: 'rgba(248, 113, 113, 0.35)',
  blue: 'rgba(56, 189, 248, 0.35)',
 },
} as const;

export const spacing = {
 xs: 4,
 sm: 8,
 md: 16,
 lg: 24,
 xl: 32,
 '2xl': 48,
 '3xl': 64,
} as const;

export const borderRadius = {
 sm: 6,
 md: 12, // input, button, card — valore più usato nell'app
 lg: 16,
 xl: 24,
 full: 9999,
} as const;

export const typography = {
 family: {
  sans: 'Geist_400Regular',
  mono: 'Geist_400Regular',
  fallback: 'System',
 },
 size: {
  '2xs': 10,
  xs: 11,
  caption: 12,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 22,
  '2xl': 26,
  '3xl': 32,
  '4xl': 40,
  hero: 52,
 },
 weight: {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
 },
 font: {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  black: 'Geist_900Black',
  mono: 'Geist_400Regular',
 },
 lineHeight: {
  tight: 1.15,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2.0,
 },
 letterSpacing: {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
 },
} as const;

export const opacity = {
 disabled: 0.5, // stato disabilitato per tutti i componenti interattivi
} as const;

export const layout = {
 screenContentTopPadding: 84, // ScreenHeader height + safe area inset
 screenBottomPadding: 110, // tab bar height + clearance
} as const;
