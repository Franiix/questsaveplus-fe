import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/base/feedback/BottomSheet';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { SearchableMultiSelectInput } from '@/components/base/inputs/SearchableMultiSelectInput';
import { GameBacklogPanel } from '@/components/game/GameBacklogPanel';
import { GameHeroBanner } from '@/components/game/GameHeroBanner';
import { GameSummaryHeader } from '@/components/game/GameSummaryHeader';
import { useGameBacklogController } from '@/hooks/useGameBacklogController';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { spacing } from '@/shared/theme/tokens';

type GameDetailSheetProps = {
 game: CatalogGame | null;
 isOpen: boolean;
 onClose: () => void;
};

export function GameDetailSheet({ game, isOpen, onClose }: GameDetailSheetProps) {
 const { t } = useTranslation();
 const insets = useSafeAreaInsets();
 const { width: screenWidth } = useWindowDimensions();
 const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
 const [confirmRestoreVisible, setConfirmRestoreVisible] = useState(false);
 const {
  isBacklogLoading,
  isMutating,
  isInBacklog,
  isArchived,
  isCreateMutating,
  isUpdateMutating,
  isDeleteMutating,
  selectedStatus,
  selectedRating,
  localPlatformPlayed,
  availablePlatformValues,
  platformOptions,
  pendingPlatformPlayed,
  isPlatformModalOpen,
  statusOptions,
  hasPendingChanges,
  setLocalPlatformPlayed,
  handleStatusChange,
  handleRatingChange,
  handleAddToBacklog,
  confirmAddToBacklog,
  dismissAddToBacklogPlatformModal,
  setPendingPlatformPlayed,
  handleUpdateBacklog,
  handleRemoveFromBacklog,
  handleRestoreFromArchive,
 } = useGameBacklogController({
  game: game
   ? {
      id: Number(game.gameId ?? game.externalId),
      name: game.name,
      background_image: game.backgroundImage?.url ?? game.coverImage?.url ?? null,
      platforms: game.platforms,
     }
   : null,
  isEnabled: isOpen,
  onRemoveSuccess: onClose,
 });

 if (!game) return null;

 const heroWidth = screenWidth;
 const heroHeight = 200;
 const releaseYear = game.releasedAt ? game.releasedAt.substring(0, 4) : null;
 const genre = game.genres[0]
  ? t(`genres.${game.genres[0].slug}`, { defaultValue: game.genres[0].name })
  : null;

 return (
  <BottomSheet isVisible={isOpen} onClose={onClose}>
   <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
   >
    <GameHeroBanner
     imageUri={game.backgroundImage?.url ?? game.coverImage?.url ?? null}
     width={heroWidth}
     height={heroHeight}
     metacritic={game.criticScore ?? null}
     gradientColors={['transparent', 'rgba(15, 15, 30, 0.85)']}
     gradientLocations={[0.4, 1]}
     badgeAlign="left"
     badgeSize="md"
     style={{
      height: heroHeight,
      marginHorizontal: -spacing.lg,
      marginTop: -spacing.md,
      marginBottom: spacing.md,
      overflow: 'hidden',
     }}
    />

    <GameSummaryHeader
     title={game.name}
     genreText={genre}
     releaseYear={releaseYear}
     platforms={game.platforms}
     variant="sheet"
    />

    <GameBacklogPanel
     isInBacklog={isInBacklog}
     isArchived={isArchived}
     isBacklogLoading={isBacklogLoading}
     isMutating={isMutating}
     isCreateMutating={isCreateMutating}
     isUpdateMutating={isUpdateMutating}
     isDeleteMutating={isDeleteMutating}
     selectedStatus={selectedStatus}
     selectedRating={selectedRating}
     localPlatformPlayed={localPlatformPlayed}
     hasPendingChanges={hasPendingChanges}
     availablePlatformValues={availablePlatformValues}
     platformOptions={platformOptions}
     statusOptions={statusOptions}
     onStatusChange={handleStatusChange}
     onRatingChange={handleRatingChange}
     onPlatformPlayedChange={setLocalPlatformPlayed}
     onAdd={() => void handleAddToBacklog()}
     onUpdate={() => void handleUpdateBacklog()}
     onRemove={() => setConfirmRemoveVisible(true)}
     onRestoreFromArchive={() => setConfirmRestoreVisible(true)}
    />
   </ScrollView>

   <ConfirmModal
    visible={confirmRemoveVisible}
    title={t('gameDetail.confirmRemove.title')}
    message={t('gameDetail.confirmRemove.message')}
    confirmLabel={t('gameDetail.confirmRemove.confirm')}
    cancelLabel={t('common.cancel')}
    isDestructive
    onConfirm={() => {
     setConfirmRemoveVisible(false);
     void handleRemoveFromBacklog();
    }}
    onCancel={() => setConfirmRemoveVisible(false)}
   />

   <ConfirmModal
    visible={isPlatformModalOpen}
    title={t('backlog.platformSelection.title')}
    message={t('backlog.platformSelection.message')}
    confirmLabel={t('gameDetail.addToBacklog')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void confirmAddToBacklog()}
    onCancel={dismissAddToBacklogPlatformModal}
    isConfirmDisabled={pendingPlatformPlayed.length === 0}
   >
    <SearchableMultiSelectInput
     options={platformOptions}
     value={pendingPlatformPlayed}
     onChange={setPendingPlatformPlayed}
     placeholder={t('backlog.platformSelection.placeholder')}
     title={t('backlog.platformSelection.title')}
     searchPlaceholder={t('backlog.platformSelection.placeholder')}
     accessibilityLabel={t('backlog.platformPlayedLabel')}
     emptyLabel={t('backlog.platformSelection.unavailable')}
    />
   </ConfirmModal>

   <ConfirmModal
    visible={confirmRestoreVisible}
    title={t('backlog.archive.restoreModalTitle')}
    message={t('backlog.archive.restoreModalMessage')}
    confirmLabel={t('backlog.archive.restoreAction')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => {
     setConfirmRestoreVisible(false);
     void handleRestoreFromArchive();
    }}
    onCancel={() => setConfirmRestoreVisible(false)}
   />
  </BottomSheet>
 );
}
