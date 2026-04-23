import { FontAwesome5 } from '@expo/vector-icons';
import { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import { BacklogPlayNextCallout } from '@/components/backlog/BacklogPlayNextCallout';
import { HintBox } from '@/components/base/display/HintBox';
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
import { spacing } from '@/shared/theme/tokens';

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
 onRefetch: () => void;
 onRequestRemove: (item: BacklogItemEntity) => void;
 isUpdatingStatus?: boolean;
 isUpdatingPlayNext?: boolean;
 removeLabel: string;
 retryLabel: string;
};

const HORIZONTAL_PADDING = spacing.md;

const listContentStyle = StyleSheet.create({
 container: {
  paddingHorizontal: HORIZONTAL_PADDING,
  paddingTop: spacing.sm,
  paddingBottom: 110,
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
 onRefetch,
 onRequestRemove,
 isUpdatingStatus = false,
 isUpdatingPlayNext = false,
 removeLabel,
 retryLabel,
}: BacklogScreenContentProps) {
 const { t } = useTranslation();
 const [isHintExpanded, setIsHintExpanded] = useState(false);

 const renderItem = useCallback(
  ({ item }: { item: BacklogItemEntity }) => (
   <BacklogListItem
    item={item}
    onPress={onItemPress}
    onPressIn={onItemPressIn}
    onQuickStatusChange={onQuickStatusChange}
    onTogglePlayNext={onTogglePlayNext}
    onRequestRemove={onRequestRemove}
    isUpdatingStatus={isUpdatingStatus}
    isUpdatingPlayNext={isUpdatingPlayNext}
    playNextPinLabel={t('backlog.playNext.pinAction')}
    playNextUnpinLabel={t('backlog.playNext.unpinAction')}
    showPlayNextRank
    removeLabel={removeLabel}
    labelMap={labelMap}
    colorMap={colorMap}
    iconMap={iconMap}
   />
  ),
  [
   onItemPress,
   onItemPressIn,
   onQuickStatusChange,
   onTogglePlayNext,
   onRequestRemove,
   isUpdatingStatus,
   isUpdatingPlayNext,
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

 return (
  <>
   <View style={{ marginBottom: spacing.xs }}>
    <FilterChipRow activeFilter={state.activeFilter} onFilterChange={onFilterChange} />
   </View>
   <HintBox
    style={{
     marginHorizontal: HORIZONTAL_PADDING,
     marginBottom: spacing.sm,
     gap: spacing.sm,
    }}
   >
    <Pressable
     accessibilityRole="button"
     accessibilityLabel={
      isHintExpanded ? t('backlog.interactionHintHide') : t('backlog.interactionHintShow')
     }
     onPress={() => setIsHintExpanded((current) => !current)}
     style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    }}
    >
     <FontAwesome5 name="info-circle" size={14} color={colorMap.PLAYING} solid />
     <Text
      style={{
       flex: 1,
       color: '#FFFFFF',
       fontSize: 12,
       lineHeight: 18,
       fontWeight: '600',
      }}
     >
      {t('backlog.interactionHintTitle')}
     </Text>
     <FontAwesome5
      name={isHintExpanded ? 'chevron-up' : 'chevron-down'}
      size={12}
      color="#FFFFFF"
      solid
     />
    </Pressable>
    {isHintExpanded ? (
     <Text
      style={{
       color: '#FFFFFF',
       fontSize: 12,
       lineHeight: 18,
      }}
     >
      {t('backlog.interactionHint')}
     </Text>
    ) : null}
   </HintBox>
   <BacklogPlayNextCallout playNextCount={state.playNextCount} onPress={onOpenPlayNext} />

   {state.filteredItems.length === 0 ? (
    <View style={{ paddingTop: spacing.md }}>
     <EmptyState
      icon="gamepad"
      title={state.hasAppliedFilters ? t('backlog.emptyFiltered.title') : t('backlog.emptyAll.title')}
      subtitle={state.hasAppliedFilters ? t('backlog.emptyFiltered.subtitle') : t('backlog.emptyAll.subtitle')}
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
