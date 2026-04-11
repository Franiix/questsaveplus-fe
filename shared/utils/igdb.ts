import { IGDB_REGION_NAMES } from '@/shared/consts/IgdbRegionNames.const';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';

export function getIgdbStatusName(raw?: Pick<IgdbRawExtras, 'game_status' | 'status'> | null) {
 return (
  raw?.game_status?.name?.trim() ?? raw?.status?.status?.trim() ?? raw?.status?.name?.trim() ?? null
 );
}

export function getIgdbRegionName(region?: number | null) {
 return typeof region === 'number' ? (IGDB_REGION_NAMES[region] ?? null) : null;
}
