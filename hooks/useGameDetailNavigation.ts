import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { getCatalogGameNumericId } from '@/shared/utils/catalogGame';

type UseGameDetailNavigationParams = {
 developerCatalogId?: string | null;
 developerName?: string | null;
 developerSlug?: string | null;
 gameName?: string | null;
 publisherCatalogId?: string | null;
 publisherName?: string | null;
 publisherSlug?: string | null;
};

export function useGameDetailNavigation({
 developerCatalogId,
 developerName,
 developerSlug,
 gameName,
 publisherCatalogId,
 publisherName,
 publisherSlug,
}: UseGameDetailNavigationParams) {
 const router = useRouter();

 const handleRelatedGamePress = useCallback(
  (relatedGame: CatalogGame) => {
   const relatedGameId = getCatalogGameNumericId(relatedGame);
   if (relatedGameId === null) return;
   router.push({ pathname: '/game/[id]', params: { id: relatedGameId } });
  },
  [router],
 );

 const handleDeveloperPress = useCallback(() => {
  const developerParam = developerCatalogId ?? developerSlug;
  if (!developerParam) return;

  router.push({
   pathname: '/',
   params: {
    developerId: developerParam,
    developerName: developerName ?? '',
    originGameName: gameName ?? '',
    pivotType: 'developer',
   },
  });
 }, [developerCatalogId, developerName, developerSlug, gameName, router]);

 const handlePublisherPress = useCallback(() => {
  const publisherParam = publisherCatalogId ?? publisherSlug;
  if (!publisherParam) return;

  router.push({
   pathname: '/',
   params: {
    publisherId: publisherParam,
    publisherName: publisherName ?? '',
    originGameName: gameName ?? '',
    pivotType: 'publisher',
   },
  });
 }, [gameName, publisherCatalogId, publisherName, publisherSlug, router]);

 const handleBackPress = useCallback(() => {
  router.back();
 }, [router]);

 return {
  handleBackPress,
  handleDeveloperPress,
  handlePublisherPress,
  handleRelatedGamePress,
 } as const;
}
