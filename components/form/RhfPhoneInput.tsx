import type { FieldValues, Path } from 'react-hook-form';
import { RhfTextInput, type RhfTextInputProps } from './RhfTextInput';

export function RhfPhoneInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>(props: RhfTextInputProps<TFieldValues, TFieldName>) {
 return <RhfTextInput {...props} keyboardType="phone-pad" autoComplete="tel" />;
}
