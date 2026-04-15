import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AvatarPicker, type PickedAvatar } from '@/components/base/display/AvatarPicker';
import { BaseButton } from '@/components/base/display/BaseButton';
import { ErrorBox } from '@/components/base/feedback/ErrorBox';
import { LoadingOverlay } from '@/components/base/feedback/LoadingOverlay';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { RhfDatePickerInput } from '@/components/form/RhfDatePickerInput';
import { RhfSelectInput } from '@/components/form/RhfSelectInput';
import { RhfTextInput } from '@/components/form/RhfTextInput';
import { uploadSelectedAvatar } from '@/lib/avatarUpload';
import { PROFILE_GENDERS } from '@/shared/enums/ProfileGender.enum';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import {
 createProfileSetupSchema,
 type ProfileSetupForm,
} from '@/shared/validation/profile.schemas';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';

export default function ProfileSetupScreen() {
 const { t } = useTranslation();
 const { session } = useAuthStore();
 const { createProfile, isLoading, error, clearError } = useProfileStore();
 const [avatarUri, setAvatarUri] = useState<string | null>(null);
 const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
 const [avatarError, setAvatarError] = useState<string | null>(null);

 const schema = useMemo(() => createProfileSetupSchema(t), [t]);
 const { control, handleSubmit } = useForm<ProfileSetupForm>({
  resolver: zodResolver(schema),
  defaultValues: {
   first_name: '',
   last_name: '',
   username: '',
   birth_date: null,
   gender: 'UNSPECIFIED',
  },
 });

 const genderOptions = useMemo(
  () => PROFILE_GENDERS.map((gender) => ({ label: t(`profile.genderOptions.${gender}`), value: gender })),
  [t],
 );
 const today = useMemo(() => new Date(), []);

 function handleAvatarPick(avatar: PickedAvatar) {
  setAvatarUri(avatar.uri);
  setAvatarBase64(avatar.base64);
 }

 async function handleSave(values: ProfileSetupForm) {
  if (!session?.user?.id) return;
  clearError();
  setAvatarError(null);

  const { avatarUrl, errorMessage } = await uploadSelectedAvatar({
   userId: session.user.id,
   avatarUri,
   avatarBase64,
   fallbackMessage: t('auth.profileSetup.errors.avatarUpload'),
  });
  if (errorMessage) {
   setAvatarError(errorMessage);
   return;
  }

  await createProfile({
   id: session.user.id,
   first_name: values.first_name.trim(),
   last_name: values.last_name.trim(),
   username: values.username.trim(),
   birth_date: values.birth_date ? values.birth_date.toISOString().split('T')[0] : undefined,
   gender: values.gender ?? 'UNSPECIFIED',
   avatar_url: avatarUrl,
  });
 }

 return (
  <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
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
      {t('auth.profileSetup.title')}
     </Text>
     <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
      {t('auth.profileSetup.subtitle')}
     </Text>
    </View>

    <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
     <AvatarPicker
      uri={avatarUri}
      onPick={handleAvatarPick}
      label={t('auth.profileSetup.avatarLabel')}
      buttonLabel={t('auth.profileSetup.avatarButton')}
      isDisabled={isLoading}
     />
    </View>

    {avatarError ? <ErrorBox message={avatarError} style={{ marginBottom: spacing.md }} /> : null}

    {error ? (
     <ErrorBox
      message={t('auth.profileSetup.errors.generic')}
      style={{ marginBottom: spacing.md }}
     />
    ) : null}

    <RhfTextInput
     control={control}
     name="first_name"
     label={t('auth.profileSetup.firstNameLabel')}
     placeholder={t('auth.profileSetup.firstNamePlaceholder')}
     editable={!isLoading}
     required
     autoCapitalize="words"
     containerStyle={{ marginBottom: spacing.md }}
    />

    <RhfTextInput
     control={control}
     name="last_name"
     label={t('auth.profileSetup.lastNameLabel')}
     placeholder={t('auth.profileSetup.lastNamePlaceholder')}
     editable={!isLoading}
     required
     autoCapitalize="words"
     containerStyle={{ marginBottom: spacing.md }}
    />

    <RhfTextInput
     control={control}
     name="username"
     label={t('auth.profileSetup.usernameLabel')}
     placeholder={t('auth.profileSetup.usernamePlaceholder')}
     editable={!isLoading}
     required
     autoCapitalize="none"
     autoCorrect={false}
     containerStyle={{ marginBottom: spacing.md }}
    />

    <RhfDatePickerInput
     control={control}
     name="birth_date"
     label={t('auth.profileSetup.birthDateLabel')}
     placeholder={t('auth.profileSetup.birthDatePlaceholder')}
     mode="date"
     maximumDate={today}
     isDisabled={isLoading}
     containerStyle={{ marginBottom: spacing.md }}
    />

    <RhfSelectInput
     control={control}
     name="gender"
     label={t('auth.profileSetup.genderLabel')}
     placeholder={t('auth.profileSetup.genderPlaceholder')}
     options={genderOptions}
     isDisabled={isLoading}
     containerStyle={{ marginBottom: spacing.xl }}
    />

    <BaseButton
     label={t('auth.profileSetup.submitButton')}
     onPress={handleSubmit(handleSave)}
     isLoading={isLoading}
     fullWidth
    />
   </ScreenContainer>
   <LoadingOverlay message={t('auth.profileSetup.loading')} visible={isLoading} />
  </View>
 );
}
