import {
 type Control,
 Controller,
 type FieldValues,
 type Path,
 type RegisterOptions,
} from 'react-hook-form';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';
import {
 SearchableSelectInput,
 type SearchableSelectOption,
} from '@/components/base/inputs/SearchableSelectInput';
import { colors } from '@/shared/theme/tokens';
import { FormError } from './FormError';
import { FormLabel } from './FormLabel';

type RhfSearchableSelectInputProps<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
> = {
 control: Control<TFieldValues>;
 name: TFieldName;
 options: SearchableSelectOption[];
 suggestedOptions?: SearchableSelectOption[];
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
 searchPlaceholder?: string;
 title?: string;
 isDisabled?: boolean;
 accessibilityLabel?: string;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 allowClear?: boolean;
 clearLabel?: string;
 emptyLabel?: string;
 emptySearchLabel?: string;
 suggestedTitle?: string;
 allOptionsTitle?: string;
};

export function RhfSearchableSelectInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>({
 control,
 name,
 options,
 suggestedOptions,
 label,
 rules,
 containerStyle,
 labelStyle,
 errorStyle,
 errorColor = colors.error,
 placeholder,
 searchPlaceholder,
 title,
 isDisabled,
 accessibilityLabel,
 backgroundColor,
 borderColor,
 activeBorderColor,
 allowClear,
 clearLabel,
 emptyLabel,
 emptySearchLabel,
 suggestedTitle,
 allOptionsTitle,
}: RhfSearchableSelectInputProps<TFieldValues, TFieldName>) {
 return (
  <Controller
   control={control}
   name={name}
   rules={rules}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <View style={containerStyle}>
     {label ? <FormLabel style={labelStyle}>{label}</FormLabel> : null}

     <SearchableSelectInput
      options={options}
      suggestedOptions={suggestedOptions}
      value={value as string | undefined}
      onChange={onChange}
      isError={!!error}
      isDisabled={isDisabled}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      title={title ?? label}
      accessibilityLabel={accessibilityLabel ?? label}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      activeBorderColor={activeBorderColor}
      errorColor={errorColor}
      allowClear={allowClear}
      clearLabel={clearLabel}
      emptyLabel={emptyLabel}
      emptySearchLabel={emptySearchLabel}
      suggestedTitle={suggestedTitle}
      allOptionsTitle={allOptionsTitle}
     />

     {error?.message ? (
      <FormError message={error.message} color={errorColor} style={errorStyle} />
     ) : null}
    </View>
   )}
  />
 );
}
