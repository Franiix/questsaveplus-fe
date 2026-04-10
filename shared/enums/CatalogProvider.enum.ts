export const CATALOG_PROVIDERS = ['igdb'] as const;

export type CatalogProviderId = (typeof CATALOG_PROVIDERS)[number];
