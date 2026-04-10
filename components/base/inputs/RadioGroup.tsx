import { Pressable, Text, View } from 'react-native';
import { borderRadius, colors, opacity, spacing, typography } from '@/shared/theme/tokens';
import type { SelectOption } from './SelectInput';

const RADIO_SIZE = 20;
const DOT_SIZE = 10;

type RadioGroupProps = {
 options: SelectOption[];
 value?: string;
 onChange: (value: string) => void;
 isDisabled?: boolean;
 direction?: 'column' | 'row';
 accessibilityLabel?: string;
};

/**
 * Atom: selezione singola tra opzioni sempre visibili (alternativa modale a SelectInput).
 *
 * Ogni opzione mostra un cerchio radio 20×20 con punto interno quando selezionata.
 * Supporta layout column (default) o row con wrap automatico.
 */
export function RadioGroup({
 options,
 value,
 onChange,
 isDisabled = false,
 direction = 'column',
 accessibilityLabel,
}: RadioGroupProps) {
 return (
  <View
   accessibilityLabel={accessibilityLabel}
   accessibilityRole="radiogroup"
   style={{
    flexDirection: direction,
    flexWrap: direction === 'row' ? 'wrap' : 'nowrap',
    gap: direction === 'column' ? spacing.sm : spacing.md,
   }}
  >
   {options.map((option) => {
    const isSelected = option.value === value;

    return (
     <Pressable
      key={option.value}
      onPress={() => {
       if (!isDisabled) onChange(option.value);
      }}
      accessibilityRole="radio"
      accessibilityLabel={option.label}
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      style={({ pressed }) => ({
       flexDirection: 'row',
       alignItems: 'center',
       gap: spacing.sm,
       opacity: isDisabled ? opacity.disabled : pressed ? 0.75 : 1,
      })}
     >
      {/* Cerchio esterno */}
      <View
       style={{
        width: RADIO_SIZE,
        height: RADIO_SIZE,
        borderRadius: borderRadius.full,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? colors.primary.DEFAULT : colors.border.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
       }}
      >
       {isSelected ? (
        <View
         style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: borderRadius.full,
          backgroundColor: colors.primary.DEFAULT,
         }}
        />
       ) : null}
      </View>

      <Text
       style={{
        color: isSelected ? colors.text.primary : colors.text.secondary,
        fontSize: typography.size.md,
        fontWeight: isSelected
         ? (typography.weight.medium as '500')
         : (typography.weight.regular as '400'),
       }}
      >
       {option.label}
      </Text>
     </Pressable>
    );
   })}
  </View>
 );
}
