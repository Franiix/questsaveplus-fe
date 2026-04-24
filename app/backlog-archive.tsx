import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { GradientUnderline } from '@/components/base/display/GradientUnderline';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { useBacklogStatusPresentation } from '@/hooks/useBacklogStatusPresentation';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useToastStore } from '@/stores/toast.store';

const LIST_CONTENT_STYLE = {
 paddingHorizontal: spacing.md,
 paddingTop: spacing.sm,
 paddingBottom: layout.screenBottomPadding,
 gap: spacing.sm,
} as const;

export default function BacklogArchiveScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const { labelMap, colorMap, iconMap } = useBacklogStatusPresentation();
 const { prefetchGameById } = usePrefetchGameResources();
 const showToast = useToastStore((state) => state.showToast);
 const session = useAuthStore((state) => state.session);
 const archivedBacklogItems = useBacklogStore((state) => state.archivedBacklogItems);
 const isReadingList = useBacklogStore((state) => state.isReadingList);
 const isMutating = useBacklogStore((state) => state.isMutating);
 const activeMutation = useBacklogStore((state) => state.activeMutation);
 const error = useBacklogStore((state) => state.error);
 const readAll = useBacklogStore((state) => state.readAll);
 const update = useBacklogStore((state) => state.update);
 const deleteBacklogItem = useBacklogStore((state) => state.delete);
 const clearError = useBacklogStore((state) => state.clearError);
 const clearBacklog = useBacklogStore((state) => state.clearBacklog);
 const [pendingDeleteItem, setPendingDeleteItem] = useState<BacklogItemEntity | null>(null);
 const [pendingRestoreItem, setPendingRestoreItem] = useState<BacklogItemEntity | null>(null);

 const userId = session?.user?.id;

 useEffect(() => {
  if (!userId) {
   clearBacklog();
   return;
  }

  void readAll(userId, { target: 'archivedBacklogItems', includeArchived: true });
 }, [clearBacklog, readAll, userId]);

 const archivedItems = useMemo(
  () =>
   [...archivedBacklogItems].sort(
    (first, second) => new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime(),
   ),
  [archivedBacklogItems],
 );

 const handleRestore = useCallback(
  async (item: BacklogItemEntity) => {
   clearError();
   await update(item.id, { is_archived: false });
   const updateError = useBacklogStore.getState().error;

   if (!updateError) {
    showToast(t('backlog.archive.restoreSuccess'), 'success');
   } else {
    showToast(updateError, 'error');
   }
  },
  [clearError, showToast, t, update],
 );

 const handleConfirmRestore = useCallback(async () => {
  if (!pendingRestoreItem) return;
  await handleRestore(pendingRestoreItem);
  setPendingRestoreItem(null);
 }, [handleRestore, pendingRestoreItem]);

 const handleConfirmRemove = useCallback(async () => {
  if (!pendingDeleteItem) return;

  clearError();
  await deleteBacklogItem(pendingDeleteItem.id);
  const deleteError = useBacklogStore.getState().error;

  if (!deleteError) {
   showToast(t('gameDetail.removeSuccess'), 'success');
  } else {
   showToast(deleteError, 'error');
  }

  setPendingDeleteItem(null);
 }, [clearError, deleteBacklogItem, pendingDeleteItem, showToast, t]);

 const handleOpenGame = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
   router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
  },
  [prefetchGameById, router],
 );

 const handlePressIn = useCallback(
  (item: BacklogItemEntity) => {
   void prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []);
  },
  [prefetchGameById],
 );

 if (isReadingList) {
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <LoadingSpinner fullScreen />
   </SafeAreaView>
  );
 }

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('backlog.archive.title')} onBack={() => router.back()} />

   <View
    style={{
     paddingHorizontal: spacing.md,
     paddingTop: layout.screenContentTopPadding,
     paddingBottom: spacing.sm,
     gap: spacing.sm,
    }}
   >
    <View style={{ gap: 6 }}>
     <Text
      style={{
       fontFamily: typography.font.bold,
       fontSize: typography.size['2xl'],
       color: colors.text.primary,
       letterSpacing: typography.letterSpacing.tight,
      }}
     >
      {t('backlog.archive.title')}
     </Text>
     <GradientUnderline />
    </View>
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.relaxed),
     }}
    >
     {t('backlog.archive.description')}
    </Text>
   </View>

   {error ? (
    <View style={{ paddingTop: spacing.xl }}>
     <EmptyState
      icon="exclamation-triangle"
      title={t('auth.errors.generic')}
      action={{
       label: t('home.errorRetry'),
       onPress: () => {
        if (!userId) return;
        void readAll(userId, { target: 'archivedBacklogItems', includeArchived: true });
       },
      }}
     />
    </View>
   ) : archivedItems.length === 0 ? (
    <View style={{ paddingTop: spacing.xl }}>
     <EmptyState
      icon="archive"
      title={t('backlog.archive.emptyTitle')}
      subtitle={t('backlog.archive.emptySubtitle')}
     />
    </View>
   ) : (
    <FlatList
     data={archivedItems}
     keyExtractor={(item) => item.id}
     contentContainerStyle={LIST_CONTENT_STYLE}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
     renderItem={({ item }) => (
      <BacklogListItem
       item={item}
       onPress={handleOpenGame}
       onPressIn={handlePressIn}
       onQuickStatusChange={() => undefined}
       onToggleArchive={(item) => setPendingRestoreItem(item)}
       onRequestRemove={setPendingDeleteItem}
       removeLabel={t('gameDetail.confirmRemove.confirm')}
       archiveLabel={t('backlog.archive.action')}
       restoreArchiveLabel={t('backlog.archive.restoreAction')}
       labelMap={labelMap}
       colorMap={colorMap}
       iconMap={iconMap}
       quickActionsMode="hidden"
       showAddedDate
       isUpdatingArchive={isMutating && activeMutation === 'update'}
      />
     )}
    />
   )}

   <ConfirmModal
    visible={pendingDeleteItem !== null}
    title={t('gameDetail.confirmRemove.title')}
    message={t('gameDetail.confirmRemove.message')}
    confirmLabel={t('gameDetail.confirmRemove.confirm')}
    cancelLabel={t('common.cancel')}
    isDestructive
    onConfirm={() => void handleConfirmRemove()}
    onCancel={() => setPendingDeleteItem(null)}
   />

   <ConfirmModal
    visible={pendingRestoreItem !== null}
    title={t('backlog.archive.restoreModalTitle')}
    message={t('backlog.archive.restoreModalMessage')}
    confirmLabel={t('backlog.archive.restoreAction')}
    cancelLabel={t('common.cancel')}
    onConfirm={() => void handleConfirmRestore()}
    onCancel={() => setPendingRestoreItem(null)}
   />
  </SafeAreaView>
 );
}
