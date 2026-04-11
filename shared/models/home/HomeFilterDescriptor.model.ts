import type { GameDiscoveryFilters } from '@/shared/models/GameDiscoveryFilters.model';

export type HomeFilterDescriptor = {
 field: keyof GameDiscoveryFilters;
 key: string;
 label: string;
 value: string;
};
