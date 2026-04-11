import { FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { FilterChipRow } from '@/components/game/FilterChipRow';
import { BacklogListItem } from '@/components/backlog/BacklogListItem';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import type { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { spacing } from '@/shared/theme/tokens';

type BacklogScreenContentProps = {
 activeFilter: BacklogStatusEnum | null;
 colorMap: Record<string, string>;
 error?: string | null;
 filteredItems: BacklogItemEntity[];
 hasAppliedFilters: boolean;
 isReadingList: boolean;
 labelMap: Record<string, string>;
 onFilterChange: (value: BacklogStatusEnum | null) => void;
 onItemPress: (item: BacklogItemEntity) => void;
 onRefetch: () => void;
 onRequestRemove: (item: BacklogItemEntity) => void;
 removeLabel: string;
 retryLabel: string;
};

const HORIZONTAL_PADDING = spacing.md;

export function BacklogScreenContent({
 activeFilter,
 colorMap,
 error,
 filteredItems,
 hasAppliedFilters,
 isReadingList,
 labelMap,
 onFilterChange,
 onItemPress,
 onRefetch,
 onRequestRemove,
 removeLabel,
 retryLabel,
}: BacklogScreenContentProps) {
 const { t } = useTranslation();

 if (isReadingList) {
  return <LoadingSpinner fullScreen />;
 }

 if (error) {
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
    <FilterChipRow activeFilter={activeFilter} onFilterChange={onFilterChange} />
   </View>

   {filteredItems.length === 0 ? (
    <View style={{ paddingTop: spacing.md }}>
     <EmptyState
      icon="gamepad"
      title={hasAppliedFilters ? t('backlog.emptyFiltered.title') : t('backlog.emptyAll.title')}
      subtitle={hasAppliedFilters ? t('backlog.emptyFiltered.subtitle') : t('backlog.emptyAll.subtitle')}
     />
    </View>
   ) : (
    <FlatList
     data={filteredItems}
     renderItem={({ item }) => (
      <BacklogListItem
       item={item}
       onPress={onItemPress}
       onRequestRemove={onRequestRemove}
       removeLabel={removeLabel}
       labelMap={labelMap}
       colorMap={colorMap}
      />
     )}
     keyExtractor={(item) => item.id}
     contentContainerStyle={{
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacing.sm,
      paddingBottom: 110,
      gap: spacing.sm,
     }}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
    />
   )}
  </>
 );
}
