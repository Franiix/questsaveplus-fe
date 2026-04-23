import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, {
 useAnimatedStyle,
 useSharedValue,
 withSequence,
 withSpring,
 withTiming,
} from 'react-native-reanimated';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { MetacriticBadge } from '@/components/base/display/MetacriticBadge';
import { PlatformIconRow } from '@/components/base/display/PlatformIconRow';
import { RatingBadge } from '@/components/base/display/RatingBadge';
import { useSingleAction } from '@/hooks/useSingleAction';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';

// ─── Status dot ──────────────────────────────────────────────────────────────

function statusDotColor(status: string): string {
 switch (status.toLowerCase()) {
  case 'wishlist':
   return colors.status.wishlist;
  case 'want_to_play':
   return colors.status.want_to_play;
  case 'playing':
   return colors.status.playing;
  case 'ongoing':
   return colors.status.ongoing;
  case 'completed':
   return colors.status.completed;
  case 'abandoned':
   return colors.status.abandoned;
  default:
   return colors.primary.DEFAULT;
 }
}

// ─── Release date formatter ───────────────────────────────────────────────────

function formatReleaseDate(dateStr: string, locale: string): string {
 try {
  const d = new Date(dateStr);
  const jsLocale = locale.startsWith('it') ? 'it-IT' : 'en-GB';
  return d.toLocaleDateString(jsLocale, { day: 'numeric', month: 'short', year: 'numeric' });
 } catch {
  return dateStr.substring(0, 4);
 }
}

// ─── Component ────────────────────────────────────────────────────────────────

export type GameCardItem = CatalogGame;

type GameCardProps = {
 game: GameCardItem;
 width: number;
 onPress?: (game: GameCardItem) => void;
 onPressIn?: (game: GameCardItem) => void;
 onLongPress?: (game: GameCardItem) => void;
 backlogStatus?: string | null;
};

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

function getGameBackgroundImage(game: GameCardItem) {
 return game.backgroundImage?.url ?? game.coverImage?.url ?? null;
}

function getGameReleasedAt(game: GameCardItem) {
 return game.releasedAt ?? null;
}

function getGameDisplayRating(game: GameCardItem) {
 if (typeof game.rating === 'number' && game.rating > 0 && game.rating <= 5) {
  return Math.round(game.rating * 2) / 2;
 }
 return null;
}

function getGameMetacritic(game: GameCardItem) {
 return game.criticScore ?? null;
}

function getGamePrimaryGenre(game: GameCardItem) {
 return game.genres[0] ?? null;
}

export const GameCard = memo(function GameCard({
 game,
 width,
 onPress,
 onPressIn,
 onLongPress,
 backlogStatus,
}: GameCardProps) {
 const { t, i18n } = useTranslation();
 const cardHeight = Math.round(width * 1.42);
 const displayRating = getGameDisplayRating(game);
 const releasedAt = getGameReleasedAt(game);
 const releaseDate = releasedAt ? formatReleaseDate(releasedAt, i18n.language) : null;
 const metacritic = getGameMetacritic(game);
 const hasPlatforms = game.platforms && game.platforms.length > 0;
 const primaryGenre = getGamePrimaryGenre(game);
 const genre = primaryGenre
  ? t(`genres.${primaryGenre.slug}`, { defaultValue: primaryGenre.name })
  : null;

 // ── Spring press animation ──────────────────────────────────────────────────
 const scale = useSharedValue(1);
 const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

 // ── Status dot pulse for "playing" ──────────────────────────────────────────
 const isPlaying = backlogStatus?.toLowerCase() === 'playing';
 const dotOpacity = useSharedValue(1);

 useEffect(() => {
  if (isPlaying) {
   dotOpacity.value = withSequence(
    withTiming(0.45, { duration: 700 }),
    withTiming(1, { duration: 700 }),
   );
  } else {
   dotOpacity.value = 1;
  }
 }, [isPlaying, dotOpacity]);

 const dotAnimStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));
 const { isLocked, run } = useSingleAction(onPress ? () => onPress(game) : null);
 const { run: runLongPress } = useSingleAction(onLongPress ? () => onLongPress(game) : null, {
  cooldownMs: 1200,
 });

 const dotColor = backlogStatus ? statusDotColor(backlogStatus) : null;

 return (
  <Pressable
   onPress={run}
   onLongPress={runLongPress}
   disabled={isLocked}
   delayLongPress={400}
   onPressIn={() => {
    onPressIn?.(game);
    scale.value = withSpring(0.96, SPRING_CONFIG);
   }}
   onPressOut={() => {
    scale.value = withSpring(1.0, SPRING_CONFIG);
   }}
  >
   <Animated.View
    style={[
     cardStyle,
     {
      width,
      height: cardHeight,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: colors.background.surface,
      opacity: isLocked ? 0.78 : 1,
     },
    ]}
   >
    {/* Full-bleed image */}
    <ImageWithFallback
     uri={getGameBackgroundImage(game)}
     width={width}
     height={cardHeight}
     radius={0}
     style={{ position: 'absolute', top: 0, left: 0 }}
    />

    {/* Gradient scrim — bottom 72% */}
    <LinearGradient
     colors={['transparent', 'rgba(8,8,16,0.60)', 'rgba(8,8,16,0.97)']}
     locations={[0.35, 0.65, 1.0]}
     style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: cardHeight * 0.72 }}
    />

    {/* Status dot — top-right */}
    {dotColor !== null && (
     <Animated.View
      style={[
       {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: dotColor,
        shadowColor: dotColor,
        shadowOpacity: 0.8,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
       },
       dotAnimStyle,
      ]}
     />
    )}

    {/* Metacritic badge — top-left */}
    {metacritic !== null && (
     <View style={{ position: 'absolute', top: spacing.sm, left: spacing.sm }}>
      <MetacriticBadge score={metacritic} size="sm" />
     </View>
    )}

    {/* Content area — absolute bottom */}
    <View
     style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: spacing.sm,
      gap: 4,
     }}
    >
     {/* Genre micro-label */}
     {genre ? (
      <Text
       numberOfLines={1}
       style={{
        color: colors.primary['300'],
        fontSize: typography.size['2xs'],
        fontFamily: typography.font.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
       }}
      >
       {genre}
      </Text>
     ) : null}

     {/* Title */}
     <Text
      numberOfLines={2}
      style={{
       color: colors.text.primary,
       fontSize: typography.size.md,
       fontFamily: typography.font.bold,
       lineHeight: Math.ceil(typography.size.md * 1.25),
      }}
     >
      {game.name}
     </Text>

     {/* Footer: platforms + year (left) | rating (right) */}
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       marginTop: 2,
      }}
     >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 }}>
       {hasPlatforms && game.platforms ? (
        <PlatformIconRow platforms={game.platforms} maxIcons={4} size={11} />
       ) : null}
       {releaseDate ? (
        <Text
         numberOfLines={1}
         allowFontScaling={false}
         style={{
          color: colors.text.secondary,
          fontSize: typography.size.xs,
          marginLeft: hasPlatforms ? 2 : 0,
          flexShrink: 1,
         }}
        >
         {releaseDate}
        </Text>
       ) : null}
      </View>

      {displayRating !== null ? <RatingBadge rating={displayRating} size="sm" /> : null}
     </View>
    </View>
   </Animated.View>
  </Pressable>
 );
});
