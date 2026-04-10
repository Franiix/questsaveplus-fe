/**
 * Elevation & Glow System — QuestSave+
 * Shadow tokens per elevazione standard e glow colorati per accenti di brand.
 */

export const shadows = {
 none: {},

 sm: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
  shadowOpacity: 0.4,
  elevation: 2,
 },

 md: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 16,
  shadowOpacity: 0.5,
  elevation: 4,
 },

 lg: {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 32,
  shadowOpacity: 0.6,
  elevation: 8,
 },

 glow: {
  violet: {
   shadowColor: '#6C63FF',
   shadowOffset: { width: 0, height: 0 },
   shadowRadius: 20,
   shadowOpacity: 0.55,
   elevation: 12,
  },
  cyan: {
   shadowColor: '#00D4FF',
   shadowOffset: { width: 0, height: 0 },
   shadowRadius: 16,
   shadowOpacity: 0.5,
   elevation: 10,
  },
  green: {
   shadowColor: '#4ADE80',
   shadowOffset: { width: 0, height: 0 },
   shadowRadius: 14,
   shadowOpacity: 0.45,
   elevation: 8,
  },
  orange: {
   shadowColor: '#FB923C',
   shadowOffset: { width: 0, height: 0 },
   shadowRadius: 14,
   shadowOpacity: 0.45,
   elevation: 8,
  },
 },

 inputFocus: {
  shadowColor: '#6C63FF',
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 8,
  shadowOpacity: 0.35,
  elevation: 4,
 },
} as const;
