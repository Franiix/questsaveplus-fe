import { FlatList, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
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
 onRefetch: () => void;
 onRequestRemove: (item: BacklogItemEntity) => void;
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

export function BacklogScreenContent({
 colorMap,
 iconMap,
 labelMap,
 state,
 onFilterChange,
 onItemPress,
 onRefetch,
 onRequestRemove,
 removeLabel,
 retryLabel,
}: BacklogScreenContentProps) {
 const { t } = useTranslation();

 const renderItem = useCallback(
  ({ item }: { item: BacklogItemEntity }) => (
   <BacklogListItem
    item={item}
    onPress={onItemPress}
    onRequestRemove={onRequestRemove}
    removeLabel={removeLabel}
    labelMap={labelMap}
    colorMap={colorMap}
    iconMap={iconMap}
   />
  ),
  [onItemPress, onRequestRemove, removeLabel, labelMap, colorMap, iconMap],
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
}
