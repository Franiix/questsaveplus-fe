import type { FieldValues, Path } from 'react-hook-form';
import { RhfTextInput, type RhfTextInputProps } from './RhfTextInput';

/**
 * Wrapper UI per campi email.
 *
 * Imposta keyboardType, autoCapitalize, autoCorrect e autoComplete
 * ottimizzati per l'inserimento email.
 * La validazione è delegata al form schema Zod tramite zodResolver.
 */
export function RhfEmailInput<
 TFieldValues extends FieldValues,
 TFieldName extends Path<TFieldValues>,
>(props: RhfTextInputProps<TFieldValues, TFieldName>) {
 return (
  <RhfTextInput
   {...props}
   keyboardType="email-address"
   autoCapitalize="none"
   autoCorrect={false}
   autoComplete="email"
  />
 );
}
