import { useQuery } from '@tanstack/react-query';
import { listCatalogTaxonomy } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';

const PREFERRED_PLATFORM_ORDER = [
 'pc',
 'playstation',
 'xbox',
 'nintendo',
 'ios',
 'android',
 'mac',
 'macos',
 'linux',
];

function getPlatformRank(platform: { slug?: string | null; name: string }) {
 const normalizedSlug = platform.slug?.toLowerCase() ?? '';
 const normalizedName = platform.name.toLowerCase();

 const exactIndex = PREFERRED_PLATFORM_ORDER.indexOf(normalizedSlug);
 if (exactIndex >= 0) return exactIndex;

 const fuzzyIndex = PREFERRED_PLATFORM_ORDER.findIndex(
  (value) => normalizedSlug.includes(value) || normalizedName.includes(value),
 );
 return fuzzyIndex >= 0 ? fuzzyIndex : PREFERRED_PLATFORM_ORDER.length + 1;
}

export function useCatalogParentPlatforms(enabled = true) {
 const catalogSignature = getCatalogQuerySignature();
 return useQuery({
  queryKey: ['catalog-parent-platforms', catalogSignature],
  queryFn: () => listCatalogTaxonomy('parent-platforms'),
  staleTime: 60 * 60 * 1000,
  enabled,
  select: (platforms) =>
   [...platforms]
    .sort((a, b) => {
     const rankDiff = getPlatformRank(a) - getPlatformRank(b);
     if (rankDiff !== 0) return rankDiff;
     return a.name.localeCompare(b.name);
    }),
 });
}
