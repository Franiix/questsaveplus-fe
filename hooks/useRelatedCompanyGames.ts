import { useQuery } from '@tanstack/react-query';
import { searchCatalogGames } from '@/lib/catalog';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseRelatedCompanyGamesParams = {
 currentGameId: number;
 companyExternalId?: string | null;
 companyName?: string | null;
 companyType: 'developers' | 'publishers';
 enabled?: boolean;
};

export function useRelatedCompanyGames({
 currentGameId,
 companyExternalId,
 companyName,
 companyType,
 enabled = true,
}: UseRelatedCompanyGamesParams) {
 return useQuery({
  queryKey: ['related-company-games', companyType, companyExternalId, companyName, currentGameId],
  queryFn: async () => {
    const response = await searchCatalogGames({
     page: 1,
      pageSize: 24,
      ordering: '-released',
      dates: '1980-01-01,2030-12-31',
      developers: companyType === 'developers' ? companyExternalId ?? undefined : undefined,
      publishers: companyType === 'publishers' ? companyExternalId ?? undefined : undefined,
    });

    return response.items.filter((game) => getCatalogGameNumericId(game) !== currentGameId);
  },
  enabled: enabled && Number.isFinite(currentGameId) && Boolean(companyExternalId),
 staleTime: 10 * 60 * 1000,
 });
}
