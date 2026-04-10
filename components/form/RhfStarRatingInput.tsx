import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import { StarRatingInput } from '@/components/base/inputs/StarRatingInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfStarRatingInputProps<
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
 isDisabled?: boolean;
 containerStyle?: StyleProp<ViewStyle>;
 labelStyle?: StyleProp<TextStyle>;
 errorStyle?: StyleProp<TextStyle>;
 errorColor?: string;
};

export function RhfStarRatingInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 label,
 rules,
 isDisabled = false,
 containerStyle,
 labelStyle,
 errorStyle,
 errorColor = colors.error,
}: RhfStarRatingInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? <FormLabel style={labelStyle}>{label}</FormLabel> : null}

     <StarRatingInput
      value={value as number | undefined}
      onChange={onChange}
      isDisabled={isDisabled}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
