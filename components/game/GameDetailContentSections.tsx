import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { GameCatalogAlternativeNamesButton } from '@/components/game/catalog/GameCatalogAlternativeNamesButton';
import { GameCatalogInfoSection } from '@/components/game/catalog/GameCatalogInfoSection';
import { GameStoreActionRow } from '@/components/game/catalog/GameStoreActionRow';
import { GameDescriptionSection } from '@/components/game/GameDescriptionSection';
import { GameEditorialFeatureCard } from '@/components/game/GameEditorialFeatureCard';
import { GameMediaSection } from '@/components/game/GameMediaSection';
import { GameReleaseReadinessCard } from '@/components/game/GameReleaseReadinessCard';
import { spacing } from '@/shared/theme/tokens';
import type { CatalogGameDetail } from '@/shared/models/Catalog.model';
import type { GameEditorialRow } from '@/shared/utils/gameCatalog';

type GameDetailContentViewModel = {
 hasCatalogInfoSection: boolean;
 hasCatalogMediaSection: boolean;
 howItPlays: {
  subtitle?: string | null;
  rows?: Array<GameEditorialRow & { onPress?: (() => void) | null }>;
 } | null;
 overviewText: string;
 releaseReadiness: {
  subtitle?: string | null;
  rows?: Array<{ key: string; label: string; value: string }>;
 } | null;
 releaseStatusLabel?: string | null;
 storylineText: string;
 whoItsFor: {
  subtitle?: string | null;
  bullets?: string[];
 } | null;
};

type GameDetailContentSectionsProps = {
 game: CatalogGameDetail;
 locale: string;
 onDescriptionToggle: () => void;
  onRegisterSectionOffset: (key: string, y: number) => void;
  onStorylineToggle: () => void;
 uiState: {
  isDescriptionExpanded: boolean;
  isStorylineExpanded: boolean;
 };
 viewModel: GameDetailContentViewModel;
 whereItFits: {
  subtitle?: string | null;
  rows?: Array<GameEditorialRow & { onPress?: (() => void) | null }>;
 } | null;
};

export function GameDetailContentSections({
 game,
 locale,
 onDescriptionToggle,
 onRegisterSectionOffset,
 onStorylineToggle,
 uiState,
 viewModel,
 whereItFits,
}: GameDetailContentSectionsProps) {
 const { t } = useTranslation();

 return (
  <>
   <View style={{ marginBottom: spacing.md }}>
    <GameReleaseReadinessCard
     title={t('gameDetail.editorial.releaseReadiness.title')}
     subtitle={viewModel.releaseReadiness?.subtitle ?? null}
     statusLabel={viewModel.releaseStatusLabel}
     rows={viewModel.releaseReadiness?.rows ?? []}
    />
   </View>

   <GameDescriptionSection
    title={t('gameDetail.about')}
    description={viewModel.overviewText}
    isExpanded={uiState.isDescriptionExpanded}
    collapsedLines={3}
    onToggle={onDescriptionToggle}
   />

   <GameStoreActionRow
    providerId={game.providerId}
    raw={game.metadata?.raw}
    title={t('gameDetail.storeActions')}
    ctaLabel={t('gameDetail.openStore')}
   />

   <GameEditorialFeatureCard
    title={t('gameDetail.editorial.playstyle.title')}
    subtitle={viewModel.howItPlays?.subtitle ?? null}
    icon="gamepad"
    rows={viewModel.howItPlays?.rows ?? []}
    closeLabel={t('gameDetail.closeInfo')}
   />

   <GameEditorialFeatureCard
    title={t('gameDetail.editorial.placement.title')}
    subtitle={whereItFits?.subtitle ?? null}
    icon="layer-group"
    rows={whereItFits?.rows ?? []}
    closeLabel={t('gameDetail.closeInfo')}
   />

   <View style={{ marginBottom: spacing.md }}>
    <GameEditorialFeatureCard
     title={t('gameDetail.editorial.audience.title')}
     subtitle={viewModel.whoItsFor?.subtitle ?? null}
     icon="compass"
     bullets={viewModel.whoItsFor?.bullets ?? []}
     closeLabel={t('gameDetail.closeInfo')}
    />
   </View>

   <GameDescriptionSection
    title={t('gameDetail.storyline')}
    description={viewModel.storylineText}
    isExpanded={uiState.isStorylineExpanded}
    collapsedLines={4}
    onToggle={onStorylineToggle}
   />

   <GameCatalogAlternativeNamesButton providerId={game.providerId} raw={game.metadata?.raw} />

   {viewModel.hasCatalogInfoSection ? (
    <View onLayout={(event) => onRegisterSectionOffset('game-info', event.nativeEvent.layout.y)}>
     <GameCatalogInfoSection providerId={game.providerId} raw={game.metadata?.raw} locale={locale} />
    </View>
   ) : null}

   {viewModel.hasCatalogMediaSection ? (
    <View onLayout={(event) => onRegisterSectionOffset('media', event.nativeEvent.layout.y)}>
     <GameMediaSection providerId={game.providerId} raw={game.metadata?.raw} />
    </View>
   ) : null}
  </>
 );
}
