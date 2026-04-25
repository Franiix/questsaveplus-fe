import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type { BacklogItemModel } from '@/shared/models/BacklogItem.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';

const COVER_W = 52;
const COVER_H = 76;
const DEFAULT_INITIAL = 20;

type DateRowProps = {
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 color: string;
 label: string;
 date: string;
 language: string;
};

function DateRow({ iconName, color, label, date, language }: DateRowProps) {
 return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
   <FontAwesome5 name={iconName} size={9} color={color} solid />
   <Text
    style={{
     color,
     fontSize: typography.size['2xs'],
     fontFamily: typography.font.medium,
    }}
   >
    {label}:{' '}
    <Text style={{ fontFamily: typography.font.regular }}>
     {formatDate(date, language, { day: 'numeric', month: 'short', year: 'numeric' })}
    </Text>
   </Text>
  </View>
 );
}

type Props = {
 items: BacklogItemModel[];
 initialCount?: number;
};

export function ProfileCompletionTimeline({ items, initialCount = DEFAULT_INITIAL }: Props) {
 const { t, i18n } = useTranslation();
 const [isExpanded, setIsExpanded] = useState(false);

 const completed = items
  .filter((item) => item.status === BacklogStatusEnum.COMPLETED && item.completed_at !== null)
  .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

 if (completed.length === 0) return null;

 const visible = isExpanded ? completed : completed.slice(0, initialCount);
 const hasMore = completed.length > initialCount;

 const groupedByYear = visible.reduce(
  (acc, item) => {
   const year = new Date(item.completed_at!).getFullYear();
   if (!acc[year]) acc[year] = [];
   acc[year]!.push(item);
   return acc;
  },
  {} as Record<number, BacklogItemModel[]>,
 );
 const sortedYears = Object.keys(groupedByYear)
  .map(Number)
  .sort((a, b) => b - a);

 return (
  <View style={{ gap: spacing.md }}>
   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontFamily: typography.font.bold,
    }}
   >
    {t('social.timelineTitle')}
   </Text>

   {sortedYears.map((year) => (
    <View key={year} style={{ gap: spacing.sm }}>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.xs,
       fontFamily: typography.font.semibold,
       letterSpacing: typography.letterSpacing.wide,
       textTransform: 'uppercase',
      }}
     >
      {year}
     </Text>

     {groupedByYear[year]!.map((item) => (
      <View
       key={item.id}
       style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        backgroundColor: colors.background.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        padding: spacing.sm,
       }}
      >
       {item.game_cover_url ? (
        <Image
         source={{ uri: item.game_cover_url }}
         style={{
          width: COVER_W,
          height: COVER_H,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background.elevated,
         }}
         resizeMode="cover"
        />
       ) : (
        <View
         style={{
          width: COVER_W,
          height: COVER_H,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background.elevated,
          alignItems: 'center',
          justifyContent: 'center',
         }}
        >
         <FontAwesome5 name="gamepad" size={20} color={colors.text.disabled} />
        </View>
       )}

       <View style={{ flex: 1, gap: 5 }}>
        <Text
         style={{
          color: colors.text.primary,
          fontSize: typography.size.md,
          fontFamily: typography.font.semibold,
         }}
         numberOfLines={2}
        >
         {item.game_name}
        </Text>

        <View style={{ gap: 3 }}>
         <DateRow
          iconName="plus"
          color={colors.text.tertiary}
          label={t('backlog.addedAtLabel')}
          date={item.added_at}
          language={i18n.language}
         />
         {item.started_at ? (
          <DateRow
           iconName="play"
           color={colors.info}
           label={t('backlog.startedAtLabel')}
           date={item.started_at}
           language={i18n.language}
          />
         ) : null}
         {item.completed_at ? (
          <DateRow
           iconName="trophy"
           color={colors.success}
           label={t('backlog.completedAtLabel')}
           date={item.completed_at}
           language={i18n.language}
          />
         ) : null}
         {item.abandoned_at ? (
          <DateRow
           iconName="ban"
           color={colors.error}
           label={t('backlog.abandonedAtLabel')}
           date={item.abandoned_at}
           language={i18n.language}
          />
         ) : null}
        </View>

        {item.personal_rating !== null ? (
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          {[1, 2, 3, 4, 5].map((star) => (
           <FontAwesome5
            key={star}
            name="star"
            size={9}
            color={star <= item.personal_rating! ? colors.warning : colors.text.disabled}
            solid={star <= item.personal_rating!}
           />
          ))}
         </View>
        ) : null}
       </View>
      </View>
     ))}
    </View>
   ))}

   {hasMore && !isExpanded ? (
    <Pressable
     onPress={() => setIsExpanded(true)}
     style={{
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      backgroundColor: colors.background.elevated,
     }}
    >
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.medium,
      }}
     >
      {t('social.timelineShowAll', { count: completed.length - initialCount })}
     </Text>
    </Pressable>
   ) : null}
  </View>
 );
}
