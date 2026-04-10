import { useQuery } from '@tanstack/react-query';
import { getCatalogGameDetail } from '@/lib/catalog';
import type { CatalogGameDetail } from '@/shared/models/Catalog.model';

export function useGameDetail(id: number) {
 return useQuery<CatalogGameDetail>({
  queryKey: ['game', id],
  queryFn: () => getCatalogGameDetail(id),
  staleTime: 10 * 60 * 1000,
 });
}
