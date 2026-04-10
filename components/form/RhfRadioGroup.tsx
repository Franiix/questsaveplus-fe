import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { RadioGroup } from '@/components/base/inputs/RadioGroup';
import type { SelectOption } from '@/components/base/inputs/SelectInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfRadioGroupProps<TFieldValues extends FieldValues, TFieldName extends Path<TFieldValues>> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 options: SelectOption[];
 label?: string;
 rules?: Omit<
  RegisterOptions<TFieldValues, TFieldName>,
  'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
 >;
 isDisabled?: boolean;
 direction?: 'column' | 'row';
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 accessibilityLabel?: string;
 errorColor?: string;
};

export function RhfRadioGroup<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 options,
 label,
 rules,
 isDisabled = false,
 direction,
 containerStyle,
 labelStyle,
 errorStyle,
 accessibilityLabel,
 errorColor = colors.error,
}: RhfRadioGroupProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? <FormLabel style={labelStyle}>{label}</FormLabel> : null}

     <RadioGroup
      options={options}
      value={value as string | undefined}
      onChange={onChange}
      isDisabled={isDisabled}
      direction={direction}
      accessibilityLabel={accessibilityLabel ?? label}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
