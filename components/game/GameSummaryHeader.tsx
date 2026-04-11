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

type SummaryChipProps = {
 label: string;
 textColor: string;
 backgroundColor: string;
 borderColor: string;
 alignSelf?: 'flex-start' | 'auto';
};

function SummaryDot() {
 return (
  <View
   style={{
    width: 3,
    height: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.tertiary,
   }}
  />
 );
}

function SummaryChip({
 label,
 textColor,
 backgroundColor,
 borderColor,
 alignSelf = 'auto',
}: SummaryChipProps) {
 return (
  <View
   style={{
    alignSelf,
    borderRadius: borderRadius.full,
    backgroundColor,
    borderWidth: 1,
    borderColor,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
   }}
  >
   <Text
    style={{
     color: textColor,
     fontSize: typography.size.xs,
     fontFamily: typography.font.semibold,
    }}
   >
    {label}
   </Text>
  </View>
 );
}

function ReleaseMetaRow({
 genreText,
 releaseYear,
 statusLabel,
 statusColor,
}: Pick<GameSummaryHeaderProps, 'genreText' | 'releaseYear' | 'statusLabel' | 'statusColor'>) {
 if (!genreText && !releaseYear && !statusLabel) {
  return null;
 }

 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
   }}
  >
   <View
    style={{
     flexDirection: 'row',
     alignItems: 'center',
     flexWrap: 'wrap',
     gap: spacing.sm,
     flex: 1,
    }}
   >
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
    {genreText && releaseYear ? <SummaryDot /> : null}
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
    <SummaryChip
     label={statusLabel}
     textColor={statusColor ?? colors.primary.DEFAULT}
     backgroundColor={statusColor ? `${statusColor}22` : colors.primary.glowSoft}
     borderColor={statusColor ?? colors.primary.DEFAULT}
    />
   ) : null}
  </View>
 );
}

function CompactMetaRow({
 genreText,
 releaseYear,
}: Pick<GameSummaryHeaderProps, 'genreText' | 'releaseYear'>) {
 if (!genreText && !releaseYear) {
  return null;
 }

 return (
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
   {genreText && releaseYear ? <SummaryDot /> : null}
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
 );
}

function MetaChipGroup({
 gameTypeLabel,
 releaseStatusLabel,
 statusLabel,
 statusColor,
 compact = false,
}: Pick<
 GameSummaryHeaderProps,
 'gameTypeLabel' | 'releaseStatusLabel' | 'statusLabel' | 'statusColor'
> & { compact?: boolean }) {
 if (!gameTypeLabel && !releaseStatusLabel && !statusLabel) {
  return null;
 }

 const alignSelf = compact ? 'flex-start' : 'auto';

 return (
  <View
   style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: compact ? undefined : 'flex-end',
    gap: spacing.xs,
    maxWidth: compact ? undefined : '54%',
   }}
  >
   {gameTypeLabel ? (
    <SummaryChip
     label={gameTypeLabel}
     textColor={colors.text.secondary}
     backgroundColor={colors.background.elevated}
     borderColor={colors.border.DEFAULT}
     alignSelf={alignSelf}
    />
   ) : null}

   {releaseStatusLabel ? (
    <SummaryChip
     label={releaseStatusLabel}
     textColor="#FFB400"
     backgroundColor="rgba(255,180,0,0.12)"
     borderColor="rgba(255,180,0,0.35)"
     alignSelf={alignSelf}
    />
   ) : null}

   {statusLabel ? (
    <SummaryChip
     label={statusLabel}
     textColor={statusColor ?? colors.primary.DEFAULT}
     backgroundColor={statusColor ? `${statusColor}22` : colors.primary.glowSoft}
     borderColor={statusColor ?? colors.primary.DEFAULT}
     alignSelf={alignSelf}
    />
   ) : null}
  </View>
 );
}

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
    <ReleaseMetaRow
     genreText={genreText}
     releaseYear={releaseYear}
     statusLabel={statusLabel}
     statusColor={statusColor}
    />
   ) : (
    <CompactMetaRow genreText={genreText} releaseYear={releaseYear} />
   )}

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

     <MetaChipGroup
      gameTypeLabel={gameTypeLabel}
      releaseStatusLabel={releaseStatusLabel}
      statusLabel={null}
      statusColor={null}
     />
    </View>
   ) : gameTypeLabel || releaseStatusLabel || statusLabel ? (
    <View style={{ marginBottom: spacing.md }}>
     <MetaChipGroup
      gameTypeLabel={gameTypeLabel}
      releaseStatusLabel={releaseStatusLabel}
      statusLabel={statusLabel}
      statusColor={statusColor}
      compact
     />
    </View>
   ) : null}
  </View>
 );
}
