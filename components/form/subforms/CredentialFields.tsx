import type { Control, FieldValues, Path } from 'react-hook-form';
import type { StyleProp, ViewStyle } from 'react-native';
import { RhfEmailInput } from '@/components/form/RhfEmailInput';
import { RhfPasswordInput } from '@/components/form/RhfPasswordInput';
import { spacing } from '@/shared/theme/tokens';

type WithCredentials = { email: string; password: string };

type CredentialFieldsProps<TFieldValues extends FieldValues & WithCredentials> = {
 control: Control<TFieldValues>;
 isDisabled?: boolean;
 emailLabel?: string;
 emailPlaceholder?: string;
 passwordLabel?: string;
 passwordPlaceholder?: string;
 /** Stile del container del campo password — utile per spaziature diverse tra screen. */
 passwordContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Sub-form: email + password.
 *
 * Generico su TFieldValues — accetta qualsiasi form che abbia almeno
 * i campi `email` e `password`. Permette di usarlo in login, register
 * (che aggiunge confirmPassword) e altri form senza cast.
 */
export function CredentialFields<TFieldValues extends FieldValues & WithCredentials>({
 control,
 isDisabled,
 emailLabel,
 emailPlaceholder,
 passwordLabel,
 passwordPlaceholder,
 passwordContainerStyle,
}: CredentialFieldsProps<TFieldValues>) {
 return (
  <>
   <RhfEmailInput
    control={control}
    name={'email' as Path<TFieldValues>}
    label={emailLabel}
    placeholder={emailPlaceholder}
    isDisabled={isDisabled}
    required
    containerStyle={{ marginBottom: spacing.md }}
   />

   <RhfPasswordInput
    control={control}
    name={'password' as Path<TFieldValues>}
    label={passwordLabel}
    placeholder={passwordPlaceholder}
    editable={!isDisabled}
    required
    containerStyle={passwordContainerStyle}
   />
  </>
 );
}
