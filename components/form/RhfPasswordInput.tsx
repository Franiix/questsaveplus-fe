import {
 type Control,
 Controller,
 type FieldPathValue,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { PasswordInput } from '@/components/base/inputs/PasswordInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfPasswordInputProps<
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
 editable?: boolean;
 placeholder?: string;
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
};

export function RhfPasswordInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 required,
 rules,
 editable = true,
 placeholder,
 containerStyle,
 labelStyle,
 errorStyle,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor = colors.error,
}: RhfPasswordInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? (
      <FormLabel style={labelStyle} required={required}>
       {label}
      </FormLabel>
     ) : null}

     <PasswordInput
      accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
      isError={!!error}
      editable={editable}
      placeholder={placeholder}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      activeBorderColor={activeBorderColor}
      errorColor={errorColor}
      value={(value as string | undefined) ?? ''}
      onChangeText={(text) => onChange(text as FieldPathValue<TFieldValues, TFieldName>)}
      onBlur={onBlur}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
