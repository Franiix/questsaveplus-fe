import { useQuery } from '@tanstack/react-query';
import { listCatalogCompanies } from '@/lib/catalog';
import { getCatalogQuerySignature } from '@/shared/config/catalog';

export function useCatalogPublishers() {
 const catalogSignature = getCatalogQuerySignature();
 return useQuery({
  queryKey: ['catalog-publishers', catalogSignature],
  queryFn: () => listCatalogCompanies('publishers'),
  staleTime: 60 * 60 * 1000,
 });
}
