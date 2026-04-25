import { View } from 'react-native';
import { spacing } from '@/shared/theme/tokens';
import { FilterChip } from './FilterChip';

type ChipOption = {
 label: string;
 value: string;
 icon?: string;
 color?: string;
 isDisabled?: boolean;
 allowPressWhenDisabled?: boolean;
};

type ChipGroupSingle = {
 options: ChipOption[];
 multiple?: false;
 value: string | undefined;
 onChange: (value: string) => void;
 color?: string;
 isDisabled?: boolean;
};

type ChipGroupMultiple = {
 options: ChipOption[];
 multiple: true;
 value: string[];
 onChange: (value: string[]) => void;
 color?: string;
 isDisabled?: boolean;
};

type ChipGroupProps = ChipGroupSingle | ChipGroupMultiple;

/**
 * Atom: gruppo di FilterChip con gestione selezione singola o multipla.
 *
 * multiple=false (default): selezione singola, onChange riceve il valore selezionato.
 * multiple=true: selezione multipla, onChange riceve l'array aggiornato.
 */
export function ChipGroup(props: ChipGroupProps) {
 function handlePress(optionValue: string) {
  if (props.multiple) {
   const current = props.value as string[];
   const next = current.includes(optionValue)
    ? current.filter((v) => v !== optionValue)
    : [...current, optionValue];
   (props.onChange as (value: string[]) => void)(next);
  } else {
   (props.onChange as (value: string) => void)(optionValue);
  }
 }

 function isSelected(optionValue: string): boolean {
  if (props.multiple) {
   return props.value.includes(optionValue);
  }
  return props.value === optionValue;
 }

 return (
  <View
   style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
   }}
  >
   {props.options.map((option) => (
    <FilterChip
     key={option.value}
     label={option.label}
     isSelected={isSelected(option.value)}
     onPress={() => handlePress(option.value)}
     isDisabled={option.isDisabled ?? props.isDisabled}
     allowPressWhenDisabled={option.allowPressWhenDisabled}
     color={option.color ?? props.color}
     icon={option.icon}
    />
   ))}
  </View>
 );
}
