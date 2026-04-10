import {
 getEdgeCatalogGameDetail,
 listEdgeCatalogRelatedGames,
 listEdgeCatalogTaxonomy,
 searchEdgeCatalogGames,
} from '@/lib/catalog/providers/edgeCatalogProvider';
import type {
 CatalogCompany,
 CatalogGame,
 CatalogGameDetail,
 CatalogGenre,
 CatalogPage,
 CatalogPlatform,
} from '@/shared/models/Catalog.model';
import type { CatalogTaxonomyKind } from '@/shared/enums/CatalogTaxonomyKind.enum';
import type { CatalogCompanyRole } from '@/shared/models/CatalogCompanyRole.model';
import type { CatalogSearchParams } from '@/shared/models/CatalogSearchParams.model';

type TaxonomyReturnMap = {
 genres: CatalogGenre[];
 'parent-platforms': CatalogPlatform[];
 developers: CatalogCompany[];
 publishers: CatalogCompany[];
};

export async function searchCatalogGames(
 params: CatalogSearchParams,
): Promise<CatalogPage<CatalogGame>> {
 return searchEdgeCatalogGames(params);
}

export async function getCatalogGameDetail(gameId: number): Promise<CatalogGameDetail> {
 return getEdgeCatalogGameDetail(gameId);
}

export async function listCatalogTaxonomy<TKey extends CatalogTaxonomyKind>(
 kind: TKey,
): Promise<TaxonomyReturnMap[TKey]> {
 return listEdgeCatalogTaxonomy(kind) as Promise<TaxonomyReturnMap[TKey]>;
}

export async function listCatalogCompanies(role: CatalogCompanyRole): Promise<CatalogCompany[]> {
 return listCatalogTaxonomy(role);
}

export async function listCatalogRelatedGames(
 gameId: number,
 relation: 'series' | 'additions' | 'similar',
): Promise<CatalogPage<CatalogGame>> {
 return listEdgeCatalogRelatedGames(gameId, relation);
}
