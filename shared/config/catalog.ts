export const catalogConfig = {
 primaryProvider: 'igdb',
 edgeSupportsFilteredSearch: true,
 edgeSupportsSectionDiscovery: true,
} as const;

const CATALOG_QUERY_SIGNATURE = 'igdb:filtered:sections';

export function getCatalogQuerySignature(): string {
 return CATALOG_QUERY_SIGNATURE;
}
