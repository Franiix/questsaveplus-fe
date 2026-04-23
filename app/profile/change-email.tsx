import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AuthStatusIcon } from '@/components/auth/AuthStatusIcon';
import { BaseButton } from '@/components/base/display/BaseButton';
import { HintBox } from '@/components/base/display/HintBox';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { RhfEmailInput } from '@/components/form/RhfEmailInput';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { type ChangeEmailForm, createChangeEmailSchema } from '@/shared/validation/auth.schemas';
import { useAuthStore } from '@/stores/auth.store';

export default function ChangeEmailScreen() {
 const { t } = useTranslation();
 const router = useRouter();
 const { updateEmail, isLoading, error, clearError } = useAuthStore();
 const [sent, setSent] = useState(false);

 const { control, handleSubmit } = useForm<ChangeEmailForm>({
  resolver: zodResolver(createChangeEmailSchema(t)),
  defaultValues: { email: '' },
 });

 async function handleSubmitEmail(values: ChangeEmailForm) {
  clearError();
  await updateEmail(values.email.trim().toLowerCase());
  if (!useAuthStore.getState().error) {
   setSent(true);
  }
 }

 if (sent) {
  return (
   <ScreenContainer
    scrollable={false}
    contentContainerStyle={{
     flex: 1,
     paddingHorizontal: spacing.lg,
     paddingVertical: spacing['2xl'],
    }}
   >
    <HintBox style={{ alignItems: 'center' }}>
     <AuthStatusIcon name="envelope-open" />
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.lg,
       fontFamily: typography.font.semibold,
       marginBottom: spacing.xs,
       textAlign: 'center',
      }}
     >
      {t('auth.changeEmail.successTitle')}
     </Text>
     <Text
      style={{ color: colors.text.secondary, fontSize: typography.size.md, textAlign: 'center' }}
     >
      {t('auth.changeEmail.successSubtitle')}
     </Text>
    </HintBox>
   </ScreenContainer>
  );
 }

 return (
  <ScreenContainer
   contentContainerStyle={{
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
   }}
  >
   <View style={{ marginBottom: spacing.xl }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size['2xl'],
      fontFamily: typography.font.bold,
      marginBottom: spacing.xs,
     }}
    >
     {t('auth.changeEmail.title')}
    </Text>
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
     {t('auth.changeEmail.subtitle')}
    </Text>
   </View>

   {error ? (
    <ErrorBox message={t('auth.changeEmail.errors.generic')} style={{ marginBottom: spacing.md }} />
   ) : null}

   <RhfEmailInput
    control={control}
    name="email"
    label={t('auth.changeEmail.newEmailLabel')}
    placeholder={t('auth.changeEmail.newEmailPlaceholder')}
    isDisabled={isLoading}
    required
    containerStyle={{ marginBottom: spacing.xl }}
   />

   <BaseButton
    label={t('auth.changeEmail.submitButton')}
    onPress={handleSubmit(handleSubmitEmail)}
    isLoading={isLoading}
    fullWidth
   />
   <View style={{ marginTop: spacing.sm }}>
    <BaseButton
     label={t('common.cancel')}
     variant="outlined"
     onPress={() => router.back()}
     isDisabled={isLoading}
     fullWidth
    />
   </View>
  </ScreenContainer>
 );
}
