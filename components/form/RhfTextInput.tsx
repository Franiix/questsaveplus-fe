import {
 type Control,
 Controller,
 type FieldPathValue,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import {
 type BlurEvent,
 type StyleProp,
 type TextInputProps,
 type TextStyle,
 View,
 type ViewStyle,
} from 'react-native';
import { BaseInput } from '@/components/base/inputs/BaseInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

export type RhfTextInputProps<
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
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 // Colori passati direttamente a BaseInput
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 onBlur?: (event: BlurEvent) => void;
 isDisabled?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'editable'>;

export function RhfTextInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 required,
 rules,
 editable = true,
 containerStyle,
 labelStyle,
 errorStyle,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor = colors.error,
 accessibilityLabel,
 onBlur: onBlurProp,
 ...inputProps
}: RhfTextInputProps<TFieldValues, TFieldName>) {
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

     <BaseInput
      {...inputProps}
      accessibilityLabel={accessibilityLabel ?? label ?? inputProps.placeholder}
      errorMessage={error?.message}
      isError={!!error}
      editable={editable}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      activeBorderColor={activeBorderColor}
      errorColor={errorColor}
      value={(value as string | undefined) ?? ''}
      onChangeText={(text) => onChange(text as FieldPathValue<TFieldValues, TFieldName>)}
      onBlur={(e) => {
       onBlur();
       onBlurProp?.(e);
      }}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
