import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';

export function createEmptyGameDiscoveryFilters(): GameDiscoveryFilters {
 return {
  genre: undefined,
  platform: undefined,
  developer: undefined,
  publisher: undefined,
 };
}
