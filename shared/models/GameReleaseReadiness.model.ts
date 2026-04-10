export type GameReleaseReadiness = {
 isReleased: boolean;
 nextReleaseAt: string | null;
 hasFutureReleaseDates: boolean;
 upcomingReleasePlatforms: string[];
};
