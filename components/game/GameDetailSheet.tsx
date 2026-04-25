import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, ScrollView, Switch, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BacklogStatusCelebrationOverlay } from '@/components/backlog/BacklogStatusCelebrationOverlay';
import { BottomSheet } from '@/components/base/feedback/BottomSheet';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { DatePickerInput } from '@/components/base/inputs/DatePickerInput';
import { SearchableMultiSelectInput } from '@/components/base/inputs/SearchableMultiSelectInput';
import { GameBacklogPanel } from '@/components/game/GameBacklogPanel';
import { GameHeroBanner } from '@/components/game/GameHeroBanner';
import { GameSummaryHeader } from '@/components/game/GameSummaryHeader';
import { useGameBacklogController } from '@/hooks/useGameBacklogController';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameDetailSheetProps = {
 game: CatalogGame | null;
 isOpen: boolean;
 onClose: () => void;
};

export function GameDetailSheet({ game, isOpen, onClose }: GameDetailSheetProps) {
 const { t } = useTranslation();
 const { colorMap, iconMap } = useBacklogStatusPresentation();
 const insets = useSafeAreaInsets();
 const { width: screenWidth } = useWindowDimensions();
 const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
 const [confirmRestoreVisible, setConfirmRestoreVisible] = useState(false);
 const [statusCelebration, setStatusCelebration] = useState<{
  status: BacklogStatusEnum;
  trigger: number;
 } | null>(null);
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
  pendingDateWarning,
  pendingResetAbandoned,
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
  confirmPendingDateWarning,
  dismissPendingDateWarning,
  togglePendingResetAbandoned,
  handlePendingStartedAtChange,
  handlePendingCompletedAtChange,
  handlePendingAbandonedAtChange,
  handlePendingResumedAtChange,
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

 function triggerStatusCelebration(status: BacklogStatusEnum) {
  InteractionManager.runAfterInteractions(() => {
   setStatusCelebration((current) => ({
    status,
    trigger: current ? current.trigger + 1 : 1,
   }));
  });
 }

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
     onUpdate={() => {
      void handleUpdateBacklog().then((updatedStatus) => {
       if (updatedStatus) {
        triggerStatusCelebration(updatedStatus);
       }
      });
     }}
     onRemove={() => setConfirmRemoveVisible(true)}
     onRestoreFromArchive={() => setConfirmRestoreVisible(true)}
    />
   </ScrollView>

   <BacklogStatusCelebrationOverlay
    colorMap={colorMap}
    iconMap={iconMap}
    status={statusCelebration?.status ?? null}
    trigger={statusCelebration?.trigger ?? 0}
   />

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
    visible={pendingDateWarning !== null}
    title={pendingDateWarning?.title ?? ''}
    message={pendingDateWarning?.body ?? ''}
    confirmLabel={t('backlog.dateChange.confirm')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => {
     void confirmPendingDateWarning().then((updatedStatus) => {
      if (updatedStatus) {
       triggerStatusCelebration(updatedStatus);
      }
     });
    }}
    onCancel={dismissPendingDateWarning}
   >
    {pendingDateWarning?.startedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingDateWarning.startedAtInput}
      onChange={handlePendingStartedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.startedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingDateWarning?.completedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingDateWarning.completedAtInput}
      onChange={handlePendingCompletedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.completedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingDateWarning?.resumedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingDateWarning.resumedAtInput}
      onChange={handlePendingResumedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.resumedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingDateWarning?.abandonedAtInput !== undefined ? (
     <DatePickerInput
      value={pendingDateWarning.abandonedAtInput}
      onChange={handlePendingAbandonedAtChange}
      maximumDate={new Date()}
      accessibilityLabel={t('backlog.abandonedAtLabel')}
      placeholder={t('gameDetail.datePlaceholder')}
     />
    ) : null}
    {pendingDateWarning?.showResetAbandonedSwitch ? (
     <View
      style={{
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingVertical: spacing.xs,
      }}
     >
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.md,
        flex: 1,
       }}
      >
       {t('backlog.dateChange.resetAbandoned')}
      </Text>
      <Switch
       value={pendingResetAbandoned}
       onValueChange={togglePendingResetAbandoned}
       thumbColor={pendingResetAbandoned ? colors.primary.DEFAULT : colors.text.disabled}
       trackColor={{ false: 'rgba(255,255,255,0.12)', true: `${colors.primary.DEFAULT}80` }}
       ios_backgroundColor="rgba(255,255,255,0.12)"
      />
     </View>
    ) : null}
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
