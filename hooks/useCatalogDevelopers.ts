import { useQuery } from '@tanstack/react-query';
import { listCatalogCompanies } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';

export function useCatalogDevelopers() {
 const catalogSignature = getCatalogQuerySignature();
 return useQuery({
  queryKey: ['catalog-developers', catalogSignature],
  queryFn: () => listCatalogCompanies('developers'),
  staleTime: 60 * 60 * 1000,
 });
}
