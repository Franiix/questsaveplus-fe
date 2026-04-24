import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { borderRadius, colors } from '@/shared/theme/tokens';

type SortIconButtonProps = {
 onPress: () => void;
 accessibilityLabel: string;
 isActive?: boolean;
 isDisabled?: boolean;
};

export function SortIconButton({
 onPress,
 accessibilityLabel,
 isActive = false,
 isDisabled = false,
}: SortIconButtonProps) {
 return (
  <Pressable
   onPress={onPress}
   disabled={isDisabled}
   accessibilityRole="button"
   accessibilityLabel={accessibilityLabel}
   style={({ pressed }) => ({
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg + 2,
    borderWidth: 1,
    borderColor: isActive || pressed ? colors.primary.DEFAULT : colors.border.strong,
    backgroundColor:
     isActive || pressed ? `${colors.primary.DEFAULT}18` : colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isDisabled ? 0.5 : 1,
   })}
  >
   <FontAwesome5
    name="sort-amount-down"
    size={18}
    color={
     isDisabled ? colors.text.tertiary : isActive ? colors.primary.DEFAULT : colors.text.secondary
    }
    solid
   />
  </Pressable>
 );
}
