import {
 type Control,
 Controller,
 type FieldPathValue,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { TextAreaInput } from '@/components/base/inputs/TextAreaInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfTextAreaInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 label?: string;
 rules?: Omit<
  RegisterOptions<TFieldValues, TFieldName>,
  'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'
 >;
 editable?: boolean;
 minRows?: number;
 maxRows?: number;
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 placeholder?: string;
};

export function RhfTextAreaInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 rules,
 editable = true,
 minRows,
 maxRows,
 containerStyle,
 labelStyle,
 errorStyle,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor = colors.error,
 placeholder,
}: RhfTextAreaInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? <FormLabel style={labelStyle}>{label}</FormLabel> : null}

     <TextAreaInput
      accessibilityLabel={accessibilityLabel ?? label}
      placeholder={placeholder}
      isError={!!error}
      editable={editable}
      minRows={minRows}
      maxRows={maxRows}
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
