import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { SelectInput, type SelectOption } from '@/components/base/inputs/SelectInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfSelectInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 options: SelectOption[];
 label?: string;
 rules?: Omit<
  RegisterOptions<TFieldValues, TFieldName>,
  'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
 >;
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 errorColor?: string;
 placeholder?: string;
 isDisabled?: boolean;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
};

export function RhfSelectInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 options,
 label,
 rules,
 containerStyle,
 labelStyle,
 errorStyle,
 errorColor = colors.error,
 placeholder,
 isDisabled,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
}: RhfSelectInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? <FormLabel style={labelStyle}>{label}</FormLabel> : null}

     <SelectInput
      options={options}
      value={value as string | undefined}
      onChange={onChange}
      isError={!!error}
      isDisabled={isDisabled}
      placeholder={placeholder}
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
