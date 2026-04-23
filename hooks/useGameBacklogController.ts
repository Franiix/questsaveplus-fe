import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

type BacklogGame = {
 id: number;
 name: string;
 background_image: string | null;
};

type UseGameBacklogControllerOptions = {
 game: BacklogGame | null;
 isEnabled?: boolean;
 onRemoveSuccess?: () => void;
};

export function useGameBacklogController({
 game,
 isEnabled = true,
 onRemoveSuccess,
}: UseGameBacklogControllerOptions) {
 const { t } = useTranslation();
 const { session } = useAuthStore();
 const { showToast } = useToastStore();
 const { statusOptions } = useBacklogStatusPresentation();
 const {
  backlog,
  isReadingCurrent,
  isMutating,
  activeMutation,
  error,
  read,
  create,
  update,
  delete: deleteBacklogItem,
  clearCurrentBacklog,
  clearBacklog,
  clearError,
 } = useBacklogStore();

 const [selectedStatus, setSelectedStatus] = useState<BacklogStatusEnum>(
  BacklogStatusEnum.WANT_TO_PLAY,
 );
 const [selectedRating, setSelectedRating] = useState(0);
 const [localNotes, setLocalNotes] = useState('');

 const userId = session?.user?.id ?? null;
 const backlogItem = backlog?.game_id === game?.id ? backlog : null;
 const isInBacklog = !!backlogItem;
 const isBacklogLoading = isReadingCurrent;
 const isCreateMutating = activeMutation === 'create';
 const isUpdateMutating = activeMutation === 'update';
 const isDeleteMutating = activeMutation === 'delete';
 const hasPendingChanges =
  !!backlogItem &&
  (selectedStatus !== backlogItem.status ||
   selectedRating !== (backlogItem.personal_rating ?? 0) ||
   localNotes !== (backlogItem.notes ?? ''));

 useEffect(() => {
  if (!userId) {
   clearBacklog();
   return;
  }

  if (!game?.id || !isEnabled) {
   clearCurrentBacklog();
   return;
  }

  void read(userId, game.id);
 }, [clearBacklog, clearCurrentBacklog, game?.id, isEnabled, read, userId]);

 useEffect(() => {
  if (!backlogItem) {
   setSelectedStatus(BacklogStatusEnum.WANT_TO_PLAY);
   setSelectedRating(0);
   setLocalNotes('');
   return;
  }

  setSelectedStatus(backlogItem.status);
  setSelectedRating(backlogItem.personal_rating ?? 0);
  setLocalNotes(backlogItem.notes ?? '');
 }, [backlogItem]);

 useEffect(() => {
  if (!error) return;
  showToast(error, 'error');
  clearError();
 }, [clearError, error, showToast]);

 function handleStatusChange(value: string) {
  setSelectedStatus(value as BacklogStatusEnum);
 }

 function handleRatingChange(rating: number) {
  setSelectedRating(rating);
 }

 async function handleAddToBacklog() {
  if (!userId || !game) return;

  const created = await create({
   user_id: userId,
   game_id: game.id,
   game_name: game.name,
   game_cover_url: game.background_image ?? undefined,
   status: selectedStatus,
   personal_rating: selectedRating > 0 ? selectedRating : undefined,
  });

  if (created) {
   showToast(t('gameDetail.addSuccess'), 'success');
  }
 }

 async function handleUpdateBacklog() {
  if (!backlogItem) return;

  const updated = await update(backlogItem.id, {
   status: selectedStatus,
   personal_rating: selectedRating > 0 ? selectedRating : null,
   notes: localNotes.trim().length > 0 ? localNotes : null,
  });

  if (updated) {
   showToast(t('gameDetail.updateSuccess'), 'success');
  }
 }

 async function handleRemoveFromBacklog() {
  if (!backlogItem) return;

  await deleteBacklogItem(backlogItem.id);

  if (!useBacklogStore.getState().error) {
   showToast(t('gameDetail.removeSuccess'), 'success');
   onRemoveSuccess?.();
  }
 }

 return {
  backlogItem,
  isBacklogLoading,
  isMutating,
  isInBacklog,
  isCreateMutating,
  isUpdateMutating,
  isDeleteMutating,
  selectedStatus,
  selectedRating,
  localNotes,
  statusOptions,
  hasPendingChanges,
  setLocalNotes,
  handleStatusChange,
  handleRatingChange,
  handleAddToBacklog,
  handleUpdateBacklog,
  handleRemoveFromBacklog,
 } as const;
}
