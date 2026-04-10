import { FontAwesome5 } from '@expo/vector-icons';
import type React from 'react';
import { Text, View } from 'react-native';
import { borderRadius, colors, typography } from '@/shared/theme/tokens';

type PlatformIconEntry = {
 name?: React.ComponentProps<typeof FontAwesome5>['name'];
 brand?: boolean;
 textMark?: string;
};

const PLATFORM_ICON_ORDER = [
 'playstation',
 'xbox',
 'windows',
 'nintendo',
 'apple',
 'android',
 'linux',
 'stadia',
] as const;

export type PlatformKey = (typeof PLATFORM_ICON_ORDER)[number];

export const PLATFORM_ICONS: Record<PlatformKey, PlatformIconEntry> = {
 playstation: { name: 'playstation', brand: true },
 xbox: { name: 'xbox', brand: true },
 windows: { name: 'windows', brand: true },
 nintendo: { name: 'gamepad', brand: false },
 apple: { name: 'apple', brand: true },
 android: { name: 'android', brand: true },
 linux: { name: 'linux', brand: true },
 stadia: { textMark: 'ST' },
};

export { PLATFORM_ICON_ORDER };

function normalizePlatformValue(value: string) {
 return value
  .trim()
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
}

export function slugToKey(slug: string): PlatformKey | null {
 const normalized = normalizePlatformValue(slug);

 if (
  normalized.startsWith('playstation') ||
  normalized === 'ps4' ||
  normalized === 'ps5' ||
  normalized === 'ps-vita' ||
  normalized === 'psvita' ||
  normalized === 'psp'
 )
  return 'playstation';

 if (
  normalized.startsWith('xbox') ||
  normalized === 'xbox-one' ||
  normalized === 'xbox-series-x' ||
  normalized === 'xbox-series-s' ||
  normalized === 'xbox-series-x-s' ||
  normalized === 'xbox-series-xs'
 )
  return 'xbox';

 if (normalized === 'pc' || normalized === 'windows' || normalized === 'pc-microsoft-windows')
  return 'windows';

 if (
  normalized.startsWith('nintendo') ||
  normalized === 'switch' ||
  normalized === 'switch-2' ||
  normalized === 'nintendo-switch-2' ||
  normalized === 'wii' ||
  normalized === 'wii-u' ||
  normalized === 'gamecube' ||
  normalized.includes('3ds') ||
  normalized.includes('game-boy') ||
  normalized === 'nes' ||
  normalized === 'snes'
 )
  return 'nintendo';

 if (
  normalized === 'ios' ||
  normalized === 'iphone' ||
  normalized === 'ipad' ||
  normalized === 'mac' ||
  normalized === 'macos' ||
  normalized === 'mac-os'
 )
  return 'apple';

 if (normalized === 'android') return 'android';
 if (normalized === 'linux') return 'linux';
 if (normalized === 'stadia' || normalized === 'google-stadia') return 'stadia';

 return null;
}

export function platformNameToKey(name: string): PlatformKey | null {
 return slugToKey(name);
}

type PlatformGlyphProps = {
 platformKey: PlatformKey;
 size?: number;
 color?: string;
};

export function PlatformGlyph({
 platformKey,
 size = 11,
 color = colors.text.secondary,
}: PlatformGlyphProps) {
 const entry = PLATFORM_ICONS[platformKey];

 if (entry.name) {
  return <FontAwesome5 name={entry.name} size={size} color={color} brand={entry.brand} />;
 }

 return (
  <View
   style={{
    minWidth: size * 1.9,
    height: size * 1.55,
    paddingHorizontal: Math.max(3, Math.round(size * 0.3)),
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: `${color}44`,
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <Text
    style={{
     color,
     fontSize: Math.max(7, size * 0.62),
     fontFamily: typography.font.bold,
     letterSpacing: typography.letterSpacing.wide,
     textTransform: 'uppercase',
    }}
   >
    {entry.textMark}
   </Text>
  </View>
 );
}

type PlatformIconProps = {
 slug: string;
 size?: number;
 color?: string;
};

export function PlatformIcon({
 slug,
 size = 11,
 color = colors.text.secondary,
}: PlatformIconProps) {
 const key = slugToKey(slug);
 if (!key) return null;

 return <PlatformGlyph platformKey={key} size={size} color={color} />;
}
