import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { FilterChip } from '@/components/base/inputs/FilterChip';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors, spacing } from '@/shared/theme/tokens';

type FilterChipRowProps = {
 activeFilter: BacklogStatusEnum | null;
 onFilterChange: (filter: BacklogStatusEnum | null) => void;
};

type FilterDefinition = {
 value: BacklogStatusEnum | null;
 labelKey: string;
 color: string;
};

const FILTERS: FilterDefinition[] = [
 {
  value: null,
  labelKey: 'backlog.filterAll',
  color: colors.primary.DEFAULT,
 },
 {
  value: BacklogStatusEnum.WISHLIST,
  labelKey: 'backlog.status.WISHLIST',
  color: colors.status.wishlist,
 },
 {
  value: BacklogStatusEnum.WANT_TO_PLAY,
  labelKey: 'backlog.status.WANT_TO_PLAY',
  color: colors.status.want_to_play,
 },
 {
  value: BacklogStatusEnum.PLAYING,
  labelKey: 'backlog.status.PLAYING',
  color: colors.status.playing,
 },
 {
  value: BacklogStatusEnum.ONGOING,
  labelKey: 'backlog.status.ONGOING',
  color: colors.status.ongoing,
 },
 {
  value: BacklogStatusEnum.COMPLETED,
  labelKey: 'backlog.status.COMPLETED',
  color: colors.status.completed,
 },
 {
  value: BacklogStatusEnum.ABANDONED,
  labelKey: 'backlog.status.ABANDONED',
  color: colors.status.abandoned,
 },
];

/**
 * Riga scrollabile orizzontale di FilterChip per filtrare i giochi per stato backlog.
 *
 * Il filtro "All" (null) deseleziona qualsiasi filtro attivo.
 * I colori di ogni chip rispecchiano il colore di stato definito nei token.
 */
export function FilterChipRow({ activeFilter, onFilterChange }: FilterChipRowProps) {
 const { t } = useTranslation();

 return (
  <ScrollView
   horizontal
   showsHorizontalScrollIndicator={false}
   keyboardShouldPersistTaps="handled"
   contentContainerStyle={{
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
   }}
  >
   {FILTERS.map((filter) => {
    const label = t(filter.labelKey);
    const isSelected = activeFilter === filter.value;

    return (
     <FilterChip
      key={filter.value ?? '__all__'}
      label={label}
      isSelected={isSelected}
      onPress={() => onFilterChange(filter.value)}
      color={filter.color}
     />
    );
   })}
  </ScrollView>
 );
}
