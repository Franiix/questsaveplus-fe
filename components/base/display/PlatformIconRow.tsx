import { View } from 'react-native';
import type { CatalogPlatform } from '@/shared/models/Catalog.model';
import { colors } from '@/shared/theme/tokens';
import { PLATFORM_ICON_ORDER, PlatformGlyph, type PlatformKey, slugToKey } from './PlatformIcon';

type PlatformIconItem = CatalogPlatform;

type PlatformIconRowProps = {
 platforms: PlatformIconItem[];
 maxIcons?: number;
 size?: number;
 color?: string;
};

function getPlatformSlug(platform: PlatformIconItem) {
 return platform.slug ?? '';
}

function getUniquePlatformKeys(platforms: PlatformIconItem[]): PlatformKey[] {
 const seen = new Set<PlatformKey>();
 for (const p of platforms) {
  const key = slugToKey(getPlatformSlug(p));
  if (key) seen.add(key);
 }
 return PLATFORM_ICON_ORDER.filter((k) => seen.has(k));
}

/**
 * Atom: riga di icone piattaforma de-duplicate in ordine canonico.
 *
 * Accetta l'array piattaforme del gioco, risolve le chiavi di piattaforma
 * internamente e renderizza fino a maxIcons icone.
 */
export function PlatformIconRow({
 platforms,
 maxIcons = 4,
 size = 11,
 color = colors.text.secondary,
}: PlatformIconRowProps) {
 const keys = getUniquePlatformKeys(platforms).slice(0, maxIcons);

 if (keys.length === 0) return null;

 return (
  <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
   {keys.map((key) => {
    return <PlatformGlyph key={key} platformKey={key} size={size} color={color} />;
   })}
  </View>
 );
}
