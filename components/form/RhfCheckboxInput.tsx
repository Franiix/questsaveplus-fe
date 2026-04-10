import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { CheckboxInput } from '@/components/base/inputs/CheckboxInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';

type RhfCheckboxInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 /** Label inline accanto al checkbox (pattern naturale per i boolean). */
 label?: string;
 rules?: Omit<
  RegisterOptions<TFieldValues, TFieldName>,
  'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
 >;
 isDisabled?: boolean;
 containerStyle?: StyleProp<ViewStyle>;
 errorStyle?: StyleProp<TextStyle>;
 accessibilityLabel?: string;
 errorColor?: string;
};

export function RhfCheckboxInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 rules,
 isDisabled = false,
 containerStyle,
 errorStyle,
 accessibilityLabel,
 errorColor = colors.error,
}: RhfCheckboxInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     <CheckboxInput
      checked={!!value}
      onChange={onChange}
      label={label}
      isDisabled={isDisabled}
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
