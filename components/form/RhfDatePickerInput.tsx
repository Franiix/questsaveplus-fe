import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { DatePickerInput } from '@/components/base/inputs/DatePickerInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfDatePickerInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 label?: string;
 required?: boolean;
 rules?: Omit<
  RegisterOptions<TFieldValues, TFieldName>,
  'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
 >;
 mode?: 'date' | 'time' | 'datetime';
 placeholder?: string;
 minimumDate?: Date;
 maximumDate?: Date;
 isDisabled?: boolean;
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
};

export function RhfDatePickerInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 required,
 rules,
 mode,
 placeholder,
 minimumDate,
 maximumDate,
 isDisabled = false,
 containerStyle,
 labelStyle,
 errorStyle,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor = colors.error,
}: RhfDatePickerInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? (
      <FormLabel style={labelStyle} required={required}>
       {label}
      </FormLabel>
     ) : null}

     <DatePickerInput
      value={value as Date | undefined}
      onChange={onChange}
      mode={mode}
      placeholder={placeholder}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      isError={!!error}
      isDisabled={isDisabled}
      accessibilityLabel={accessibilityLabel ?? label}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      activeBorderColor={activeBorderColor}
      errorColor={errorColor}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
