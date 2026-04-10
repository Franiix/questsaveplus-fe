import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type StatusOption = {
  value: BacklogStatusEnum;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: BacklogStatusEnum.WISHLIST, label: 'Wishlist', icon: 'shopping-bag', color: colors.status.wishlist },
  { value: BacklogStatusEnum.WANT_TO_PLAY, label: 'Da giocare', icon: 'gamepad', color: colors.info },
  { value: BacklogStatusEnum.PLAYING, label: 'In corso', icon: 'play-circle', color: colors.status.playing },
  { value: BacklogStatusEnum.ONGOING, label: 'Ricorrente', icon: 'sync-alt', color: colors.status.ongoing },
  { value: BacklogStatusEnum.COMPLETED, label: 'Completato', icon: 'check-circle', color: colors.success },
  { value: BacklogStatusEnum.ABANDONED, label: 'Abbandonato', icon: 'times-circle', color: colors.error },
];

type BacklogStatusSelectorProps = {
  value: BacklogStatusEnum | null;
  onChange: (status: BacklogStatusEnum) => void;
};

/**
 * Molecule: picker visivo con card grandi per selezionare il backlog status.
 * Ogni opzione ha icona grande, label e colore brand.
 */
export function BacklogStatusSelector({ value, onChange }: BacklogStatusSelectorProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
      }}
    >
      {STATUS_OPTIONS.map((option) => (
        <StatusCard
          key={option.value}
          option={option}
          isSelected={value === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

// ─── StatusCard ───────────────────────────────────────────────────────────────

type StatusCardProps = {
  option: StatusOption;
  isSelected: boolean;
  onPress: () => void;
};

function StatusCard({ option, isSelected, onPress }: StatusCardProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(isSelected ? 1 : 0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: `${option.color}${Math.round(glow.value * 255).toString(16).padStart(2, '0')}`,
    backgroundColor: isSelected
      ? `${option.color}1A`
      : colors.background.elevated,
  }));

  function handlePressIn() {
    scale.value = withSpring(0.94, { damping: 14, stiffness: 200 });
  }

  function handlePressOut() {
    scale.value = withSpring(1, { damping: 14, stiffness: 200 });
    glow.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={option.label}
      style={{ flex: 1, minWidth: '45%' }}
    >
      <Animated.View
        style={[
          cardStyle,
          {
            borderRadius: borderRadius.md,
            borderWidth: 1.5,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.sm,
            alignItems: 'center',
            gap: spacing.xs,
          },
        ]}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${option.color}22`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesome5
            name={option.icon}
            size={20}
            color={isSelected ? option.color : colors.text.secondary}
            solid
          />
        </View>
        <Text
          style={{
            color: isSelected ? option.color : colors.text.secondary,
            fontFamily: isSelected ? typography.font.semibold : typography.font.regular,
            fontSize: typography.size.sm,
            textAlign: 'center',
          }}
        >
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
