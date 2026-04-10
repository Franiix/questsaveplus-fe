import { useQuery } from '@tanstack/react-query';
import { listCatalogTaxonomy } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';

export function useCatalogGenres() {
 const catalogSignature = getCatalogQuerySignature();
 return useQuery({
  queryKey: ['catalog-genres', catalogSignature],
  queryFn: () => listCatalogTaxonomy('genres'),
  staleTime: 24 * 60 * 60 * 1000,
 });
}
