import { describe, expect, it, vi } from 'vitest';
import type { CatalogGameDetail } from '@/shared/models/Catalog.model';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import {
 getCatalogGameCategoryTranslationKey,
 getGameCatalogParentPlatformItems,
 getGameCatalogReleaseStatusKey,
 getGameCatalogReleaseStatusLabel,
 getGameEditorialAudience,
} from '@/shared/utils/gameCatalog';

function createGameDetail(overrides: Partial<CatalogGameDetail> = {}): CatalogGameDetail {
 return {
  id: 'igdb:1',
  providerId: 'igdb',
  externalId: '1',
  name: 'Test Game',
  genres: [],
  platforms: [],
  summary: null,
  website: null,
  parentPlatforms: [],
  developers: [],
  publishers: [],
  tags: [],
  images: [],
  follows: null,
  hypes: null,
  versionTitle: null,
  parentGameName: null,
  versionParentName: null,
  versionFamilyCount: null,
  franchises: [],
  collections: [],
  releaseReadiness: null,
  ...overrides,
 };
}

describe('gameCatalog utilities', () => {
 it('maps parent platforms without duplicates', () => {
  expect(
   getGameCatalogParentPlatformItems([
    { name: 'PlayStation 5' },
    { name: 'PlayStation 4' },
    { name: 'Xbox Series X|S' },
    'Nintendo Switch',
   ]),
  ).toEqual([
   { slug: 'playstation', name: 'PlayStation' },
   { slug: 'xbox', name: 'Xbox' },
   { slug: 'nintendo', name: 'Nintendo' },
  ]);
 });

 it('prefers explicit release status over timestamp fallback', () => {
  const raw: IgdbRawExtras = {
   game_status: {
    name: 'Early Access',
   },
   first_release_date: Math.floor(new Date('2099-01-01').getTime() / 1000),
  };

  expect(getGameCatalogReleaseStatusKey(raw)).toBe('early_access');
  expect(
   getGameCatalogReleaseStatusLabel(raw, (key, options) => String(options?.defaultValue ?? key)),
  ).toBe('Early Access');
 });

 it('falls back to upcoming or released based on first release date', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-11T12:00:00.000Z'));

  const upcomingRaw: IgdbRawExtras = {
   first_release_date: Math.floor(new Date('2026-05-20T00:00:00.000Z').getTime() / 1000),
  };
  const releasedRaw: IgdbRawExtras = {
   first_release_date: Math.floor(new Date('2025-01-20T00:00:00.000Z').getTime() / 1000),
  };

  expect(getGameCatalogReleaseStatusKey(upcomingRaw)).toBe('upcoming');
  expect(getGameCatalogReleaseStatusKey(releasedRaw)).toBe('released');

  vi.useRealTimers();
 });

 it('uses relation kind as category fallback when game type is missing', () => {
  const game = createGameDetail({
   metadata: {
    raw: {
     relationKind: 'bundle',
    },
   },
  });

  expect(getCatalogGameCategoryTranslationKey(game)).toBe('bundle');
 });

 it('builds editorial audience bullets and caps them to three items', () => {
  const translate = (
   key: string,
   options?: Record<string, string | number | boolean | null | undefined>,
  ) => String(options?.defaultValue ?? key);

  const game = createGameDetail({
   metadata: {
    raw: {
     storyline: 'A long single player story',
     game_modes: [{ name: 'Single player' }],
     multiplayer_modes: [{ offlinecoop: true }],
     themes: [{ name: 'Science fiction' }, { name: 'Strategy' }, { name: 'Open world' }],
    },
   },
  });

  const result = getGameEditorialAudience(game, game.metadata?.raw ?? null, translate);

  expect(result).not.toBeNull();
  expect(result?.bullets).toEqual([
   'Ideale per co-op locale',
   'Perfetto per chi ama la fantascienza',
   'Ideale se cerchi una campagna single player',
  ]);
 });
});
