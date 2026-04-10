import { Switch, Text, View } from 'react-native';
import { colors, opacity, spacing, typography } from '@/shared/theme/tokens';

type SwitchInputProps = {
 value: boolean;
 onChange: (value: boolean) => void;
 label?: string;
 isDisabled?: boolean;
 accessibilityLabel?: string;
};

/**
 * Atom: toggle on/off stilato con design token QuestSave+.
 *
 * Layout row: label a sinistra (flex:1), Switch a destra.
 * Colori track e thumb allineati al brand.
 */
export function SwitchInput({
 value,
 onChange,
 label,
 isDisabled = false,
 accessibilityLabel,
}: SwitchInputProps) {
 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    opacity: isDisabled ? opacity.disabled : 1,
   }}
  >
   {label ? (
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      flex: 1,
      marginRight: spacing.md,
     }}
    >
     {label}
    </Text>
   ) : null}

   <Switch
    value={value}
    onValueChange={onChange}
    disabled={isDisabled}
    accessibilityLabel={accessibilityLabel ?? label}
    trackColor={{
     false: colors.border.DEFAULT,
     true: colors.primary.DEFAULT,
    }}
    thumbColor={colors.text.primary}
    ios_backgroundColor={colors.border.DEFAULT}
   />
  </View>
 );
}
