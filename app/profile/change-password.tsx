import { FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { HintBox } from '@/components/base/display/HintBox';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { RhfPasswordInput } from '@/components/form/RhfPasswordInput';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import {
 type ChangePasswordForm,
 createChangePasswordSchema,
} from '@/shared/validation/auth.schemas';
import { useAuthStore } from '@/stores/auth.store';

function mapPasswordError(error: string, t: (key: string) => string): string {
 if (error === 'wrong_password') return t('auth.changePassword.errors.wrongPassword');
 return t('auth.changePassword.errors.generic');
}

export default function ChangePasswordScreen() {
 const { t } = useTranslation();
 const { updatePassword, isLoading, error, clearError } = useAuthStore();
 const [success, setSuccess] = useState(false);

 const { control, handleSubmit } = useForm<ChangePasswordForm>({
  resolver: zodResolver(createChangePasswordSchema(t)),
  defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
 });

 async function handleSubmitPassword(values: ChangePasswordForm) {
  clearError();
  await updatePassword(values.currentPassword, values.newPassword);
  if (!useAuthStore.getState().error) {
   setSuccess(true);
  }
 }

 if (success) {
  return (
   <ScreenContainer
    scrollable={false}
    contentContainerStyle={{
     flex: 1,
     paddingHorizontal: spacing.lg,
     paddingVertical: spacing['2xl'],
    }}
   >
    <HintBox>
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
      <FontAwesome5 name="lock" size={16} color={colors.primary['200']} solid />
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontFamily: typography.font.semibold,
        marginBottom: spacing.xs,
        flex: 1,
       }}
      >
       {t('auth.changePassword.successMessage')}
      </Text>
     </View>
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
     {t('auth.changePassword.title')}
    </Text>
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
     {t('auth.changePassword.subtitle')}
    </Text>
   </View>

   {error ? (
    <ErrorBox message={mapPasswordError(error, t)} style={{ marginBottom: spacing.md }} />
   ) : null}

   <RhfPasswordInput
    control={control}
    name="currentPassword"
    label={t('auth.changePassword.currentPasswordLabel')}
    placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
    editable={!isLoading}
    required
    containerStyle={{ marginBottom: spacing.md }}
   />

   <RhfPasswordInput
    control={control}
    name="newPassword"
    label={t('auth.changePassword.newPasswordLabel')}
    placeholder={t('auth.changePassword.newPasswordPlaceholder')}
    editable={!isLoading}
    required
    containerStyle={{ marginBottom: spacing.md }}
   />

   <RhfPasswordInput
    control={control}
    name="confirmNewPassword"
    label={t('auth.changePassword.confirmPasswordLabel')}
    placeholder={t('auth.changePassword.confirmPasswordPlaceholder')}
    editable={!isLoading}
    required
    containerStyle={{ marginBottom: spacing.xl }}
   />

   <BaseButton
    label={t('auth.changePassword.submitButton')}
    onPress={handleSubmit(handleSubmitPassword)}
    isLoading={isLoading}
    fullWidth
   />
  </ScreenContainer>
 );
}
