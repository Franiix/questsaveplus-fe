import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AuthStatusIcon } from '@/components/auth/AuthStatusIcon';
import { BaseButton } from '@/components/base/display/BaseButton';
import { HintBox } from '@/components/base/display/HintBox';
import { TextLink } from '@/components/base/display/TextLink';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { RhfEmailInput } from '@/components/form/RhfEmailInput';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import {
 createForgotPasswordSchema,
 type ForgotPasswordForm,
} from '@/shared/validation/auth.schemas';
import { useAuthStore } from '@/stores/auth.store';

export default function ForgotPasswordScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const { resetPassword, isLoading, error, clearError } = useAuthStore();
 const [sent, setSent] = useState(false);

 const { control, handleSubmit } = useForm<ForgotPasswordForm>({
  resolver: zodResolver(createForgotPasswordSchema(t)),
  defaultValues: { email: '' },
 });

 async function handleReset(values: ForgotPasswordForm) {
  clearError();
  await resetPassword(values.email.trim().toLowerCase());
  const currentError = useAuthStore.getState().error;
  if (!currentError) {
   setSent(true);
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
   {/* Header */}
   <View style={{ marginBottom: spacing.xl }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size['2xl'],
      fontFamily: typography.font.bold,
      marginBottom: spacing.xs,
     }}
    >
     {t('auth.forgotPassword.title')}
    </Text>
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
     {t('auth.forgotPassword.subtitle')}
    </Text>
   </View>

   {sent ? (
    /* Stato successo */
    <View style={{ alignItems: 'center' }}>
     <AuthStatusIcon name="envelope-open" />
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.xl,
       fontFamily: typography.font.semibold,
       textAlign: 'center',
       marginBottom: spacing.md,
      }}
     >
      {t('auth.forgotPassword.successTitle')}
     </Text>
     <HintBox style={{ marginBottom: spacing.xl, width: '100%' }}>
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        textAlign: 'center',
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
       }}
      >
       {t('auth.forgotPassword.successSubtitle')}
      </Text>
     </HintBox>
    </View>
   ) : (
    /* Stato form */
    <View>
     {error ? (
      <ErrorBox message={t('auth.errors.generic')} style={{ marginBottom: spacing.md }} />
     ) : null}

     <RhfEmailInput
      control={control}
      name="email"
      label={t('auth.forgotPassword.emailLabel')}
      placeholder={t('auth.forgotPassword.emailPlaceholder')}
      isDisabled={isLoading}
      containerStyle={{ marginBottom: spacing.xl }}
     />

     <BaseButton
      label={t('auth.forgotPassword.submitButton')}
      onPress={handleSubmit(handleReset)}
      isLoading={isLoading}
      fullWidth
     />
    </View>
   )}

   <View style={{ marginTop: spacing.lg }}>
    <TextLink
     text=""
     linkText={t('auth.forgotPassword.backToLogin')}
     onPress={() => router.replace('/(auth)/login')}
    />
   </View>
  </ScreenContainer>
 );
}
