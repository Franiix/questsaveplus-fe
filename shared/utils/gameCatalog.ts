import { IGDB_REGION_NAMES } from '@/shared/consts/IgdbRegionNames.const';
import { IGDB_GAME_CATEGORY_TRANSLATION_KEYS } from '@/shared/enums/GameCategory.enum';
import type { CatalogGame, CatalogGameDetail } from '@/shared/models/Catalog.model';
import type { GameCatalogAgeRating, GameCatalogInfo } from '@/shared/models/GameCatalogInfo.model';
import type { GameCatalogLabel } from '@/shared/models/GameCatalogLabel.model';
import type { GameCatalogLinkItem, LinkCategory } from '@/shared/models/GameCatalogLinkItem.model';
import type { GameCatalogReleaseDateItem } from '@/shared/models/GameCatalogReleaseDateItem.model';
import type { GameCatalogScores } from '@/shared/models/GameCatalogScores.model';
import type { GameReleaseReadiness } from '@/shared/models/GameReleaseReadiness.model';
import type {
 CatalogLocale,
 IgdbAgeRating,
 IgdbAlternativeName,
 IgdbExternalGame,
 IgdbLanguageSupport,
 IgdbMultiplayerMode,
 IgdbNamedItem,
 IgdbRawExtras,
 IgdbReleaseDate,
 IgdbWebsite,
} from '@/shared/models/IgdbCatalogExtras.model';
import type { JsonObject, JsonValue } from '@/shared/models/JsonValue.model';
import { formatDate } from '@/shared/utils/date';
import { getIgdbStatusName } from '@/shared/utils/igdb';

type TranslationValues = Record<string, string | number | boolean | null | undefined>;

type TranslateFn = (key: string, options?: TranslationValues) => string;
type JsonField = JsonValue | undefined;

export type GameEditorialRow = {
 key: string;
 label: string;
 value: string;
 items?: string[];
};

export type GameEditorialCardContent = {
 subtitle: string | null;
 rows?: GameEditorialRow[];
 bullets?: string[];
};

function normalizeCatalogTerm(value: string) {
 return value
  .trim()
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
}

const AGE_CATEGORY_LABELS: Record<number, string> = {
 1: 'ESRB',
 2: 'PEGI',
 3: 'CERO',
 4: 'USK',
 5: 'GRAC',
 6: 'ClassInd',
 7: 'ACB',
};

const AGE_VALUE_LABELS: Record<number, string> = {
 1: '3+',
 2: '7+',
 3: '12+',
 4: '16+',
 5: '18+',
 6: 'Rating Pending',
 7: 'Early Childhood',
 8: 'Everyone',
 9: 'Everyone 10+',
 10: 'Teen',
 11: 'Mature 17+',
 12: 'Adults Only 18+',
 13: 'CERO A',
 14: 'CERO B',
 15: 'CERO C',
 16: 'CERO D',
 17: 'CERO Z',
 18: 'USK 0',
 19: 'USK 6',
 20: 'USK 12',
 21: 'USK 16',
 22: 'USK 18',
 23: 'GRAC All',
 24: 'GRAC 12+',
 25: 'GRAC 15+',
 26: 'GRAC 18+',
 27: 'GRAC Test',
 28: 'ClassInd L',
 29: 'ClassInd 10',
 30: 'ClassInd 12',
 31: 'ClassInd 14',
 32: 'ClassInd 16',
 33: 'ClassInd 18',
 34: 'ACB G',
 35: 'ACB PG',
 36: 'ACB M',
 37: 'ACB MA15+',
 38: 'ACB R18+',
 39: 'ACB RC',
};

const WEBSITE_TYPE_LABELS: Record<number, string> = {
 1: 'Official website',
 4: 'Facebook',
 5: 'Twitter',
 6: 'Twitch',
 8: 'Instagram',
 9: 'YouTube',
 13: 'Steam',
 14: 'Reddit',
 15: 'itch.io',
 16: 'Epic Games Store',
 17: 'GOG',
 18: 'Discord',
 19: 'Bluesky',
};

const WEBSITE_TYPE_CATEGORY: Record<number, LinkCategory> = {
 1: 'official',
 4: 'social',
 5: 'social',
 6: 'video',
 8: 'social',
 9: 'video',
 13: 'store',
 14: 'community',
 15: 'store',
 16: 'store',
 17: 'store',
 18: 'community',
 19: 'social',
};

const EXTERNAL_SOURCE_CATEGORY: Record<number, LinkCategory> = {
 1: 'store',
 5: 'store',
 10: 'video',
 11: 'store',
 13: 'store',
 15: 'store',
 26: 'store',
 30: 'store',
 31: 'store',
 36: 'store',
};

const EXTERNAL_SOURCE_LABELS: Record<number, string> = {
 1: 'Steam',
 5: 'GOG',
 10: 'YouTube',
 11: 'Microsoft Store',
 13: 'App Store',
 15: 'Android',
 26: 'Epic Games Store',
 30: 'itch.io',
 31: 'Xbox Marketplace',
 36: 'PlayStation Store',
};

function uniqueStrings(values: Array<string | null | undefined>) {
 return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function joinEditorialValues(values: string[], max = 3) {
 const trimmed = values.map((value) => value.trim()).filter(Boolean);
 if (trimmed.length <= max) return trimmed.join(' • ');
 return `${trimmed.slice(0, max).join(' • ')} +${trimmed.length - max}`;
}

function getComparableReleaseTimestamp(game: Pick<CatalogGame, 'releasedAt' | 'metadata'>) {
 const releasedAtMs = game.releasedAt ? Date.parse(game.releasedAt) : Number.NaN;
 if (Number.isFinite(releasedAtMs)) return releasedAtMs;

 const firstReleaseDate = game.metadata?.raw?.first_release_date;
 return typeof firstReleaseDate === 'number' && Number.isFinite(firstReleaseDate)
  ? firstReleaseDate * 1000
  : Number.NaN;
}

function resolveCatalogLabels(values: GameCatalogLabel[], translate: TranslateFn) {
 return uniqueStrings(
  values.map((value) =>
   translate(value.translationKey, {
    ...value.values,
    defaultValue: value.fallback,
   }),
  ),
 );
}

function normalizeIgdbExtras(raw?: IgdbRawExtras | null): IgdbRawExtras {
 return raw ?? {};
}

function isJsonObject(value: JsonField): value is JsonObject {
 return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNamedItem(value: JsonField): value is IgdbNamedItem {
 return isJsonObject(value) && typeof value.name === 'string';
}

function isAlternativeName(value: JsonField): value is IgdbAlternativeName {
 return isJsonObject(value) && typeof value.name === 'string';
}

function isReleaseDate(value: JsonField): value is IgdbReleaseDate {
 return isJsonObject(value);
}

function isAgeRating(value: JsonField): value is IgdbAgeRating {
 return isJsonObject(value);
}

function isMultiplayerMode(value: JsonField): value is IgdbMultiplayerMode {
 return isJsonObject(value);
}

function isLanguageSupport(value: JsonField): value is IgdbLanguageSupport {
 return isJsonObject(value);
}

function isWebsite(value: JsonField): value is IgdbWebsite {
 return isJsonObject(value);
}

function isExternalGame(value: JsonField): value is IgdbExternalGame {
 return isJsonObject(value);
}

function asPlainNamedList(value: JsonField): string[] {
 if (!Array.isArray(value)) return [];
 return uniqueStrings(value.map((item) => (isNamedItem(item) ? item.name?.trim() : null)));
}

function asTranslatableNamedList(
 value: JsonField,
 sectionKey: 'gameModes' | 'playerPerspectives' | 'themes',
): GameCatalogLabel[] {
 if (!Array.isArray(value)) return [];

 const seen = new Set<string>();
 const items: GameCatalogLabel[] = [];

 for (const item of value) {
  if (!isNamedItem(item)) continue;

  const fallback = item.name?.trim();
  if (!fallback) continue;
  const normalized = normalizeCatalogTerm(fallback);
  const dedupeKey = `${sectionKey}:${normalized}`;
  if (seen.has(dedupeKey)) continue;
  seen.add(dedupeKey);

  items.push({
   translationKey: `gameDetail.catalogLabels.${sectionKey}.${normalized}`,
   fallback,
  });
 }

 return items;
}

function asSingleName(value: JsonField): string | null {
 if (!isNamedItem(value)) return null;
 const name = value.name;
 return typeof name === 'string' && name.trim().length > 0 ? name.trim() : null;
}

function asIgdbExtras(value: JsonField): IgdbRawExtras | null {
 return isJsonObject(value) ? value : null;
}

function getNamedItemNames(values?: IgdbNamedItem[] | null): string[] {
 return uniqueStrings((values ?? []).map((item) => item.name?.trim() ?? null));
}

function asFirstArrayName(value: JsonField): string | null {
 if (!Array.isArray(value)) return null;
 for (const item of value) {
  if (!isNamedItem(item)) continue;
  const name = item.name;
  if (typeof name === 'string' && name.trim().length > 0) return name.trim();
 }
 return null;
}

function normalizeReleaseStatusKey(value: string) {
 return normalizeCatalogTerm(value).replace(/-/g, '_');
}

function asAlternativeNames(value: JsonField): string[] {
 if (!Array.isArray(value)) return [];
 return uniqueStrings(value.map((item) => (isAlternativeName(item) ? item.name?.trim() : null)));
}

const PARENT_PLATFORM_RULES = [
 { slug: 'pc', name: 'PC', test: /(pc|windows|microsoft windows|ms-dos|dos)/i },
 { slug: 'playstation', name: 'PlayStation', test: /(playstation|ps[1-5pv]|ps vita|psp)/i },
 { slug: 'xbox', name: 'Xbox', test: /xbox/i },
 {
  slug: 'nintendo',
  name: 'Nintendo',
  test: /(nintendo|switch|game boy|gameboy|gamecube|wii|ds|3ds|nes|snes)/i,
 },
 { slug: 'ios', name: 'iOS', test: /(ios|iphone|ipad)/i },
 { slug: 'android', name: 'Android', test: /android/i },
 { slug: 'mac', name: 'Mac', test: /(mac|macintosh|os x|macos)/i },
 { slug: 'linux', name: 'Linux', test: /(linux|steamos)/i },
] as const;

const MAINLINE_SERIES_CATEGORY_KEYS = new Set([
 'main_game',
 'remake',
 'remaster',
 'port',
 'expanded_game',
]);

function formatCatalogDate(timestampMs: number, locale: string) {
 return new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
 }).format(new Date(timestampMs));
}

type SortableReleaseDateItem = GameCatalogReleaseDateItem & {
 sortValue: number;
};

function asReleaseDateItems(value: JsonField, locale: string): GameCatalogReleaseDateItem[] {
 if (!Array.isArray(value)) return [];
 const items = value
  .map((item) => {
   if (!isReleaseDate(item)) return null;
   const release = item;
   const platformName =
    typeof release.platform?.name === 'string' ? release.platform.name.trim() : null;
   const timestampMs = typeof release.date === 'number' ? release.date * 1000 : Number.NaN;
   const dateLabel = Number.isFinite(timestampMs)
    ? formatCatalogDate(timestampMs, locale)
    : typeof release.human === 'string' && release.human.trim().length > 0
      ? release.human.trim()
      : null;
   if (!platformName || !dateLabel) return null;
   const regionCode =
    typeof release.region === 'number' ? (IGDB_REGION_NAMES[release.region] ?? null) : null;
   return {
    key: `${platformName}-${regionCode ?? ''}-${timestampMs || dateLabel}`,
    platformName,
    dateLabel,
    platformSlug: platformName,
    region: regionCode,
    sortValue: Number.isFinite(timestampMs) ? timestampMs : Number.MAX_SAFE_INTEGER,
   };
  })
  .filter(Boolean) as SortableReleaseDateItem[];
 items.sort((a, b) => a.sortValue - b.sortValue);

 const seen = new Set<string>();
 const deduped: GameCatalogReleaseDateItem[] = [];
 for (const item of items) {
  if (seen.has(item.key)) continue;
  seen.add(item.key);
  deduped.push({
   key: item.key,
   platformName: item.platformName,
   dateLabel: item.dateLabel,
   platformSlug: item.platformSlug,
   region: item.region,
  });
 }
 return deduped.slice(0, 20);
}

function asReleaseDates(value: JsonField, locale: string): string[] {
 return asReleaseDateItems(value, locale).map((item) => `${item.platformName} - ${item.dateLabel}`);
}

function asAgeRatingItems(value: JsonField): GameCatalogAgeRating[] {
 if (!Array.isArray(value)) return [];
 if (value.length > 0 && typeof value[0] === 'number') return [];
 const seen = new Set<string>();
 const items: GameCatalogAgeRating[] = [];

 for (const item of value) {
  if (typeof item === 'number' || !isAgeRating(item)) continue;
  const rating = item;
  const system =
   typeof (rating.organization ?? rating.category) === 'number'
    ? (AGE_CATEGORY_LABELS[rating.organization ?? rating.category] ??
      `System ${rating.organization ?? rating.category}`)
    : null;
  const ratingLabel =
   typeof (rating.rating_category ?? rating.rating) === 'number'
    ? (AGE_VALUE_LABELS[rating.rating_category ?? rating.rating] ??
      String(rating.rating_category ?? rating.rating))
    : null;
  if (!system && !ratingLabel) continue;
  const key = `${system ?? ''}-${ratingLabel ?? ''}`;
  if (seen.has(key)) continue;
  seen.add(key);
  items.push({
   key,
   system: system ?? '',
   rating: ratingLabel ?? '',
  });
 }

 return items;
}

function asMultiplayerModes(value: JsonField): GameCatalogLabel[] {
 const entries = Array.isArray(value)
  ? value.filter(isMultiplayerMode)
  : isMultiplayerMode(value)
    ? [value]
    : [];
 if (entries.length === 0) return [];
 const result = new Map<string, GameCatalogLabel>();

 const addLabel = (key: string, fallback: string, values?: Record<string, string | number>) => {
  if (result.has(key)) return;
  result.set(key, {
   translationKey: `gameDetail.multiplayerLabels.${key}`,
   fallback,
   values,
  });
 };

 for (const item of entries) {
  if (item.onlinecoop) addLabel('onlineCoop', 'Online co-op');
  if (item.offlinecoop) addLabel('offlineCoop', 'Local co-op');
  if (item.splitscreen) addLabel('splitScreen', 'Split-screen');
  if (item.splitscreenonline) addLabel('splitScreenOnline', 'Online split-screen');
  if (item.campaigncoop) addLabel('campaignCoop', 'Campaign co-op');
  if (item.dropin) addLabel('dropIn', 'Drop-in / drop-out');
  if (item.lancoop) addLabel('lanCoop', 'LAN co-op');
  if (typeof item.onlinemax === 'number' && item.onlinemax > 1) {
   addLabel('onlineMax', `Online multiplayer up to ${item.onlinemax}`, {
    count: item.onlinemax,
   });
  }
  if (typeof item.offlinemax === 'number' && item.offlinemax > 1) {
   addLabel('offlineMax', `Local multiplayer up to ${item.offlinemax}`, {
    count: item.offlinemax,
   });
  }
  if (typeof item.onlinecoopmax === 'number' && item.onlinecoopmax > 1) {
   addLabel('onlineCoopMax', `Online co-op up to ${item.onlinecoopmax}`, {
    count: item.onlinecoopmax,
   });
  }
  if (typeof item.offlinecoopmax === 'number' && item.offlinecoopmax > 1) {
   addLabel('offlineCoopMax', `Local co-op up to ${item.offlinecoopmax}`, {
    count: item.offlinecoopmax,
   });
  }
 }

 return Array.from(result.values());
}

function asLanguageSupportRows(value: JsonField) {
 const entries = Array.isArray(value)
  ? value.filter(isLanguageSupport)
  : isLanguageSupport(value)
    ? [value]
    : [];
 if (entries.length === 0) return [];
 const rows = new Map<
  string,
  {
   language: string;
   locale?: string | null;
   interface: boolean;
   audio: boolean;
   subtitles: boolean;
  }
 >();
 for (const item of entries) {
  const locale = item.language?.locale?.trim() ?? null;
  const regionCode = locale?.split(/[-_]/)[1]?.toUpperCase() ?? null;
  const baseLanguageName =
   item.language?.name?.trim() ??
   item.language?.native_name?.trim() ??
   item.language?.locale?.trim();
  const language =
   baseLanguageName && regionCode ? `${baseLanguageName} (${regionCode})` : baseLanguageName;
  const supportType = item.language_support_type?.name?.toLowerCase();
  if (!language || !supportType) continue;
  const rowKey = locale ?? language;
  const row = rows.get(rowKey) ?? {
   language,
   locale,
   interface: false,
   audio: false,
   subtitles: false,
  };
  if (supportType.includes('interface')) row.interface = true;
  if (supportType.includes('audio')) row.audio = true;
  if (supportType.includes('subtitle')) row.subtitles = true;
  rows.set(rowKey, row);
 }
 return Array.from(rows.values());
}

function asWebsiteItems(value: JsonField): GameCatalogLinkItem[] {
 if (!Array.isArray(value)) return [];
 const seen = new Set<string>();
 const items: GameCatalogLinkItem[] = [];

 for (const item of value) {
  if (!isWebsite(item)) continue;
  const website = item;
  const url = typeof website.url === 'string' ? website.url.trim() : null;
  if (!url || seen.has(url)) continue;

  const numericType =
   typeof website.type === 'number'
    ? website.type
    : website.type && typeof website.type === 'object' && typeof website.type.type === 'string'
      ? null
      : null;
  const namedType =
   website.type && typeof website.type === 'object' && typeof website.type.type === 'string'
    ? website.type.type.trim()
    : null;
  const label =
   namedType ||
   (typeof numericType === 'number' ? WEBSITE_TYPE_LABELS[numericType] : null) ||
   'Link';
  const category =
   typeof numericType === 'number' ? (WEBSITE_TYPE_CATEGORY[numericType] ?? null) : null;

  seen.add(url);
  items.push({
   title: label,
   subtitle: url,
   url,
   sourceKey:
    typeof numericType === 'number' ? String(numericType) : (namedType?.toLowerCase() ?? null),
   category,
  });
 }

 return items;
}

function asExternalStoreItems(value: JsonField): GameCatalogLinkItem[] {
 if (!Array.isArray(value)) return [];
 const seen = new Set<string>();
 const items: GameCatalogLinkItem[] = [];

 for (const item of value) {
  if (!isExternalGame(item)) continue;
  const external = item;
  const url = typeof external.url === 'string' ? external.url.trim() : null;
  if (!url || seen.has(url)) continue;

  const numericSource =
   typeof external.external_game_source === 'number' ? external.external_game_source : null;
  const namedSource =
   external.external_game_source &&
   typeof external.external_game_source === 'object' &&
   typeof external.external_game_source.name === 'string'
    ? external.external_game_source.name.trim()
    : null;
  const source =
   namedSource ||
   (typeof numericSource === 'number' ? EXTERNAL_SOURCE_LABELS[numericSource] : null) ||
   null;

  if (!source) continue;

  const name = typeof external.name === 'string' ? external.name.trim() : '';
  const category =
   typeof numericSource === 'number' ? (EXTERNAL_SOURCE_CATEGORY[numericSource] ?? null) : null;
  seen.add(url);
  items.push({
   title: source,
   subtitle: name || url,
   url,
   sourceKey:
    typeof numericSource === 'number'
     ? String(numericSource)
     : (namedSource?.toLowerCase() ?? null),
   category,
  });
 }

 return items;
}

export function getGameCatalogInfo(
 raw?: IgdbRawExtras | null,
 _locale: CatalogLocale = 'en',
): GameCatalogInfo {
 const extras = normalizeIgdbExtras(raw);
 const typeKey =
  typeof extras.game_type?.id === 'number'
   ? (IGDB_GAME_CATEGORY_TRANSLATION_KEYS[extras.game_type.id] ?? null)
   : typeof extras.category === 'number'
     ? (IGDB_GAME_CATEGORY_TRANSLATION_KEYS[extras.category] ?? null)
     : null;
 const typeValue = typeKey
  ? {
     translationKey: `gameDetail.gameTypes.${typeKey}`,
     fallback: typeKey,
    }
  : null;

 return {
  gameModes: asTranslatableNamedList(extras.game_modes, 'gameModes'),
  playerPerspectives: asTranslatableNamedList(extras.player_perspectives, 'playerPerspectives'),
  themes: asTranslatableNamedList(extras.themes, 'themes'),
  franchise: asFirstArrayName(extras.franchises) ?? asSingleName(extras.franchise),
  collection: asFirstArrayName(extras.collections) ?? asSingleName(extras.collection),
  alternativeNames: asAlternativeNames(extras.alternative_names),
  releaseDates: asReleaseDates(extras.release_dates, _locale),
  ageRatingItems: asAgeRatingItems(extras.age_ratings),
  typeValue,
  engines: asPlainNamedList(extras.game_engines),
  parentGame: asSingleName(extras.parent_game),
  multiplayer: asMultiplayerModes(extras.multiplayer_modes),
  languageSupportRows: asLanguageSupportRows(extras.language_supports),
  websites: asWebsiteItems(extras.websites).map((item) => `${item.title} - ${item.subtitle}`),
 };
}

export function getGameCatalogPrimaryReleaseDate(raw?: IgdbRawExtras | null, locale = 'en') {
 const extras = normalizeIgdbExtras(raw);
 if (typeof extras.first_release_date === 'number' && Number.isFinite(extras.first_release_date)) {
  return formatCatalogDate(extras.first_release_date * 1000, locale);
 }
 const items = asReleaseDateItems(extras.release_dates, locale);
 return items[0]?.dateLabel ?? null;
}

export function getGameCatalogStoryline(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 return typeof extras.storyline === 'string' ? extras.storyline.trim() || null : null;
}

export function getGameCatalogOverviewText(summary?: string | null, raw?: IgdbRawExtras | null) {
 const normalizedSummary = typeof summary === 'string' ? summary.trim() : '';
 if (normalizedSummary.length > 0) return normalizedSummary;
 return getGameCatalogStoryline(raw);
}

export function getGameCatalogFranchiseName(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 return asFirstArrayName(extras.franchises) ?? asSingleName(extras.franchise);
}

export function getGameCatalogRatings(raw?: IgdbRawExtras | null): GameCatalogScores {
 const extras = normalizeIgdbExtras(raw);
 const aggregated = typeof extras.aggregated_rating === 'number' ? extras.aggregated_rating : null;
 const aggregatedCount =
  typeof extras.aggregated_rating_count === 'number' ? extras.aggregated_rating_count : null;
 const total = typeof extras.total_rating === 'number' ? extras.total_rating : null;
 const totalCount =
  typeof extras.total_rating_count === 'number' ? extras.total_rating_count : null;

 return {
  overall: aggregated ?? total,
  aggregatedRating: aggregated,
  aggregatedRatingCount: aggregatedCount,
  totalRating: total,
  totalRatingCount: totalCount,
 };
}

export function getGameCatalogAgeRatingItems(raw?: IgdbRawExtras | null): GameCatalogAgeRating[] {
 const extras = normalizeIgdbExtras(raw);
 return asAgeRatingItems(extras.age_ratings);
}

export function getGameCatalogReleaseDateItems(raw?: IgdbRawExtras | null, locale = 'en') {
 const extras = normalizeIgdbExtras(raw);
 return asReleaseDateItems(extras.release_dates, locale);
}

export function getGameCatalogWebsiteItems(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 return asWebsiteItems(extras.websites);
}

export function getGameCatalogExternalStoreItems(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 return asExternalStoreItems(extras.external_games);
}

export function getGameCatalogAlternativeNames(raw?: IgdbRawExtras | null) {
 if (!raw) return [];
 return asAlternativeNames(raw.alternative_names);
}

export function hasGameCatalogInfoContent(raw?: IgdbRawExtras | null) {
 const info = getGameCatalogInfo(raw);
 return (
  info.gameModes.length > 0 ||
  info.playerPerspectives.length > 0 ||
  info.themes.length > 0 ||
  Boolean(info.franchise) ||
  Boolean(info.collection) ||
  info.releaseDates.length > 0 ||
  info.ageRatingItems.length > 0 ||
  info.engines.length > 0 ||
  Boolean(info.typeValue) ||
  Boolean(info.parentGame) ||
  info.multiplayer.length > 0 ||
  info.languageSupportRows.length > 0 ||
  info.websites.length > 0 ||
  getGameCatalogExternalStoreItems(raw).length > 0
 );
}

export function hasGameCatalogMedia(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 return Boolean(
  (extras.screenshots && extras.screenshots.length > 0) ||
   (extras.artworks && extras.artworks.length > 0) ||
   (extras.videos && extras.videos.length > 0),
 );
}

export function getIgdbNamedItemExternalId(
 raw: IgdbRawExtras | null,
 key: 'genres' | 'developers' | 'publishers',
 index = 0,
) {
 if (!raw) return null;
 const extras = raw;

 if (key === 'genres') {
  const values = extras.genres;
  if (!Array.isArray(values)) return null;
  const item = values[index];
  const id = item?.id;
  return id !== undefined && id !== null ? String(id) : null;
 }

 const involvedCompanies = extras.involved_companies;
 if (!Array.isArray(involvedCompanies)) return null;

 const matches = involvedCompanies.filter((entry) =>
  key === 'developers' ? Boolean(entry?.developer) : Boolean(entry?.publisher),
 );
 const match = matches[index];
 const id = match?.company?.id;
 return id !== undefined && id !== null ? String(id) : null;
}

export function getIgdbCategoryTranslationKey(raw: IgdbRawExtras | null) {
 if (!raw) return null;
 const extras = raw;
 const category = extras.game_type?.id ?? extras.category;
 if (typeof category === 'number') {
  return IGDB_GAME_CATEGORY_TRANSLATION_KEYS[category] ?? null;
 }

 return extras.relationKind ?? null;
}

export function getGameCatalogReleaseStatusKey(raw?: IgdbRawExtras | null) {
 const extras = normalizeIgdbExtras(raw);
 const status = getIgdbStatusName(extras);
 if (status) return normalizeReleaseStatusKey(status);

 if (typeof extras.first_release_date === 'number') {
  const releaseMs = extras.first_release_date * 1000;
  return releaseMs > Date.now() ? 'upcoming' : 'released';
 }
 return null;
}

export function getGameCatalogReleaseStatusLabel(
 raw: IgdbRawExtras | null,
 translate: (key: string, options?: TranslationValues) => string,
) {
 const extras = normalizeIgdbExtras(raw);
 const status = getIgdbStatusName(extras);
 if (status) {
  const statusKey = normalizeReleaseStatusKey(status);
  return translate(`gameDetail.releaseStatuses.${statusKey}`, { defaultValue: status });
 }
 if (typeof extras.first_release_date === 'number') {
  const releaseMs = extras.first_release_date * 1000;
  const key = releaseMs > Date.now() ? 'upcoming' : 'released';
  return translate(`gameDetail.releaseStatuses.${key}`, {
   defaultValue: key === 'upcoming' ? 'Upcoming' : 'Released',
  });
 }
 return null;
}

export function getCatalogGameCategoryTranslationKey(game?: Pick<CatalogGame, 'metadata'> | null) {
 return getIgdbCategoryTranslationKey(game?.metadata?.raw ?? null);
}

export function getGameCatalogParentPlatformItems(
 platforms: Array<{ name?: string | null } | string>,
) {
 const seen = new Set<string>();
 const items: Array<{ slug: string; name: string }> = [];

 for (const value of platforms) {
  const platformName =
   typeof value === 'string'
    ? value.trim()
    : typeof value?.name === 'string'
      ? value.name.trim()
      : '';
  if (!platformName) continue;

  const rule = PARENT_PLATFORM_RULES.find((entry) => entry.test.test(platformName));
  if (!rule || seen.has(rule.slug)) continue;

  seen.add(rule.slug);
  items.push({ slug: rule.slug, name: rule.name });
 }

 return items;
}

function hasTheme(raw: IgdbRawExtras | null | undefined, matcher: RegExp) {
 return (raw?.themes ?? []).some((theme) => matcher.test(theme.name ?? ''));
}

function hasPerspective(raw: IgdbRawExtras | null | undefined, matcher: RegExp) {
 return (raw?.player_perspectives ?? []).some((perspective) =>
  matcher.test(perspective.name ?? ''),
 );
}

function hasGameMode(raw: IgdbRawExtras | null | undefined, matcher: RegExp) {
 return (raw?.game_modes ?? []).some((mode) => matcher.test(mode.name ?? ''));
}

function getMultiplayerEntries(raw: IgdbRawExtras | null | undefined) {
 const value = raw?.multiplayer_modes;
 return Array.isArray(value) ? value : value ? [value] : [];
}

function hasLocalCoop(raw: IgdbRawExtras | null | undefined) {
 return getMultiplayerEntries(raw).some(
  (entry) =>
   Boolean(entry.offlinecoop) ||
   Boolean(entry.splitscreen) ||
   (typeof entry.offlinecoopmax === 'number' && entry.offlinecoopmax > 1) ||
   (typeof entry.offlinemax === 'number' && entry.offlinemax > 1),
 );
}

function hasOnlineCoop(raw: IgdbRawExtras | null | undefined) {
 return getMultiplayerEntries(raw).some(
  (entry) =>
   Boolean(entry.onlinecoop) ||
   (typeof entry.onlinecoopmax === 'number' && entry.onlinecoopmax > 1),
 );
}

function hasCompetitiveOnline(raw: IgdbRawExtras | null | undefined) {
 return getMultiplayerEntries(raw).some(
  (entry) => !entry.onlinecoop && typeof entry.onlinemax === 'number' && entry.onlinemax > 1,
 );
}

export function getGameEditorialPlaystyle(
 raw: IgdbRawExtras | null,
 translate: TranslateFn,
 locale: CatalogLocale = 'en',
): GameEditorialCardContent | null {
 const info = getGameCatalogInfo(raw, locale);
 const gameModes = resolveCatalogLabels(info.gameModes, translate);
 const perspectives = resolveCatalogLabels(info.playerPerspectives, translate);
 const themes = resolveCatalogLabels(info.themes, translate);
 const multiplayer = resolveCatalogLabels(info.multiplayer, translate);

 const rows: GameEditorialRow[] = [];
 if (gameModes.length > 0) {
  rows.push({
   key: 'modes',
   label: translate('gameDetail.editorial.playstyle.modeLabel', {
    defaultValue: 'Modalità',
   }),
   value: joinEditorialValues(gameModes, 3),
   items: gameModes,
  });
 }
 if (perspectives.length > 0) {
  rows.push({
   key: 'perspective',
   label: translate('gameDetail.editorial.playstyle.perspectiveLabel', {
    defaultValue: 'Prospettiva',
   }),
   value: joinEditorialValues(perspectives, 2),
   items: perspectives,
  });
 }
 if (themes.length > 0) {
  rows.push({
   key: 'themes',
   label: translate('gameDetail.editorial.playstyle.themeLabel', {
    defaultValue: 'Temi',
   }),
   value: joinEditorialValues(themes, 2),
   items: themes,
  });
 }
 if (multiplayer.length > 0) {
  rows.push({
   key: 'multiplayer',
   label: translate('gameDetail.editorial.playstyle.multiplayerLabel', {
    defaultValue: 'Multiplayer',
   }),
   value: joinEditorialValues(multiplayer, 2),
   items: multiplayer,
  });
 }

 const subtitleParts = [themes[0] ?? null, perspectives[0] ?? null, gameModes[0] ?? null].filter(
  (value): value is string => Boolean(value),
 );

 if (rows.length === 0) return null;

 return {
  subtitle: subtitleParts.length > 0 ? subtitleParts.join(' • ') : null,
  rows,
 };
}

function hasSharedUniverseName(current: CatalogGameDetail, candidate: CatalogGame) {
 const currentCollections = new Set(
  [
   ...(current.collections ?? []),
   ...(current.metadata?.collections ?? []),
   ...getNamedItemNames(current.metadata?.raw?.collections),
  ].filter(Boolean),
 );
 const candidateCollections = new Set(
  [
   ...(candidate.metadata?.collections ?? []),
   ...getNamedItemNames(candidate.metadata?.raw?.collections),
  ].filter(Boolean),
 );
 if (currentCollections.size > 0 && candidateCollections.size > 0) {
  for (const name of currentCollections) {
   if (candidateCollections.has(name)) return true;
  }
 }

 const currentFranchises = new Set(
  [
   ...(current.franchises ?? []),
   ...(current.metadata?.franchises ?? []),
   ...getNamedItemNames(current.metadata?.raw?.franchises),
  ].filter(Boolean),
 );
 const candidateFranchises = new Set(
  [
   ...(candidate.metadata?.franchises ?? []),
   ...getNamedItemNames(candidate.metadata?.raw?.franchises),
  ].filter(Boolean),
 );
 for (const name of currentFranchises) {
  if (candidateFranchises.has(name)) return true;
 }

 return false;
}

function normalizeSeriesRoot(value: string) {
 const trimmed = value.trim().toLowerCase();
 const head = trimmed.split(':')[0]?.trim() ?? trimmed;
 return head
  .replace(
   /\b(ultimate|deluxe|complete|definitive|gold|special|hd|remastered|remake|edition)\b/g,
   '',
  )
  .replace(/\s+/g, ' ')
  .trim();
}

function parseSeriesSequenceToken(value: string) {
 const match = normalizeSeriesRoot(value).match(/^(.*?)(?:\s+)(\d+|[ivxlcdm]+)$/i);
 if (!match) {
  return {
   root: normalizeSeriesRoot(value),
   sequence: null as number | null,
  };
 }

 const [, rawRoot, rawSequence] = match;
 const numericSequence = /^\d+$/.test(rawSequence)
  ? Number(rawSequence)
  : romanToNumber(rawSequence);
 return {
  root: normalizeSeriesRoot(rawRoot),
  sequence: Number.isFinite(numericSequence) ? numericSequence : null,
 };
}

function romanToNumber(value: string) {
 const numerals: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
 };
 const chars = value.trim().toLowerCase().split('');
 let total = 0;
 for (let index = 0; index < chars.length; index += 1) {
  const current = numerals[chars[index]] ?? 0;
  const next = numerals[chars[index + 1]] ?? 0;
  total += current < next ? -current : current;
 }
 return total;
}

function hasSharedSeriesTitle(current: CatalogGameDetail, candidate: CatalogGame) {
 const currentRoot = normalizeSeriesRoot(current.name);
 const candidateRoot = normalizeSeriesRoot(candidate.name);
 if (!currentRoot || !candidateRoot) return false;
 return (
  candidateRoot === currentRoot ||
  candidateRoot.startsWith(`${currentRoot} `) ||
  candidate.name.toLowerCase().includes(currentRoot)
 );
}

function isMainlineSeriesCandidate(game: CatalogGame) {
 const categoryKey = getCatalogGameCategoryTranslationKey(game);
 return categoryKey ? MAINLINE_SERIES_CATEGORY_KEYS.has(categoryKey) : true;
}

export function getGameEditorialSeriesNeighbors(
 game: CatalogGameDetail,
 relatedSeriesGames: CatalogGame[] = [],
) {
 const seriesName = game.franchises[0] ?? game.metadata?.franchises?.[0] ?? null;
 const currentRelease = getComparableReleaseTimestamp(game);
 const baseCandidates = relatedSeriesGames
  .filter((item) => isMainlineSeriesCandidate(item))
  .map((item) => ({ item, releaseAt: getComparableReleaseTimestamp(item) }))
  .filter((entry) => Number.isFinite(entry.releaseAt))
  .sort((left, right) => left.releaseAt - right.releaseAt);

 const universeCandidates = baseCandidates.filter((entry) =>
  hasSharedUniverseName(game, entry.item),
 );
 const titleCandidates = baseCandidates.filter((entry) => hasSharedSeriesTitle(game, entry.item));
 const candidates =
  universeCandidates.length > 0
   ? universeCandidates
   : titleCandidates.length > 0
     ? titleCandidates
     : baseCandidates;

 const currentSeries = parseSeriesSequenceToken(game.name);
 const numberedCandidates = candidates
  .map((entry) => ({
   ...entry,
   parsed: parseSeriesSequenceToken(entry.item.name),
  }))
  .filter((entry) => entry.parsed.root === currentSeries.root);

 const exactPrequel =
  currentSeries.sequence && currentSeries.sequence > 1
   ? (numberedCandidates.find((entry) => entry.parsed.sequence === currentSeries.sequence - 1)
      ?.item ?? null)
   : null;
 const exactSequel = currentSeries.sequence
  ? (numberedCandidates.find((entry) => entry.parsed.sequence === currentSeries.sequence + 1)
     ?.item ?? null)
  : null;

 const unnumberedPrequel =
  currentSeries.sequence === 2
   ? (numberedCandidates.find(
      (entry) =>
       entry.parsed.sequence === null &&
       normalizeSeriesRoot(entry.item.name) === currentSeries.root,
     )?.item ?? null)
   : null;

 const prequel =
  exactPrequel ??
  unnumberedPrequel ??
  (Number.isFinite(currentRelease)
   ? ([...candidates].reverse().find((entry) => entry.releaseAt < currentRelease)?.item ?? null)
   : null);
 const sequel =
  exactSequel ??
  (Number.isFinite(currentRelease)
   ? (candidates.find((entry) => entry.releaseAt > currentRelease)?.item ?? null)
   : null);

 return {
  seriesName,
  prequel,
  sequel,
 };
}

export function getGameEditorialPlacement(
 game: CatalogGameDetail,
 translate: TranslateFn,
 relatedSeriesGames: CatalogGame[] = [],
): GameEditorialCardContent | null {
 const { seriesName, prequel, sequel } = getGameEditorialSeriesNeighbors(game, relatedSeriesGames);
 const collectionName = game.collections[0] ?? game.metadata?.collections?.[0] ?? null;
 const typeName = game.metadata?.gameType ?? null;
 const linkedTo = game.versionParentName ?? game.parentGameName ?? null;
 const versionTitle = game.versionTitle ?? null;
 const versionFamilyCount = game.versionFamilyCount ?? null;

 const rows: GameEditorialRow[] = [];
 if (seriesName) {
  rows.push({
   key: 'series',
   label: translate('gameDetail.editorial.placement.seriesLabel', {
    defaultValue: 'Serie',
   }),
   value: seriesName,
  });
 }
 if (collectionName) {
  rows.push({
   key: 'collection',
   label: translate('gameDetail.editorial.placement.collectionLabel', {
    defaultValue: 'Collezione',
   }),
   value: collectionName,
  });
 }
 if (typeName) {
  rows.push({
   key: 'type',
   label: translate('gameDetail.editorial.placement.typeLabel', {
    defaultValue: 'Tipo',
   }),
   value: typeName,
  });
 }
 if (versionTitle) {
  rows.push({
   key: 'version-title',
   label: translate('gameDetail.editorial.placement.versionLabel', {
    defaultValue: 'Versione',
   }),
   value: versionTitle,
  });
 }
 if (linkedTo) {
  rows.push({
   key: 'linked-to',
   label: translate('gameDetail.editorial.placement.linkedToLabel', {
    defaultValue: 'Collegato a',
   }),
   value: linkedTo,
  });
 }
 if (prequel?.name) {
  rows.push({
   key: 'prequel',
   label: translate('gameDetail.editorial.placement.prequelLabel', {
    defaultValue: 'Prequel',
   }),
   value: prequel.name,
  });
 }
 if (sequel?.name) {
  rows.push({
   key: 'sequel',
   label: translate('gameDetail.editorial.placement.sequelLabel', {
    defaultValue: 'Sequel',
   }),
   value: sequel.name,
  });
 }
 if (versionFamilyCount && versionFamilyCount > 1) {
  rows.push({
   key: 'version-family',
   label: translate('gameDetail.editorial.placement.versionFamilyLabel', {
    defaultValue: 'Versioni',
   }),
   value: translate('gameDetail.editorial.placement.versionFamilyValue', {
    count: versionFamilyCount,
    defaultValue: `${versionFamilyCount} versioni collegate`,
   }),
  });
 }

 const subtitle = versionTitle
  ? translate('gameDetail.editorial.placement.versionSubtitle', {
     version: versionTitle,
     defaultValue: `Versione ${versionTitle}`,
    })
  : seriesName
    ? translate('gameDetail.editorial.placement.seriesSubtitle', {
       name: seriesName,
       defaultValue: `Parte della serie ${seriesName}`,
      })
    : collectionName
      ? translate('gameDetail.editorial.placement.collectionSubtitle', {
         name: collectionName,
         defaultValue: `Si colloca nella collezione ${collectionName}`,
        })
      : linkedTo
        ? translate('gameDetail.editorial.placement.linkedSubtitle', {
           name: linkedTo,
           defaultValue: `Collegato a ${linkedTo}`,
          })
        : null;

 if (rows.length === 0) return null;

 return {
  subtitle,
  rows,
 };
}

export function getGameEditorialAudience(
 game: CatalogGameDetail,
 raw: IgdbRawExtras | null,
 translate: TranslateFn,
): GameEditorialCardContent | null {
 const extras = asIgdbExtras(raw ?? game.metadata?.raw ?? null);
 const bullets: string[] = [];

 const pushBullet = (value: string) => {
  if (!bullets.includes(value) && bullets.length < 3) {
   bullets.push(value);
  }
 };

 if (hasLocalCoop(extras)) {
  pushBullet(
   translate('gameDetail.editorial.audience.localCoop', {
    defaultValue: 'Ideale per co-op locale',
   }),
  );
 }

 if (hasOnlineCoop(extras) && bullets.length < 3) {
  pushBullet(
   translate('gameDetail.editorial.audience.onlineCoop', {
    defaultValue: 'Perfetto da giocare in compagnia online',
   }),
  );
 }

 if (hasTheme(extras, /horror/i) && hasPerspective(extras, /third-person/i)) {
  pushBullet(
   translate('gameDetail.editorial.audience.thirdPersonHorror', {
    defaultValue: 'Horror in terza persona con forte atmosfera',
   }),
  );
 }

 if (hasTheme(extras, /(science fiction|sci-fi|scifi)/i)) {
  pushBullet(
   translate('gameDetail.editorial.audience.scifi', {
    defaultValue: 'Perfetto per chi ama la fantascienza',
   }),
  );
 }

 if (
  hasGameMode(extras, /(single player|singleplayer)/i) &&
  typeof extras?.storyline === 'string' &&
  extras.storyline.trim().length > 0
 ) {
  pushBullet(
   translate('gameDetail.editorial.audience.singlePlayerStory', {
    defaultValue: 'Ideale se cerchi una campagna single player',
   }),
  );
 }

 if (hasCompetitiveOnline(extras)) {
  pushBullet(
   translate('gameDetail.editorial.audience.competitive', {
    defaultValue: 'Adatto a sessioni competitive online',
   }),
  );
 }

 if (hasTheme(extras, /sandbox|open world/i)) {
  pushBullet(
   translate('gameDetail.editorial.audience.exploration', {
    defaultValue: 'Ottimo se ti piace sperimentare e esplorare',
   }),
  );
 }

 if (hasTheme(extras, /strategy|4x|business/i)) {
  pushBullet(
   translate('gameDetail.editorial.audience.strategy', {
    defaultValue: 'Pensato per chi ama pianificare e ragionare',
   }),
  );
 }

 if (bullets.length === 0 && hasTheme(extras, /action/i)) {
  pushBullet(
   translate('gameDetail.editorial.audience.action', {
    defaultValue: 'Ideale per chi cerca ritmo e azione immediata',
   }),
  );
 }

 return bullets.length > 0
  ? {
     subtitle:
      bullets.length > 1
       ? translate('gameDetail.editorial.audience.subtitle', {
          defaultValue: 'Un colpo d’occhio rapido su chi potrebbe amarlo di più.',
         })
       : null,
     bullets,
    }
  : null;
}

export function getGameEditorialReleaseReadiness(
 game: CatalogGameDetail,
 translate: TranslateFn,
 locale = 'en',
): GameEditorialCardContent | null {
 const readiness: GameReleaseReadiness | null =
  game.releaseReadiness ?? game.metadata?.releaseReadiness ?? null;
 if (!readiness) return null;

 const statusValue =
  getGameCatalogReleaseStatusLabel(game.metadata?.raw ?? null, translate) ??
  game.metadata?.releaseStatus ??
  null;

 if (readiness.isReleased && !readiness.hasFutureReleaseDates) {
  return null;
 }

 const rows: GameEditorialRow[] = [];

 if (statusValue) {
  rows.push({
   key: 'status',
   label: translate('gameDetail.editorial.releaseReadiness.statusLabel', {
    defaultValue: 'Stato',
   }),
   value: statusValue,
  });
 }

 const nextRelease = readiness.nextReleaseAt
  ? formatDate(readiness.nextReleaseAt, locale, {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
    })
  : null;
 if (nextRelease) {
  rows.push({
   key: 'next-release',
   label: translate('gameDetail.editorial.releaseReadiness.nextReleaseLabel', {
    defaultValue: 'Prima uscita utile',
   }),
   value: nextRelease,
  });
 }

 if (readiness.upcomingReleasePlatforms.length > 0) {
  rows.push({
   key: 'announced-platforms',
   label: translate('gameDetail.editorial.releaseReadiness.platformsLabel', {
    defaultValue: 'Piattaforme annunciate',
   }),
   value: joinEditorialValues(readiness.upcomingReleasePlatforms, 3),
  });
 }

 if (typeof game.follows === 'number' && game.follows > 0) {
  rows.push({
   key: 'follows',
   label: translate('gameDetail.editorial.releaseReadiness.followsLabel', {
    defaultValue: 'Follows',
   }),
   value: game.follows.toLocaleString(locale),
  });
 }

 if (typeof game.hypes === 'number' && game.hypes > 0) {
  rows.push({
   key: 'hypes',
   label: translate('gameDetail.editorial.releaseReadiness.hypesLabel', {
    defaultValue: 'Hypes',
   }),
   value: game.hypes.toLocaleString(locale),
  });
 }

 return rows.length > 0
  ? {
     subtitle:
      nextRelease && readiness.upcomingReleasePlatforms.length > 0
       ? translate('gameDetail.editorial.releaseReadiness.subtitle', {
          date: nextRelease,
          defaultValue: `In arrivo il ${nextRelease}`,
         })
       : null,
     rows,
    }
  : null;
}
