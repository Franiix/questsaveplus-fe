import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

export type BacklogReleaseContext = {
 releasedAt?: string | null;
 releaseStatusKey?: string | null;
 firstReleaseDate?: number | null;
};

const RELEASE_REQUIRED_STATUSES = new Set<BacklogStatusEnum>([
 BacklogStatusEnum.PLAYING,
 BacklogStatusEnum.ONGOING,
 BacklogStatusEnum.COMPLETED,
 BacklogStatusEnum.ABANDONED,
]);

function normalizeReleaseStatusKey(value?: string | null) {
 if (!value) return null;
 return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function toUtcDateStartMs(value: Date | string | number) {
 const date = value instanceof Date ? value : new Date(value);
 const timestamp = date.getTime();
 if (!Number.isFinite(timestamp)) return Number.NaN;

 return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getReleaseDate(value: BacklogReleaseContext): Date | null {
 if (value.releasedAt) {
  const releasedAtMs = Date.parse(value.releasedAt);
  if (Number.isFinite(releasedAtMs)) {
   return new Date(releasedAtMs);
  }
 }

 if (typeof value.firstReleaseDate === 'number' && Number.isFinite(value.firstReleaseDate)) {
  return new Date(value.firstReleaseDate * 1000);
 }

 return null;
}

export function isBacklogStatusReleaseLocked(
 status: BacklogStatusEnum,
 releaseContext: BacklogReleaseContext,
 nowMs = Date.now(),
) {
 if (!RELEASE_REQUIRED_STATUSES.has(status)) {
  return false;
 }

 const releaseDate = getReleaseDate(releaseContext);
 if (releaseDate) {
  return releaseDate.getTime() > nowMs;
 }

 const statusKey = normalizeReleaseStatusKey(releaseContext.releaseStatusKey);
 if (!statusKey) {
  return true;
 }

 return statusKey !== 'released' && statusKey !== 'early_access';
}

export function isStartedAtBeforeRelease(
 startedAt: string | null | undefined,
 releaseContext: BacklogReleaseContext,
) {
 if (!startedAt) return false;

 const releaseDate = getReleaseDate(releaseContext);
 if (!releaseDate) return false;

 return toUtcDateStartMs(startedAt) < toUtcDateStartMs(releaseDate);
}

