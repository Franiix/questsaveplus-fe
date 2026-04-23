import { View } from 'react-native';
import { GameBacklogPanel } from '@/components/game/GameBacklogPanel';
import { GameMetaSection } from '@/components/game/GameMetaSection';
import { GameSummaryHeader } from '@/components/game/GameSummaryHeader';
import type { CatalogGameDetail } from '@/shared/models/Catalog.model';
import { spacing } from '@/shared/theme/tokens';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';

type StatusOption = {
 label: string;
 value: BacklogStatusEnum;
 icon?: string;
 color?: string;
};

type GameDetailOverviewViewModel = {
 backlogStatusColor?: string | null;
 backlogStatusIcon?: string | null;
 backlogStatusLabel?: string | null;
 criticRating: number | null;
 criticRatingCount: number | null;
 developerName?: string | null;
 gameTypeLabel?: string | null;
 genres?: string | null;
 igdbCommunityRating: number | null;
 igdbVotesCount: number | null;
 isCommunityRatingLoading: boolean;
 publisherName?: string | null;
 questSaveRating: number | null;
 questSaveRatingCount: number;
 releaseDate?: string | null;
 releaseStatusLabel?: string | null;
 releaseYear?: string | null;
};

type GameDetailOverviewSectionProps = {
 backlogController: {
  hasPendingChanges: boolean;
  isBacklogLoading: boolean;
  isCreateMutating: boolean;
  isDeleteMutating: boolean;
  isInBacklog: boolean;
  isMutating: boolean;
  isUpdateMutating: boolean;
  localNotes: string;
  onAdd: () => void;
  onChangeNotes: (value: string) => void;
  onNotesFocus: () => void;
  onRatingChange: (rating: number) => void;
  onRemove: () => void;
  onStatusChange: (value: string) => void;
  onUpdate: () => void;
  selectedRating: number;
  selectedStatus: BacklogStatusEnum;
  statusOptions: readonly StatusOption[];
  addedAt?: string | null;
 };
 game: Pick<CatalogGameDetail, 'name' | 'platforms'>;
 onDeveloperPress?: (() => void) | null;
 onPublisherPress?: (() => void) | null;
 onRegisterBacklogOffset: (y: number) => void;
 viewModel: GameDetailOverviewViewModel;
};

export function GameDetailOverviewSection({
 backlogController,
 game,
 onDeveloperPress,
 onPublisherPress,
 onRegisterBacklogOffset,
 viewModel,
}: GameDetailOverviewSectionProps) {
 return (
  <>
   <GameSummaryHeader
    title={game.name}
    genreText={viewModel.genres ?? null}
    gameTypeLabel={viewModel.gameTypeLabel}
    releaseStatusLabel={viewModel.releaseStatusLabel}
    statusLabel={viewModel.backlogStatusLabel}
    statusColor={viewModel.backlogStatusColor}
    statusIcon={viewModel.backlogStatusIcon}
    releaseYear={viewModel.releaseYear}
    platforms={game.platforms}
    variant="screen"
   />

   <GameMetaSection
    criticRating={viewModel.criticRating}
    criticRatingCount={viewModel.criticRatingCount}
    igdbCommunityRating={viewModel.igdbCommunityRating}
    igdbCommunityRatingCount={viewModel.igdbVotesCount}
    isQuestSaveRatingLoading={viewModel.isCommunityRatingLoading}
    questSaveRating={viewModel.questSaveRating}
    questSaveRatingCount={viewModel.questSaveRatingCount}
    releaseDate={viewModel.releaseDate}
    developerName={viewModel.developerName}
    publisherName={viewModel.publisherName}
    onDeveloperPress={onDeveloperPress}
    onPublisherPress={onPublisherPress}
   />

   <View
    style={{ marginTop: spacing.xl, marginBottom: spacing.md }}
    onLayout={(event) => onRegisterBacklogOffset(event.nativeEvent.layout.y)}
   >
    <GameBacklogPanel
     isInBacklog={backlogController.isInBacklog}
     isBacklogLoading={backlogController.isBacklogLoading}
     isMutating={backlogController.isMutating}
     isCreateMutating={backlogController.isCreateMutating}
     isUpdateMutating={backlogController.isUpdateMutating}
     isDeleteMutating={backlogController.isDeleteMutating}
     selectedStatus={backlogController.selectedStatus}
     selectedRating={backlogController.selectedRating}
     localNotes={backlogController.localNotes}
     showNotes
     hasPendingChanges={backlogController.hasPendingChanges}
     statusOptions={backlogController.statusOptions}
     onStatusChange={backlogController.onStatusChange}
     onRatingChange={backlogController.onRatingChange}
     onChangeNotes={backlogController.onChangeNotes}
     onNotesFocus={backlogController.onNotesFocus}
     onAdd={backlogController.onAdd}
     onUpdate={backlogController.onUpdate}
     onRemove={backlogController.onRemove}
     addedAt={backlogController.addedAt}
    />
   </View>
  </>
 );
}
