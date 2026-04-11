import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { GameCatalogAgeRatingsButton } from '@/components/game/catalog/GameCatalogAgeRatingsButton';
import { GameCatalogInfoBadgeGroup } from '@/components/game/catalog/GameCatalogInfoBadgeGroup';
import { GameCatalogLanguageSupportButton } from '@/components/game/catalog/GameCatalogLanguageSupportButton';
import { GameCatalogLinksButton } from '@/components/game/catalog/GameCatalogLinksButton';
import { GameCatalogReleaseDatesButton } from '@/components/game/catalog/GameCatalogReleaseDatesButton';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogInfo, hasGameCatalogInfoContent } from '@/shared/utils/gameCatalog';

type GameCatalogInfoSectionProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 locale?: string;
};

function InfoBlock({ title }: { title: string }) {
 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
   }}
  >
   <View style={{ flex: 1, height: 1, backgroundColor: colors.border.DEFAULT }} />
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
   <View style={{ flex: 1, height: 1, backgroundColor: colors.border.DEFAULT }} />
  </View>
 );
}

export function GameCatalogInfoSection({
 providerId,
 raw,
 locale = 'en',
}: GameCatalogInfoSectionProps) {
 const { t } = useTranslation();
 if (providerId !== 'igdb' || !raw) return null;

 const catalogLocale = locale.startsWith('it') ? 'it' : 'en';
 const info = getGameCatalogInfo(raw, catalogLocale);
 const hasContent = hasGameCatalogInfoContent(raw);

 if (!hasContent) return null;

 const hasGameplay =
  info.gameModes.length > 0 || info.playerPerspectives.length > 0 || info.themes.length > 0;
 const hasEnginesMeta =
  info.engines.length > 0 || Boolean(info.typeValue) || Boolean(info.parentGame);
 const hasUniverse = Boolean(info.franchise) || Boolean(info.collection);
 const hasMultiplayer = info.multiplayer.length > 0;

 return (
  <Card
   variant="outlined"
   style={{
    marginTop: spacing.xl,
    padding: spacing.md,
    gap: spacing.md,
   }}
  >
   <SectionTitle title={t('gameDetail.gameInfo')} />

   {hasGameplay ? (
    <>
     <InfoBlock title={t('gameDetail.gameplaySection')} />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.gameModes')}
      values={info.gameModes}
      closeLabel={t('gameDetail.closeInfo')}
     />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.playerPerspectives')}
      values={info.playerPerspectives}
      closeLabel={t('gameDetail.closeInfo')}
     />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.themes')}
      values={info.themes}
      closeLabel={t('gameDetail.closeInfo')}
     />
    </>
   ) : null}

   {hasEnginesMeta ? (
    <>
     {hasGameplay ? null : <View style={{ height: 1, backgroundColor: colors.border.DEFAULT }} />}
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.engines')}
      values={info.engines}
      closeLabel={t('gameDetail.closeInfo')}
     />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.type')}
      values={info.typeValue ? [info.typeValue] : []}
      closeLabel={t('gameDetail.closeInfo')}
     />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.parentGame')}
      values={info.parentGame ? [info.parentGame] : []}
      closeLabel={t('gameDetail.closeInfo')}
     />
    </>
   ) : null}

   {hasUniverse ? (
    <>
     <InfoBlock title={t('gameDetail.universeSection')} />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.franchise')}
      values={info.franchise ? [info.franchise] : []}
      closeLabel={t('gameDetail.closeInfo')}
     />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.collection')}
      values={info.collection ? [info.collection] : []}
      closeLabel={t('gameDetail.closeInfo')}
     />
    </>
   ) : null}

   {hasMultiplayer ? (
    <>
     <InfoBlock title={t('gameDetail.multiplayerSection')} />
     <GameCatalogInfoBadgeGroup
      label={t('gameDetail.multiplayer')}
      values={info.multiplayer}
      closeLabel={t('gameDetail.closeInfo')}
     />
    </>
   ) : null}

   <GameCatalogAgeRatingsButton
    providerId={providerId}
    raw={raw}
    title={t('gameDetail.ageRatings')}
    openLabel={t('gameDetail.ageRatings')}
    closeLabel={t('gameDetail.closeInfo')}
   />

   <GameCatalogLanguageSupportButton
    providerId={providerId}
    raw={raw}
    title={t('gameDetail.languageSupport')}
    openLabel={t('gameDetail.languageSupportOpen')}
    closeLabel={t('gameDetail.closeInfo')}
    labels={{
     language: t('gameDetail.language'),
     interface: t('gameDetail.interface'),
     audio: t('gameDetail.audio'),
     subtitles: t('gameDetail.subtitles'),
    }}
    locale={locale}
   />

   <GameCatalogReleaseDatesButton
    providerId={providerId}
    raw={raw}
    title={t('gameDetail.releaseDates')}
    openLabel={t('gameDetail.releaseDatesOpen')}
    closeLabel={t('gameDetail.closeInfo')}
    showAllLabel={(count: number) => t('gameDetail.showAllDates', { count })}
    showLessLabel={t('gameDetail.showLessDates')}
    firstReleaseLabel={t('gameDetail.firstRelease')}
    locale={locale}
   />

   <GameCatalogLinksButton
    providerId={providerId}
    raw={raw}
    title={t('gameDetail.websites')}
    openLabel={t('gameDetail.websitesOpen')}
    hintLabel={t('gameDetail.storeHint')}
    closeLabel={t('gameDetail.closeInfo')}
    groupLabels={{
     official: t('gameDetail.linkGroups.official'),
     store: t('gameDetail.linkGroups.store'),
     community: t('gameDetail.linkGroups.community'),
     video: t('gameDetail.linkGroups.video'),
     social: t('gameDetail.linkGroups.social'),
    }}
   />
  </Card>
 );
}
