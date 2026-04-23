import type { CatalogGame } from '@/shared/models/Catalog.model';

export function getGamePrefetchImageUris(game: CatalogGame | null | undefined) {
 if (!game) {
  return [];
 }

 return [game.backgroundImage?.url, game.coverImage?.url].filter(
  (uri): uri is string => typeof uri === 'string' && uri.length > 0,
 );
}
