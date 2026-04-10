import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';

export type GameGridSortOrder = 'relevance' | 'rating' | 'released' | 'name';

type GameGridHeaderProps = {
  /** Numero di risultati da mostrare (es. 120). */
  resultCount: number;
  sortOrder: GameGridSortOrder;
  onSortChange: (order: GameGridSortOrder) => void;
  style?: StyleProp<ViewStyle>;
};

const SORT_LABELS: Record<GameGridSortOrder, string> = {
  relevance: 'Rilevanza',
  rating: 'Voto',
  released: 'Data',
  name: 'Nome',
};

const SORT_CYCLE: GameGridSortOrder[] = ['relevance', 'rating', 'released', 'name'];

/**
 * Molecule: header sticky per la griglia giochi con
 * contatore risultati e controllo ordinamento.
 */
export function GameGridHeader({
  resultCount,
  sortOrder,
  onSortChange,
  style,
}: GameGridHeaderProps) {
  function handleSortPress() {
    const currentIdx = SORT_CYCLE.indexOf(sortOrder);
    const nextIdx = (currentIdx + 1) % SORT_CYCLE.length;
    onSortChange(SORT_CYCLE[nextIdx]);
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        style,
      ]}
    >
      {/* Result count */}
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: typography.font.regular,
          fontSize: typography.size.sm,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontFamily: typography.font.semibold,
          }}
        >
          {resultCount}
        </Text>
        {' '}
        {resultCount === 1 ? 'gioco' : 'giochi'}
      </Text>

      {/* Sort toggle */}
      <Pressable
        onPress={handleSortPress}
        accessibilityRole="button"
        accessibilityLabel={`Ordina per ${SORT_LABELS[sortOrder]}`}
        hitSlop={8}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          opacity: pressed ? 0.6 : 1,
          backgroundColor: colors.background.elevated,
          borderRadius: 8,
          paddingHorizontal: spacing.sm,
          paddingVertical: 6,
        })}
      >
        <FontAwesome5 name="sort-amount-down" size={11} color={colors.primary.DEFAULT} solid />
        <Text
          style={{
            color: colors.primary.DEFAULT,
            fontFamily: typography.font.medium,
            fontSize: typography.size.sm,
          }}
        >
          {SORT_LABELS[sortOrder]}
        </Text>
      </Pressable>
    </View>
  );
}
