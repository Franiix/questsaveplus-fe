import { Pressable, Text, View } from 'react-native';
import { PlatformIconRow } from '@/components/base/display/PlatformIconRow';
import type { CatalogPlatform } from '@/shared/models/Catalog.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type GameSummaryHeaderProps = {
 title: string;
 genreText?: string | null;
 secondaryActionText?: string | null;
 gameTypeLabel?: string | null;
 releaseStatusLabel?: string | null;
 statusLabel?: string | null;
 statusColor?: string | null;
 releaseYear?: string | null;
 platforms?: CatalogPlatform[] | null;
 onSecondaryActionPress?: (() => void) | null;
 variant?: 'screen' | 'sheet';
};

export function GameSummaryHeader({
 title,
 genreText,
 secondaryActionText,
 gameTypeLabel,
 releaseStatusLabel,
 statusLabel,
 statusColor,
 releaseYear,
 platforms,
 onSecondaryActionPress,
 variant = 'screen',
}: GameSummaryHeaderProps) {
 const isScreen = variant === 'screen';

 return (
  <View>
   <Text
    style={{
     color: colors.text.primary,
     fontSize: isScreen ? typography.size['3xl'] : typography.size.xl,
     fontFamily: typography.font.bold,
     letterSpacing: isScreen ? typography.letterSpacing.tight : typography.letterSpacing.normal,
     marginBottom: spacing.xs,
    }}
   >
    {title}
   </Text>

   {isScreen && secondaryActionText ? (
    <Pressable onPress={onSecondaryActionPress ?? undefined} disabled={!onSecondaryActionPress}>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.xs,
       fontFamily: typography.font.semibold,
       marginBottom: spacing.sm,
      }}
     >
      {secondaryActionText}
      {onSecondaryActionPress ? '  >' : ''}
     </Text>
    </Pressable>
   ) : null}

   {isScreen ? (
    genreText || releaseYear || statusLabel ? (
     <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginBottom: spacing.sm,
      }}
     >
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, flex: 1 }}>
       {genreText ? (
        <Text
         style={{
          color: colors.primary['300'],
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.wide,
         }}
        >
         {genreText}
        </Text>
       ) : null}
       {genreText && releaseYear ? (
        <View
         style={{
          width: 3,
          height: 3,
          borderRadius: borderRadius.full,
          backgroundColor: colors.text.tertiary,
         }}
        />
       ) : null}
       {releaseYear ? (
        <Text
         style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.medium,
         }}
        >
         {releaseYear}
        </Text>
       ) : null}
      </View>
      {statusLabel ? (
       <View
        style={{
         borderRadius: borderRadius.full,
         backgroundColor: statusColor ? `${statusColor}22` : colors.primary.glowSoft,
         borderWidth: 1,
         borderColor: statusColor ?? colors.primary.DEFAULT,
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.xs,
        }}
       >
        <Text
         style={{
          color: statusColor ?? colors.primary.DEFAULT,
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
         {statusLabel}
        </Text>
       </View>
      ) : null}
     </View>
    ) : null
   ) : (
    genreText || releaseYear ? (
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       gap: spacing.sm,
       marginBottom: spacing.sm,
      }}
     >
      {genreText ? (
       <Text
        style={{
         color: colors.text.secondary,
         fontSize: typography.size.sm,
         fontFamily: typography.font.medium,
        }}
       >
        {genreText}
       </Text>
      ) : null}
      {genreText && releaseYear ? (
       <View
        style={{
         width: 3,
         height: 3,
         borderRadius: borderRadius.full,
         backgroundColor: colors.text.tertiary,
        }}
       />
      ) : null}
      {releaseYear ? (
       <Text
        style={{
         color: colors.text.secondary,
         fontSize: typography.size.sm,
         fontFamily: typography.font.medium,
        }}
       >
        {releaseYear}
       </Text>
      ) : null}
     </View>
    ) : null)}

   {platforms && platforms.length > 0 ? (
    <View
     style={{
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
     }}
    >
     <PlatformIconRow
      platforms={platforms}
      maxIcons={isScreen ? 7 : 6}
      size={isScreen ? 16 : 14}
      color={colors.text.secondary}
     />

     {gameTypeLabel || releaseStatusLabel ? (
      <View
       style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: spacing.xs,
        maxWidth: '54%',
       }}
      >
       {gameTypeLabel ? (
        <View
         style={{
          borderRadius: borderRadius.full,
          backgroundColor: colors.background.elevated,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
         }}
        >
         <Text
          style={{
           color: colors.text.secondary,
           fontSize: typography.size.xs,
           fontFamily: typography.font.semibold,
          }}
         >
          {gameTypeLabel}
         </Text>
        </View>
       ) : null}

       {releaseStatusLabel ? (
        <View
         style={{
          borderRadius: borderRadius.full,
          backgroundColor: 'rgba(255,180,0,0.12)',
          borderWidth: 1,
          borderColor: 'rgba(255,180,0,0.35)',
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
         }}
        >
         <Text
          style={{
           color: '#FFB400',
           fontSize: typography.size.xs,
           fontFamily: typography.font.semibold,
          }}
         >
          {releaseStatusLabel}
         </Text>
        </View>
       ) : null}
      </View>
     ) : null}
    </View>
   ) : gameTypeLabel || releaseStatusLabel ? (
    <View style={{ marginBottom: spacing.md }}>
     <View
      style={{
       flexDirection: 'row',
       flexWrap: 'wrap',
       gap: spacing.xs,
      }}
     >
      {gameTypeLabel ? (
       <View
        style={{
         alignSelf: 'flex-start',
         borderRadius: borderRadius.full,
         backgroundColor: colors.background.elevated,
         borderWidth: 1,
         borderColor: colors.border.DEFAULT,
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.xs,
        }}
       >
        <Text
         style={{
          color: colors.text.secondary,
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
         {gameTypeLabel}
        </Text>
       </View>
      ) : null}

      {releaseStatusLabel ? (
       <View
        style={{
         alignSelf: 'flex-start',
         borderRadius: borderRadius.full,
         backgroundColor: 'rgba(255,180,0,0.12)',
         borderWidth: 1,
         borderColor: 'rgba(255,180,0,0.35)',
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.xs,
        }}
       >
        <Text
         style={{
          color: '#FFB400',
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
         {releaseStatusLabel}
        </Text>
       </View>
      ) : null}

      {statusLabel ? (
       <View
        style={{
         alignSelf: 'flex-start',
         borderRadius: borderRadius.full,
         backgroundColor: statusColor ? `${statusColor}22` : colors.primary.glowSoft,
         borderWidth: 1,
         borderColor: statusColor ?? colors.primary.DEFAULT,
         paddingHorizontal: spacing.sm,
         paddingVertical: spacing.xs,
        }}
       >
        <Text
         style={{
          color: statusColor ?? colors.primary.DEFAULT,
          fontSize: typography.size.xs,
          fontFamily: typography.font.semibold,
         }}
        >
          {statusLabel}
        </Text>
       </View>
      ) : null}
     </View>
    </View>
   ) : null}
  </View>
 );
}
