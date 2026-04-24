import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { BacklogPlayNextCallout } from '@/components/backlog/BacklogPlayNextCallout';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { FilterChipRow } from '@/components/game/FilterChipRow';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import type {
 BacklogScreenContentState,
 BacklogStatusColorMap,
 BacklogStatusIconMap,
 BacklogStatusLabelMap,
} from '@/shared/models/backlog/BacklogScreenContent.model';
import { layout, spacing } from '@/shared/theme/tokens';

type BacklogScreenContentProps = {
 colorMap: BacklogStatusColorMap;
 iconMap: BacklogStatusIconMap;
 labelMap: BacklogStatusLabelMap;
 state: BacklogScreenContentState;
 onFilterChange: (value: BacklogStatusEnum | null) => void;
 onItemPress: (item: BacklogItemEntity) => void;
 onItemPressIn?: (item: BacklogItemEntity) => void;
 onQuickStatusChange: (item: BacklogItemEntity, status: BacklogStatusEnum) => void;
 onOpenPlayNext: () => void;
 onTogglePlayNext: (item: BacklogItemEntity) => void;
 onToggleArchive: (item: BacklogItemEntity) => void;
 onOpenHome: () => void;
 onRefetch: () => void;
 onRequestRemove: (item: BacklogItemEntity) => void;
 onRatingChange: (item: BacklogItemEntity, rating: number) => void;
 isUpdatingStatus?: boolean;
 isUpdatingPlayNext?: boolean;
 isUpdatingArchive?: boolean;
 removeLabel: string;
 retryLabel: string;
 emptyActionLabel: string;
};

const HORIZONTAL_PADDING = spacing.md;

const listContentStyle = StyleSheet.create({
 container: {
  paddingHorizontal: HORIZONTAL_PADDING,
  paddingTop: spacing.sm,
  paddingBottom: layout.screenBottomPadding,
  gap: spacing.sm,
 },
});

export const BacklogScreenContent = memo(function BacklogScreenContent({
 colorMap,
 iconMap,
 labelMap,
 state,
 onFilterChange,
 onItemPress,
 onItemPressIn,
 onQuickStatusChange,
 onOpenPlayNext,
 onTogglePlayNext,
 onToggleArchive,
 onOpenHome,
 onRefetch,
 onRequestRemove,
 onRatingChange,
 isUpdatingStatus = false,
 isUpdatingPlayNext = false,
 isUpdatingArchive = false,
 removeLabel,
 retryLabel,
 emptyActionLabel,
}: BacklogScreenContentProps) {
 const { t } = useTranslation();
 const isCompletelyEmpty = !state.hasAppliedFilters && state.totalItems === 0;

 const renderItem = useCallback(
  ({ item }: { item: BacklogItemEntity }) => (
   <BacklogListItem
    item={item}
    onPress={onItemPress}
    onPressIn={onItemPressIn}
    onQuickStatusChange={onQuickStatusChange}
    onTogglePlayNext={onTogglePlayNext}
    onToggleArchive={onToggleArchive}
    onRequestRemove={onRequestRemove}
    isUpdatingStatus={isUpdatingStatus}
    isUpdatingPlayNext={isUpdatingPlayNext}
    isUpdatingArchive={isUpdatingArchive}
    playNextPinLabel={t('backlog.playNext.pinAction')}
    playNextUnpinLabel={t('backlog.playNext.unpinAction')}
    archiveLabel={t('backlog.archive.action')}
    restoreArchiveLabel={t('backlog.archive.restoreAction')}
    removeLabel={removeLabel}
    labelMap={labelMap}
    colorMap={colorMap}
    iconMap={iconMap}
    showAddedDate
    onRatingChange={onRatingChange}
   />
  ),
  [
   onItemPress,
   onItemPressIn,
   onQuickStatusChange,
   onTogglePlayNext,
   onToggleArchive,
   onRequestRemove,
   onRatingChange,
   isUpdatingStatus,
   isUpdatingPlayNext,
   isUpdatingArchive,
   removeLabel,
   labelMap,
   colorMap,
   iconMap,
   t,
  ],
 );

 if (state.isReadingList) {
  return <LoadingSpinner fullScreen />;
 }

 if (state.error) {
  return (
   <View style={{ paddingTop: spacing.md }}>
    <EmptyState
     icon="exclamation-triangle"
     title={t('auth.errors.generic')}
     action={{ label: retryLabel, onPress: onRefetch }}
    />
   </View>
  );
 }

 if (isCompletelyEmpty) {
  return (
   <View style={{ flex: 1 }}>
    <EmptyState
     icon="bookmark"
     title={t('backlog.emptyAll.title')}
     subtitle={t('backlog.emptyAll.subtitle')}
     action={{ label: emptyActionLabel, onPress: onOpenHome }}
    />
   </View>
  );
 }

 return (
  <>
   <View style={{ marginBottom: spacing.xs }}>
    <FilterChipRow
     activeFilter={state.activeFilter}
     onFilterChange={onFilterChange}
     countMap={state.statusCounts}
    />
   </View>
   <BacklogPlayNextCallout playNextCount={state.playNextCount} onPress={onOpenPlayNext} />

   {state.filteredItems.length === 0 ? (
    <View style={{ paddingTop: spacing.md }}>
     <EmptyState
      icon={state.hasAppliedFilters ? 'filter' : 'bookmark'}
      title={
       state.hasAppliedFilters ? t('backlog.emptyFiltered.title') : t('backlog.emptyAll.title')
      }
      subtitle={
       state.hasAppliedFilters
        ? t('backlog.emptyFiltered.subtitle')
        : t('backlog.emptyAll.subtitle')
      }
     />
    </View>
   ) : (
    <FlatList
     data={state.filteredItems}
     renderItem={renderItem}
     keyExtractor={(item) => item.id}
     contentContainerStyle={listContentStyle.container}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
     initialNumToRender={12}
     maxToRenderPerBatch={10}
     windowSize={8}
     removeClippedSubviews
    />
   )}
  </>
 );
});
