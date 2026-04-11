import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PlatformGlyph, platformNameToKey } from '@/components/base/display/PlatformIcon';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogReleaseDateItems } from '@/shared/utils/gameCatalog';

const INITIAL_VISIBLE = 4;

type GameCatalogReleaseDatesButtonProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 title: string;
 openLabel: string;
 closeLabel: string;
 showAllLabel: (count: number) => string;
 showLessLabel: string;
 firstReleaseLabel: string;
 locale?: string;
};

export function GameCatalogReleaseDatesButton({
 providerId,
 raw,
 title,
 openLabel,
 showAllLabel,
 showLessLabel,
 firstReleaseLabel,
 locale = 'en',
}: GameCatalogReleaseDatesButtonProps) {
 const [expanded, setExpanded] = useState(false);
 const releaseDates = getGameCatalogReleaseDateItems(raw, locale);

 if (providerId !== 'igdb' || releaseDates.length === 0) return null;

 const visible = expanded ? releaseDates : releaseDates.slice(0, INITIAL_VISIBLE);
 const hasMore = releaseDates.length > INITIAL_VISIBLE;

 return (
  <View style={{ gap: spacing.sm }}>
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     gap: spacing.md,
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
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.xs,
      fontFamily: typography.font.semibold,
     }}
    >
     {openLabel}
    </Text>
   </View>

   <View style={{ gap: spacing.xs }}>
    {visible.map((item, index) => {
     const isFirst = index === 0 && !expanded;
     const platformKey = platformNameToKey(item.platformSlug ?? item.platformName);
     return (
      <View
       key={item.key}
       style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: isFirst ? 'rgba(0,213,255,0.06)' : 'transparent',
        borderWidth: isFirst ? 1 : 0,
        borderColor: isFirst ? 'rgba(0,213,255,0.18)' : 'transparent',
       }}
      >
       <View style={{ width: 24, alignItems: 'center' }}>
        {platformKey ? (
         <PlatformGlyph
          platformKey={platformKey}
          size={13}
          color={isFirst ? colors.primary.DEFAULT : colors.text.tertiary}
         />
        ) : (
         <View
          style={{
           width: 6,
           height: 6,
           borderRadius: borderRadius.full,
           backgroundColor: isFirst ? colors.primary.DEFAULT : colors.text.disabled,
          }}
         />
        )}
       </View>

       <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Text
         style={{
          color: isFirst ? colors.text.primary : colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: isFirst ? typography.font.semibold : typography.font.regular,
         }}
        >
         {item.platformName}
        </Text>
        {item.region ? (
         <View
          style={{
           borderRadius: borderRadius.full,
           backgroundColor: colors.background.elevated,
           borderWidth: 1,
           borderColor: colors.border.DEFAULT,
           paddingHorizontal: spacing.xs,
           paddingVertical: 2,
          }}
         >
          <Text
           style={{
            color: colors.text.tertiary,
            fontSize: typography.size.xs,
            fontFamily: typography.font.semibold,
           }}
          >
           {item.region}
          </Text>
         </View>
        ) : null}
       </View>

       <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        {isFirst ? (
         <View
          style={{
           borderRadius: borderRadius.full,
           backgroundColor: 'rgba(0,213,255,0.14)',
           paddingHorizontal: spacing.xs,
           paddingVertical: 2,
          }}
         >
          <Text
           style={{
            color: colors.primary.DEFAULT,
            fontSize: typography.size.xs,
            fontFamily: typography.font.semibold,
           }}
          >
           {firstReleaseLabel}
          </Text>
         </View>
        ) : null}
        <Text
         style={{
          color: isFirst ? colors.text.primary : colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: isFirst ? typography.font.semibold : typography.font.regular,
         }}
        >
         {item.dateLabel}
        </Text>
       </View>
      </View>
     );
    })}
   </View>

   {hasMore ? (
    <Pressable
     onPress={() => setExpanded((prev) => !prev)}
     style={{ alignSelf: 'flex-start', paddingVertical: spacing.xs }}
    >
     <Text
      style={{
       color: colors.primary['200'],
       fontSize: typography.size.sm,
       fontFamily: typography.font.semibold,
      }}
     >
      {expanded ? showLessLabel : showAllLabel(releaseDates.length)}
     </Text>
    </Pressable>
   ) : null}
  </View>
 );
}
