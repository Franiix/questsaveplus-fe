import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { formatDate } from '@/shared/utils/date';
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

type PendingDateWarning = {
 title: string;
 body: string;
 startedAtInput?: Date;
 completedAtInput?: Date;
 abandonedAtInput?: Date;
 resumedAtInput?: Date;
 showResetAbandonedSwitch?: boolean;
 onConfirm: (options?: {
  startedAt?: string;
  completedAt?: string;
  abandonedAt?: string;
  resumedAt?: string;
  resetAbandoned?: boolean;
 }) => Promise<void>;
};

const RESUMABLE_STATUSES = new Set<BacklogStatusEnum>([
 BacklogStatusEnum.PLAYING,
 BacklogStatusEnum.ONGOING,
 BacklogStatusEnum.COMPLETED,
]);

export function useGameBacklogController({
 game,
 isEnabled = true,
 onRemoveSuccess,
}: UseGameBacklogControllerOptions) {
 const { t, i18n } = useTranslation();
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
 const [localStartedAt, setLocalStartedAt] = useState<string | null>(null);
 const [localCompletedAt, setLocalCompletedAt] = useState<string | null>(null);
 const [localAbandonedAt, setLocalAbandonedAt] = useState<string | null>(null);
 const [localResumedAt, setLocalResumedAt] = useState<string | null>(null);
 const [pendingDateWarning, setPendingDateWarning] = useState<PendingDateWarning | null>(null);
 const [pendingResetAbandoned, setPendingResetAbandoned] = useState(false);

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
   localNotes !== (backlogItem.notes ?? '') ||
   localStartedAt !== (backlogItem.started_at ?? null) ||
   localCompletedAt !== (backlogItem.completed_at ?? null) ||
   localAbandonedAt !== (backlogItem.abandoned_at ?? null) ||
   localResumedAt !== (backlogItem.resumed_at ?? null));

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
   setLocalStartedAt(null);
   setLocalCompletedAt(null);
   setLocalAbandonedAt(null);
   setLocalResumedAt(null);
   return;
  }

  setSelectedStatus(backlogItem.status);
  setSelectedRating(backlogItem.personal_rating ?? 0);
  setLocalNotes(backlogItem.notes ?? '');
  setLocalStartedAt(backlogItem.started_at ?? null);
  setLocalCompletedAt(backlogItem.completed_at ?? null);
  setLocalAbandonedAt(backlogItem.abandoned_at ?? null);
  setLocalResumedAt(backlogItem.resumed_at ?? null);
 }, [backlogItem]);

 useEffect(() => {
  if (!error) return;
  showToast(error, 'error');
  clearError();
 }, [clearError, error, showToast]);

 function handleStatusChange(value: string) {
  const newStatus = value as BacklogStatusEnum;
  setSelectedStatus(newStatus);
  if (selectedStatus === BacklogStatusEnum.COMPLETED && newStatus !== BacklogStatusEnum.COMPLETED) {
   setLocalCompletedAt(null);
  }
 }

 function handleRatingChange(rating: number) {
  setSelectedRating(rating);
 }

 async function handleAddToBacklog() {
  if (!userId || !game) return;

  const now = new Date().toISOString();
  const isResumableStatus = RESUMABLE_STATUSES.has(selectedStatus);
  const isCompleted = selectedStatus === BacklogStatusEnum.COMPLETED;

  const created = await create({
   user_id: userId,
   game_id: game.id,
   game_name: game.name,
   game_cover_url: game.background_image ?? undefined,
   status: selectedStatus,
   personal_rating: selectedRating > 0 ? selectedRating : undefined,
   started_at: isResumableStatus ? now : undefined,
   completed_at: isCompleted ? now : undefined,
  });

  if (created) {
   showToast(t('gameDetail.addSuccess'), 'success');
  }
 }

 async function handleUpdateBacklog() {
  if (!backlogItem) return;

  const now = new Date().toISOString();
  const today = formatDate(now, i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
  const isCompleted = selectedStatus === BacklogStatusEnum.COMPLETED;
  const isAbandoned = selectedStatus === BacklogStatusEnum.ABANDONED;
  const isWishlist = selectedStatus === BacklogStatusEnum.WISHLIST;
  const isStatusChanging = selectedStatus !== backlogItem.status;
  const isResumableStatus = RESUMABLE_STATUSES.has(selectedStatus);
  const currentStartedAt = localStartedAt ?? backlogItem.started_at ?? null;
  const currentCompletedAt = localCompletedAt ?? backlogItem.completed_at ?? null;
  const currentAbandonedAt = localAbandonedAt ?? backlogItem.abandoned_at ?? null;
  const currentResumedAt = localResumedAt ?? backlogItem.resumed_at ?? null;
  const hasAbandonedHistory = Boolean(currentAbandonedAt);

  const wouldAutoSetStarted = isResumableStatus && !currentStartedAt;
  const wouldAutoSetCompleted = isCompleted && !currentCompletedAt;
  const wouldAutoSetAbandoned = isAbandoned && !currentAbandonedAt;
  const wouldPromptResumed =
   isStatusChanging &&
   isResumableStatus &&
   hasAbandonedHistory &&
   (backlogItem.status === BacklogStatusEnum.ABANDONED || !currentResumedAt);
  const isLeavingCompleted =
   backlogItem.status === BacklogStatusEnum.COMPLETED &&
   !isCompleted &&
   Boolean(currentCompletedAt);
  const hasAnyDates = Boolean(
   currentStartedAt ?? currentCompletedAt ?? currentAbandonedAt ?? currentResumedAt,
  );
  const isGoingToWishlist = isWishlist && hasAnyDates;
  const isLeavingAbandoned =
   backlogItem.status === BacklogStatusEnum.ABANDONED && !isWishlist && hasAbandonedHistory;

  const ACTIVE_STATUSES = new Set([
   BacklogStatusEnum.PLAYING,
   BacklogStatusEnum.ONGOING,
   BacklogStatusEnum.COMPLETED,
   BacklogStatusEnum.ABANDONED,
  ]);
  const shouldUnpin = backlogItem.is_play_next === true && ACTIVE_STATUSES.has(selectedStatus);

  const doUpdate = async (options?: {
   startedAt?: string;
   completedAt?: string;
   abandonedAt?: string;
   resumedAt?: string;
   resetAbandoned?: boolean;
  }) => {
   const dateFields: {
    started_at?: string | null;
    completed_at?: string | null;
    abandoned_at?: string | null;
    resumed_at?: string | null;
   } = {};

   if (isGoingToWishlist) {
    dateFields.started_at = null;
    dateFields.completed_at = null;
    dateFields.abandoned_at = null;
    dateFields.resumed_at = null;
   } else {
    if (localStartedAt !== (backlogItem.started_at ?? null)) {
     dateFields.started_at = localStartedAt;
    }
    if (localCompletedAt !== (backlogItem.completed_at ?? null)) {
     dateFields.completed_at = localCompletedAt;
    }
    if (localAbandonedAt !== (backlogItem.abandoned_at ?? null)) {
     dateFields.abandoned_at = localAbandonedAt;
    }
    if (localResumedAt !== (backlogItem.resumed_at ?? null)) {
     dateFields.resumed_at = localResumedAt;
    }
    if (wouldAutoSetStarted && !('started_at' in dateFields)) {
     dateFields.started_at = options?.startedAt ?? now;
    }
    if (wouldAutoSetCompleted && !('completed_at' in dateFields)) {
     dateFields.completed_at = options?.completedAt ?? now;
    }
    if (wouldAutoSetAbandoned && !('abandoned_at' in dateFields)) {
     dateFields.abandoned_at = options?.abandonedAt ?? now;
    }
    if (wouldPromptResumed && !('resumed_at' in dateFields)) {
     dateFields.resumed_at = options?.resumedAt ?? now;
    }
    if (backlogItem.status === BacklogStatusEnum.COMPLETED && !isCompleted) {
     dateFields.completed_at = null;
    }
    if (options?.resetAbandoned) {
     dateFields.abandoned_at = null;
    }
   }

   const updated = await update(backlogItem.id, {
    status: selectedStatus,
    personal_rating: selectedRating > 0 ? selectedRating : null,
    notes: localNotes.trim().length > 0 ? localNotes : null,
    ...(shouldUnpin ? { is_play_next: false, play_next_priority: null } : {}),
    ...dateFields,
   });

   if (updated) {
    showToast(t('gameDetail.updateSuccess'), 'success');
   }
  };

  if (isGoingToWishlist) {
   setPendingResetAbandoned(false);
   setPendingDateWarning({
    title: t('backlog.dateChange.title'),
    body: t('backlog.dateChange.bodyToWishlist'),
    onConfirm: doUpdate,
   });
   return;
  }

  if (isLeavingAbandoned) {
   const abandonedDate = formatDate(currentAbandonedAt ?? now, i18n.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
   });
   setPendingResetAbandoned(false);
   setPendingDateWarning({
    title: t('backlog.dateChange.title'),
    body: t('backlog.dateChange.bodyLeavingAbandoned', { date: abandonedDate }),
    startedAtInput: wouldAutoSetStarted ? new Date() : undefined,
    completedAtInput: wouldAutoSetCompleted ? new Date() : undefined,
    resumedAtInput: wouldPromptResumed ? new Date() : undefined,
    showResetAbandonedSwitch: true,
    onConfirm: doUpdate,
   });
   return;
  }

  if (wouldAutoSetAbandoned) {
   setPendingResetAbandoned(false);
   setPendingDateWarning({
    title: t('backlog.dateChange.title'),
    body: t('backlog.dateChange.bodyAbandoned'),
    abandonedAtInput: new Date(),
    onConfirm: doUpdate,
   });
   return;
  }

  if (isLeavingCompleted || wouldAutoSetStarted || wouldAutoSetCompleted || wouldPromptResumed) {
   let body: string;
   if (isLeavingCompleted) {
    const completedDate = formatDate(currentCompletedAt ?? now, i18n.language, {
     day: 'numeric',
     month: 'long',
     year: 'numeric',
    });
    body = t('backlog.dateChange.bodyLeavingCompleted', { date: completedDate });
   } else if (wouldPromptResumed) {
    body = t('backlog.dateChange.bodyResumed');
   } else if (wouldAutoSetStarted && wouldAutoSetCompleted) {
    body = t('backlog.dateChange.bodyBoth', { date: today });
   } else if (wouldAutoSetStarted) {
    body = t('backlog.dateChange.bodyPlaying', { date: today });
   } else {
    body = t('backlog.dateChange.bodyCompleted', { date: today });
   }

   setPendingResetAbandoned(false);
   setPendingDateWarning({
    title: t('backlog.dateChange.title'),
    body,
    startedAtInput: wouldAutoSetStarted ? new Date() : undefined,
    completedAtInput: wouldAutoSetCompleted ? new Date() : undefined,
    resumedAtInput: wouldPromptResumed ? new Date() : undefined,
    onConfirm: doUpdate,
   });
   return;
  }

  await doUpdate();
 }

 async function confirmPendingDateWarning() {
  if (!pendingDateWarning) return;
  await pendingDateWarning.onConfirm({
   startedAt: pendingDateWarning.startedAtInput?.toISOString(),
   completedAt: pendingDateWarning.completedAtInput?.toISOString(),
   abandonedAt: pendingDateWarning.abandonedAtInput?.toISOString(),
   resumedAt: pendingDateWarning.resumedAtInput?.toISOString(),
   resetAbandoned: pendingResetAbandoned,
  });
  setPendingDateWarning(null);
  setPendingResetAbandoned(false);
 }

 function dismissPendingDateWarning() {
  setPendingDateWarning(null);
  setPendingResetAbandoned(false);
 }

 function togglePendingResetAbandoned() {
  setPendingResetAbandoned((prev) => !prev);
 }

 function handlePendingStartedAtChange(date: Date) {
  setPendingDateWarning((prev) => (prev ? { ...prev, startedAtInput: date } : null));
 }

 function handlePendingCompletedAtChange(date: Date) {
  setPendingDateWarning((prev) => (prev ? { ...prev, completedAtInput: date } : null));
 }

 function handlePendingAbandonedAtChange(date: Date) {
  setPendingDateWarning((prev) => (prev ? { ...prev, abandonedAtInput: date } : null));
 }

 function handlePendingResumedAtChange(date: Date) {
  setPendingDateWarning((prev) => (prev ? { ...prev, resumedAtInput: date } : null));
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
  localStartedAt,
  localCompletedAt,
  localAbandonedAt,
  localResumedAt,
  statusOptions,
  hasPendingChanges,
  pendingDateWarning,
  pendingResetAbandoned,
  setLocalNotes,
  setLocalStartedAt,
  setLocalCompletedAt,
  setLocalAbandonedAt,
  setLocalResumedAt,
  handleStatusChange,
  handleRatingChange,
  handleAddToBacklog,
  handleUpdateBacklog,
  handleRemoveFromBacklog,
  confirmPendingDateWarning,
  dismissPendingDateWarning,
  togglePendingResetAbandoned,
  handlePendingStartedAtChange,
  handlePendingCompletedAtChange,
  handlePendingAbandonedAtChange,
  handlePendingResumedAtChange,
 } as const;
}
