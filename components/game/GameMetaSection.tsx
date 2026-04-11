import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, {
 Easing,
 runOnJS,
 useAnimatedReaction,
 useAnimatedStyle,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameMetaSectionProps = {
 criticRating: number | null;
 criticRatingCount: number | null;
 igdbCommunityRating: number | null;
 igdbCommunityRatingCount: number | null;
 isQuestSaveRatingLoading?: boolean;
 questSaveRating: number | null;
 questSaveRatingCount: number;
 releaseDate?: string | null;
 developerName?: string | null;
 publisherName?: string | null;
 onDeveloperPress?: (() => void) | null;
 onPublisherPress?: (() => void) | null;
};

type ScoreCardProps = {
 title: string;
 value: number | null;
 format: 'percent' | 'five-point';
 caption: string;
 accentColor: string;
 backgroundColor: string;
 borderColor: string;
};

type MetaLineProps = {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 label: string;
 value: string;
 onPress?: (() => void) | null;
};

type MetaSectionItem = {
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 label: string;
 value: string;
 onPress?: (() => void) | null;
};

function AnimatedScoreValue({
 value,
 format,
 color,
}: {
 value: number | null;
 format: 'percent' | 'five-point';
 color: string;
}) {
 const animatedValue = useSharedValue(0);
 const glow = useSharedValue(0);
 const [displayValue, setDisplayValue] = useState(0);

 useAnimatedReaction(
  () => animatedValue.value,
  (current, previous) => {
   if (current !== previous) {
    runOnJS(setDisplayValue)(current);
   }
  },
 );

 useEffect(() => {
  if (value === null) {
   animatedValue.value = 0;
   setDisplayValue(0);
   return;
  }

  animatedValue.value = withTiming(value, {
   duration: 1400,
   easing: Easing.out(Easing.cubic),
  });
  glow.value = 0;
  glow.value = withTiming(1, { duration: 280 }, () => {
   glow.value = withTiming(0, { duration: 700 });
  });
 }, [animatedValue, glow, value]);

 const animatedStyle = useAnimatedStyle(() => ({
  opacity: value === null ? 1 : 0.88 + glow.value * 0.12,
  transform: [{ scale: 1 + glow.value * 0.035 }],
 }));

 const text =
  value === null
   ? '--'
   : format === 'percent'
     ? `${Math.round(displayValue)}%`
     : `${displayValue.toFixed(1)}/5`;

 return (
  <Animated.Text
   style={[
    {
     color,
     fontSize: typography.size.xl,
     fontFamily: typography.font.bold,
    },
    animatedStyle,
   ]}
  >
   {text}
  </Animated.Text>
 );
}

function MetaLine({ icon, label, value, onPress }: MetaLineProps) {
 const content = (
  <>
   <View style={{ width: 18, alignItems: 'center' }}>
    <FontAwesome5 name={icon} size={13} color={colors.text.tertiary} solid />
   </View>
   <Text
    style={{
     flex: 1,
     color: colors.text.secondary,
     fontSize: typography.size.sm,
     fontFamily: typography.font.regular,
    }}
   >
    <Text
     style={{
      color: colors.text.tertiary,
      fontFamily: typography.font.medium,
     }}
    >
     {label}:{' '}
    </Text>
    <Text
     style={
      onPress
       ? {
          color: colors.primary['200'],
          fontFamily: typography.font.semibold,
         }
       : undefined
     }
    >
     {value}
    </Text>
   </Text>
   {onPress ? <FontAwesome5 name="chevron-right" size={11} color={colors.text.tertiary} /> : null}
  </>
 );

 if (onPress) {
  return (
   <Pressable
    onPress={onPress}
    style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
   >
    {content}
   </Pressable>
  );
 }

 return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>{content}</View>
 );
}

function ScoreCard({
 title,
 value,
 format,
 caption,
 accentColor,
 backgroundColor,
 borderColor,
}: ScoreCardProps) {
 return (
  <View
   style={{
    flex: 1,
    minHeight: 112,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor,
    borderWidth: 1,
    borderColor,
    justifyContent: 'space-between',
    gap: spacing.sm,
   }}
  >
   <Text
    style={{
     color: colors.text.tertiary,
     fontSize: typography.size.xs,
     fontFamily: typography.font.semibold,
     textTransform: 'uppercase',
     letterSpacing: typography.letterSpacing.wide,
    }}
   >
    {title}
   </Text>

   <AnimatedScoreValue value={value} format={format} color={accentColor} />

   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.sm,
     fontFamily: typography.font.medium,
    }}
   >
    {caption}
   </Text>
  </View>
 );
}

function getRatingsCaption(
 t: ReturnType<typeof useTranslation>['t'],
 count: number | null | undefined,
 isLoading = false,
) {
 if (isLoading) {
  return '...';
 }

 if (count && count > 0) {
  return t('gameDetail.ratingsCount', {
   count,
   defaultValue: `${count}`,
  });
 }

 return t('gameDetail.noVotes');
}

export function GameMetaSection({
 criticRating,
 criticRatingCount,
 igdbCommunityRating,
 igdbCommunityRatingCount,
 isQuestSaveRatingLoading = false,
 questSaveRating,
 questSaveRatingCount,
 releaseDate,
 developerName,
 publisherName,
 onDeveloperPress,
 onPublisherPress,
}: GameMetaSectionProps) {
 const { t } = useTranslation();
 const criticCaption = getRatingsCaption(t, criticRatingCount);
 const igdbCommunityCaption = getRatingsCaption(t, igdbCommunityRatingCount);
 const questSaveCaption = getRatingsCaption(t, questSaveRatingCount, isQuestSaveRatingLoading);
 const metaItems: MetaSectionItem[] = [];

 if (releaseDate) {
  metaItems.push({
   icon: 'calendar-alt',
   label: t('gameDetail.releaseDate'),
   value: releaseDate,
  });
 }

 if (developerName) {
  metaItems.push({
   icon: 'code',
   label: t('gameDetail.developer'),
   value: developerName,
   onPress: onDeveloperPress,
  });
 }

 if (publisherName) {
  metaItems.push({
   icon: 'building',
   label: t('gameDetail.publisher'),
   value: publisherName,
   onPress: onPublisherPress,
  });
 }

 return (
  <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
   <View style={{ gap: spacing.xs }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.lg,
      fontFamily: typography.font.bold,
     }}
    >
     {t('gameDetail.editorial.snapshot.title')}
    </Text>
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      fontFamily: typography.font.medium,
      lineHeight: 18,
     }}
    >
     {t('gameDetail.editorial.snapshot.subtitle')}
    </Text>
   </View>

   <View style={{ flexDirection: 'row', gap: spacing.sm }}>
    <ScoreCard
     title={t('gameDetail.critic')}
     value={criticRating}
     format="percent"
     caption={criticCaption}
     accentColor="#F6C453"
     backgroundColor="rgba(246,196,83,0.10)"
     borderColor="rgba(246,196,83,0.32)"
    />
    <ScoreCard
     title={t('gameDetail.igdbCommunity')}
     value={igdbCommunityRating}
     format="percent"
     caption={igdbCommunityCaption}
     accentColor={colors.primary.DEFAULT}
     backgroundColor={colors.primary.glowSoft}
     borderColor="rgba(0,213,255,0.26)"
    />
    <ScoreCard
     title={t('gameDetail.questSavePlus')}
     value={isQuestSaveRatingLoading ? null : questSaveRating}
     format="five-point"
     caption={questSaveCaption}
     accentColor={colors.success}
     backgroundColor="rgba(44,182,125,0.12)"
     borderColor="rgba(44,182,125,0.28)"
    />
   </View>

   <View
    style={{
     gap: spacing.xs,
     paddingTop: spacing.md,
     borderTopWidth: 1,
     borderColor: colors.border.DEFAULT,
    }}
   >
    {metaItems.map((item) => (
     <MetaLine
      key={`${item.icon}-${item.label}`}
      icon={item.icon}
      label={item.label}
      value={item.value}
      onPress={item.onPress}
     />
    ))}
   </View>
  </View>
 );
}
