export const CATALOG_TAXONOMY_KINDS = [
 'genres',
 'parent-platforms',
 'developers',
 'publishers',
] as const;

export type CatalogTaxonomyKind = (typeof CATALOG_TAXONOMY_KINDS)[number];
