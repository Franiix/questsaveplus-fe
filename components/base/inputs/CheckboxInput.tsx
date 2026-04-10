import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, colors, opacity, spacing, typography } from '@/shared/theme/tokens';

const BOX_SIZE = 22;

type CheckboxInputProps = {
 checked: boolean;
 onChange: (checked: boolean) => void;
 label?: string;
 isDisabled?: boolean;
 accessibilityLabel?: string;
};

/**
 * Atom: checkbox stilata con design token QuestSave+.
 *
 * Mostra un box 22×22 con checkmark Ionicons quando selezionato.
 * Supporta label inline a destra e stato disabilitato.
 */
export function CheckboxInput({
 checked,
 onChange,
 label,
 isDisabled = false,
 accessibilityLabel,
}: CheckboxInputProps) {
 return (
  <Pressable
   onPress={() => {
    if (!isDisabled) onChange(!checked);
   }}
   accessibilityRole="checkbox"
   accessibilityLabel={accessibilityLabel ?? label}
   accessibilityState={{ checked, disabled: isDisabled }}
   style={({ pressed }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    opacity: isDisabled ? opacity.disabled : pressed ? 0.75 : 1,
    alignSelf: 'flex-start',
   })}
  >
   <View
    style={{
     width: BOX_SIZE,
     height: BOX_SIZE,
     borderRadius: borderRadius.sm,
     borderWidth: checked ? 0 : 1,
     borderColor: colors.border.DEFAULT,
     backgroundColor: checked ? colors.primary.DEFAULT : 'transparent',
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    {checked ? <FontAwesome5 name="check" size={12} color={colors.text.primary} solid /> : null}
   </View>

   {label ? (
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      flex: 1,
     }}
    >
     {label}
    </Text>
   ) : null}
  </Pressable>
 );
}
