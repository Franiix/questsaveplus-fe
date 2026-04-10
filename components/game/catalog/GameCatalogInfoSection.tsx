import { Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { GameCatalogInfoBadgeGroup } from '@/components/game/catalog/GameCatalogInfoBadgeGroup';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { GameCatalogAgeRatingsButton } from '@/components/game/catalog/GameCatalogAgeRatingsButton';
import { GameCatalogLinksButton } from '@/components/game/catalog/GameCatalogLinksButton';
import { GameCatalogLanguageSupportButton } from '@/components/game/catalog/GameCatalogLanguageSupportButton';
import { GameCatalogReleaseDatesButton } from '@/components/game/catalog/GameCatalogReleaseDatesButton';
import { getGameCatalogInfo, hasGameCatalogInfoContent } from '@/shared/utils/gameCatalog';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameCatalogInfoSectionProps = {
 providerId?: string | null;
 raw?: unknown | null;
 labels: {
  title: string;
  gameModes: string;
  playerPerspectives: string;
  themes: string;
  franchise: string;
  collection: string;
  releaseDates: string;
  releaseDatesOpen: string;
  ageRatings: string;
  engines: string;
  type: string;
  parentGame: string;
  multiplayer: string;
  languageSupport: string;
  languageSupportOpen: string;
  websites: string;
  websitesOpen: string;
  storeHint: string;
  closeInfo: string;
  language: string;
  interface: string;
  audio: string;
  subtitles: string;
  gameplaySection: string;
  universeSection: string;
  multiplayerSection: string;
  firstRelease: string;
  showAllDates: (count: number) => string;
  showLessDates: string;
  linkGroups: {
   official: string;
   store: string;
   community: string;
   video: string;
   social: string;
  };
 };
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
 labels,
 locale = 'en',
}: GameCatalogInfoSectionProps) {
 if (providerId !== 'igdb' || !raw) return null;

 const catalogLocale = locale.startsWith('it') ? 'it' : 'en';
 const info = getGameCatalogInfo(raw, catalogLocale);
 const hasContent = hasGameCatalogInfoContent(raw);

 if (!hasContent) return null;

 const hasGameplay = info.gameModes.length > 0 || info.playerPerspectives.length > 0 || info.themes.length > 0;
 const hasEnginesMeta = info.engines.length > 0 || Boolean(info.typeValue) || Boolean(info.parentGame);
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
   <SectionTitle title={labels.title} />

   {hasGameplay ? (
    <>
     <InfoBlock title={labels.gameplaySection} />
     <GameCatalogInfoBadgeGroup label={labels.gameModes} values={info.gameModes} closeLabel={labels.closeInfo} />
     <GameCatalogInfoBadgeGroup
      label={labels.playerPerspectives}
      values={info.playerPerspectives}
      closeLabel={labels.closeInfo}
     />
     <GameCatalogInfoBadgeGroup label={labels.themes} values={info.themes} closeLabel={labels.closeInfo} />
    </>
   ) : null}

   {hasEnginesMeta ? (
    <>
     {hasGameplay ? null : <View style={{ height: 1, backgroundColor: colors.border.DEFAULT }} />}
     <GameCatalogInfoBadgeGroup label={labels.engines} values={info.engines} closeLabel={labels.closeInfo} />
     <GameCatalogInfoBadgeGroup
      label={labels.type}
      values={info.typeValue ? [info.typeValue] : []}
      closeLabel={labels.closeInfo}
     />
     <GameCatalogInfoBadgeGroup
      label={labels.parentGame}
      values={info.parentGame ? [info.parentGame] : []}
      closeLabel={labels.closeInfo}
     />
    </>
   ) : null}

   {hasUniverse ? (
    <>
     <InfoBlock title={labels.universeSection} />
     <GameCatalogInfoBadgeGroup
      label={labels.franchise}
      values={info.franchise ? [info.franchise] : []}
      closeLabel={labels.closeInfo}
     />
     <GameCatalogInfoBadgeGroup
      label={labels.collection}
      values={info.collection ? [info.collection] : []}
      closeLabel={labels.closeInfo}
     />
    </>
   ) : null}

   {hasMultiplayer ? (
    <>
     <InfoBlock title={labels.multiplayerSection} />
     <GameCatalogInfoBadgeGroup label={labels.multiplayer} values={info.multiplayer} closeLabel={labels.closeInfo} />
    </>
   ) : null}

   <GameCatalogAgeRatingsButton
    providerId={providerId}
    raw={raw}
    title={labels.ageRatings}
    openLabel={labels.ageRatings}
    closeLabel={labels.closeInfo}
   />

   <GameCatalogLanguageSupportButton
    providerId={providerId}
    raw={raw}
    title={labels.languageSupport}
    openLabel={labels.languageSupportOpen}
    closeLabel={labels.closeInfo}
    labels={{
     language: labels.language,
     interface: labels.interface,
     audio: labels.audio,
     subtitles: labels.subtitles,
    }}
    locale={locale}
   />

   <GameCatalogReleaseDatesButton
    providerId={providerId}
    raw={raw}
    title={labels.releaseDates}
    openLabel={labels.releaseDatesOpen}
    closeLabel={labels.closeInfo}
    showAllLabel={labels.showAllDates}
    showLessLabel={labels.showLessDates}
    firstReleaseLabel={labels.firstRelease}
    locale={locale}
   />

   <GameCatalogLinksButton
    providerId={providerId}
    raw={raw}
   title={labels.websites}
   openLabel={labels.websitesOpen}
    hintLabel={labels.storeHint}
   closeLabel={labels.closeInfo}
   groupLabels={labels.linkGroups}
  />
  </Card>
 );
}
