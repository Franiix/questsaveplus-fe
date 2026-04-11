import { describe, expect, it } from 'vitest';
import type { EdgeGameDetail, EdgeGameSearchItem } from '@/lib/catalog/contracts/edge';
import {
 mapEdgeDetailToCatalog,
 mapEdgeGameToCatalog,
} from '@/lib/catalog/providers/edgeCatalogMappers';
import { IGDB_RELATION_KINDS } from '@/shared/consts/IgdbRelationKinds.const';

function createEdgeSearchItem(overrides: Partial<EdgeGameSearchItem> = {}): EdgeGameSearchItem {
 return {
  gameId: 42,
  provider: 'igdb',
  providerGameId: 1942,
  slug: 'cyberpunk-2077',
  name: 'Cyberpunk 2077',
  coverUrl: 'https://images.example/cover.jpg',
  releasedAt: '2020-12-10T00:00:00.000Z',
  rating: 86.4,
  aggregatedRating: 86.4,
  aggregatedRatingCount: 92,
  totalRating: 84.1,
  totalRatingCount: 1245,
  ratingsCount: 1245,
  status: null,
  platforms: ['PC (Microsoft Windows)', 'PlayStation 5', 'Xbox Series X|S'],
  genres: ['Role-playing (RPG)', 'Shooter'],
  summary: 'Open-world action RPG set in Night City.',
  raw: {
   game_type: { id: 0, type: 'main_game' },
   game_status: { id: 0, name: 'Released' },
   status: { id: 0, name: 'Released' },
   follows: 2134,
   hypes: 982,
   version_title: null,
   parent_game: null,
   version_parent: null,
   relationKind: null,
  },
  ...overrides,
 };
}

function createEdgeDetail(overrides: Partial<EdgeGameDetail> = {}): EdgeGameDetail {
 return {
  ...createEdgeSearchItem(),
  description: 'Cyberpunk 2077 e un action RPG open world ambientato a Night City.',
  developers: ['CD Projekt RED'],
  publishers: ['CD Projekt'],
  screenshots: ['https://images.example/screenshot.jpg'],
  websites: ['https://www.cyberpunk.net'],
  gameType: null,
  follows: 2134,
  hypes: 982,
  versionTitle: null,
  parentGameName: null,
  versionParentName: null,
  versionFamilyCount: 3,
  releaseReadiness: {
   isReleased: true,
   nextReleaseAt: null,
   hasFutureReleaseDates: false,
   upcomingReleasePlatforms: [],
  },
  franchises: ['Cyberpunk'],
  collections: ['Cyberpunk 2077 Editions'],
  raw: {
   ...createEdgeSearchItem().raw,
   game_type_id: 0,
   franchise_ids: [7],
   collection_ids: [2],
  },
  ...overrides,
 };
}

describe('edgeCatalogMappers', () => {
 it('maps release status from raw IGDB fallback when top-level status is missing', () => {
  const result = mapEdgeGameToCatalog(
   createEdgeSearchItem({
    status: null,
    raw: {
     game_status: { id: 4, name: 'Early Access' },
     relationKind: null,
    },
   }),
  );

  expect(result.metadata?.releaseStatus).toBe('Early Access');
 });

 it('preserves raw contract fields used by catalog fallbacks', () => {
  const result = mapEdgeGameToCatalog(
   createEdgeSearchItem({
    raw: {
     game_type: { id: 3, type: 'bundle' },
     game_type_id: 3,
     collection_ids: [2],
     franchise_ids: [7],
     relationKind: IGDB_RELATION_KINDS.Bundle,
    },
   }),
  );

  expect(result.metadata?.raw).toMatchObject({
   game_type_id: 3,
   collection_ids: [2],
   franchise_ids: [7],
   relationKind: 'bundle',
  });
 });

 it('maps detail payload into catalog detail with parent platform grouping', () => {
  const result = mapEdgeDetailToCatalog(createEdgeDetail());

  expect(result.website).toBe('https://www.cyberpunk.net');
  expect(result.parentPlatforms.map((platform) => platform.slug)).toEqual([
   'pc',
   'playstation',
   'xbox',
  ]);
  expect(result.metadata?.websites).toEqual(['https://www.cyberpunk.net']);
  expect(result.metadata?.provider).toBe('igdb');
 });
});
