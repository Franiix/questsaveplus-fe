import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AuthRegisterHero } from '@/components/auth/AuthRegisterHero';
import { BaseButton } from '@/components/base/display/BaseButton';
import { TextLink } from '@/components/base/display/TextLink';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { RhfPasswordInput } from '@/components/form/RhfPasswordInput';
import { CredentialFields } from '@/components/form/subforms/CredentialFields';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { spacing } from '@/shared/theme/tokens';
import { createRegisterSchema, type RegisterForm } from '@/shared/validation/auth.schemas';
import { useAuthStore } from '@/stores/auth.store';

function mapAuthError(message: string): string {
 const msg = message.toLowerCase();
 if (
  msg.includes('already registered') ||
  msg.includes('user already exists') ||
  msg.includes('already been registered')
 ) {
  return 'auth.errors.emailAlreadyUsed';
 }
 if (msg.includes('network') || msg.includes('fetch')) {
  return 'auth.errors.networkError';
 }
 return 'auth.errors.generic';
}

export default function RegisterScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const { signUp, isLoading, error, clearError } = useAuthStore();

 const { control, handleSubmit } = useForm<RegisterForm>({
  resolver: zodResolver(createRegisterSchema(t)),
  defaultValues: { email: '', password: '', confirmPassword: '' },
 });

 async function handleSignUp(values: RegisterForm) {
  clearError();
  await signUp(values.email.trim().toLowerCase(), values.password);
  const currentError = useAuthStore.getState().error;
  if (!currentError) {
   router.push('/(auth)/check-email');
  }
 }

 return (
  <ScreenContainer
   contentContainerStyle={{
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
   }}
  >
   <View style={{ marginBottom: spacing.xl }}>
    <AuthRegisterHero title={t('auth.register.title')} subtitle={t('auth.register.subtitle')} />
   </View>

   {error ? (
    <ErrorBox message={t(mapAuthError(error))} style={{ marginBottom: spacing.md }} />
   ) : null}

   <CredentialFields
    control={control}
    isDisabled={isLoading}
    emailLabel={t('auth.register.emailLabel')}
    emailPlaceholder={t('auth.register.emailPlaceholder')}
    passwordLabel={t('auth.register.passwordLabel')}
    passwordPlaceholder={t('auth.register.passwordPlaceholder')}
    passwordContainerStyle={{ marginBottom: spacing.md }}
   />

   <RhfPasswordInput
    control={control}
    name="confirmPassword"
    label={t('auth.register.confirmPasswordLabel')}
    placeholder={t('auth.register.confirmPasswordPlaceholder')}
    editable={!isLoading}
    required
    containerStyle={{ marginBottom: spacing.xl }}
   />

   <BaseButton
    label={t('auth.register.submitButton')}
    onPress={handleSubmit(handleSignUp)}
    isLoading={isLoading}
    fullWidth
   />

   <View style={{ marginTop: spacing.lg }}>
    <TextLink
     text={t('auth.register.alreadyAccount')}
     linkText={t('auth.register.loginLink')}
     onPress={() => router.push('/(auth)/login')}
    />
   </View>
  </ScreenContainer>
 );
}
