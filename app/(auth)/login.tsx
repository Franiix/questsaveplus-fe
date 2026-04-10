import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { TextLink } from '@/components/base/display/TextLink';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { CredentialFields } from '@/components/form/subforms/CredentialFields';
import {
 type AuthCredentialsModel,
 authCredentialsDefaultValues,
} from '@/shared/models/AuthCredentials.model';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { createLoginSchema } from '@/shared/validation/auth.schemas';
import { useAuthStore } from '@/stores/auth.store';

function mapAuthError(message: string): string {
 const msg = message.toLowerCase();
 if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
  return 'auth.errors.invalidCredentials';
 }
 if (msg.includes('network') || msg.includes('fetch')) {
  return 'auth.errors.networkError';
 }
 return 'auth.errors.generic';
}

export default function LoginScreen() {
 const { t } = useTranslation();
 const router = useRouter();
 const { signIn, isLoading, error, clearError } = useAuthStore();

 const { control, handleSubmit } = useForm<AuthCredentialsModel>({
  resolver: zodResolver(createLoginSchema(t)),
  defaultValues: authCredentialsDefaultValues,
 });

 async function handleSignIn(values: AuthCredentialsModel) {
  clearError();
  await signIn(values.email.trim().toLowerCase(), values.password);
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
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size['2xl'],
      fontWeight: typography.weight.bold as '700',
      marginBottom: spacing.xs,
     }}
    >
     {t('auth.login.title')}
    </Text>
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
     {t('auth.login.subtitle')}
    </Text>
   </View>

   {error ? (
    <ErrorBox message={t(mapAuthError(error))} style={{ marginBottom: spacing.md }} />
   ) : null}

   <CredentialFields
    control={control}
    isDisabled={isLoading}
    emailLabel={t('auth.login.emailLabel')}
    emailPlaceholder={t('auth.login.emailPlaceholder')}
    passwordLabel={t('auth.login.passwordLabel')}
    passwordPlaceholder={t('auth.login.passwordPlaceholder')}
    passwordContainerStyle={{ marginBottom: spacing.xs }}
   />

   <View style={{ alignItems: 'flex-end', marginBottom: spacing.lg }}>
    <BaseButton
     label={t('auth.login.forgotPassword')}
     variant="ghost"
     onPress={() => router.push('/(auth)/forgot-password')}
    />
   </View>

   <BaseButton
    label={t('auth.login.submitButton')}
    onPress={handleSubmit(handleSignIn)}
    isLoading={isLoading}
    fullWidth
   />

   <View style={{ marginTop: spacing.lg }}>
    <TextLink
     text={t('auth.login.noAccount')}
     linkText={t('auth.login.registerLink')}
     onPress={() => router.push('/(auth)/register')}
    />
   </View>
  </ScreenContainer>
 );
}
