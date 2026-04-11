import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';

export type HomeQuickPresetDescriptor = {
 filters: GameDiscoveryFilters;
 key: string;
 label: string;
};
