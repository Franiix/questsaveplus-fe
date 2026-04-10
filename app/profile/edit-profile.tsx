import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { uploadAvatar } from '@/lib/storage';
import { PROFILE_GENDERS } from '@/shared/enums/ProfileGender.enum';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { createEditProfileSchema, type EditProfileForm } from '@/shared/validation/profile.schemas';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';

export default function EditProfileScreen() {
 const { t } = useTranslation();
 const router = useRouter();
 const { session } = useAuthStore();
 const { profile, updateProfile, isLoading, error, clearError } = useProfileStore();
 const [avatarUri, setAvatarUri] = useState<string | null>(null);
 const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
 const [avatarError, setAvatarError] = useState<string | null>(null);

 const { control, handleSubmit } = useForm<EditProfileForm>({
  resolver: zodResolver(createEditProfileSchema(t)),
  defaultValues: {
   first_name: profile?.first_name ?? '',
   last_name: profile?.last_name ?? '',
   birth_date: profile?.birth_date ? new Date(profile.birth_date) : null,
   gender: profile?.gender ?? 'UNSPECIFIED',
  },
 });

 const genderOptions = PROFILE_GENDERS.map((gender) => ({
  label: t(`profile.genderOptions.${gender}`),
  value: gender,
 }));

 function handleAvatarPick(avatar: PickedAvatar) {
  setAvatarUri(avatar.uri);
  setAvatarBase64(avatar.base64);
 }

 async function handleSave(values: EditProfileForm) {
  if (!session?.user?.id) return;
  clearError();
  setAvatarError(null);

  let avatarUrl: string | null | undefined;
  if (avatarUri) {
   try {
    avatarUrl = await uploadAvatar(session.user.id, avatarUri, avatarBase64);
   } catch (uploadError) {
    setAvatarError(
     uploadError instanceof Error ? uploadError.message : t('editProfile.errors.avatarUpload'),
    );
    return;
   }
  }

  await updateProfile(session.user.id, {
   first_name: values.first_name.trim(),
   last_name: values.last_name.trim(),
   birth_date: values.birth_date ? values.birth_date.toISOString().split('T')[0] : null,
   gender: values.gender ?? 'UNSPECIFIED',
   ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
  });

  if (!useProfileStore.getState().error) {
   router.back();
  }
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
      fontWeight: typography.weight.bold as '700',
      marginBottom: spacing.xs,
     }}
    >
     {t('editProfile.title')}
    </Text>
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.md }}>
     {t('editProfile.subtitle')}
    </Text>
   </View>

   <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
    <AvatarPicker
     uri={avatarUri ?? profile?.avatar_url ?? null}
     onPick={handleAvatarPick}
     label={t('editProfile.avatarLabel')}
     buttonLabel={t('editProfile.avatarButton')}
     isDisabled={isLoading}
    />
   </View>

   {avatarError ? <ErrorBox message={avatarError} style={{ marginBottom: spacing.md }} /> : null}

   {error ? (
    <ErrorBox message={t('editProfile.errors.generic')} style={{ marginBottom: spacing.md }} />
   ) : null}

   <RhfTextInput
    control={control}
    name="first_name"
    label={t('editProfile.firstNameLabel')}
    placeholder={t('editProfile.firstNamePlaceholder')}
    editable={!isLoading}
    required
    autoCapitalize="words"
    containerStyle={{ marginBottom: spacing.md }}
   />

   <RhfTextInput
    control={control}
    name="last_name"
    label={t('editProfile.lastNameLabel')}
    placeholder={t('editProfile.lastNamePlaceholder')}
    editable={!isLoading}
    required
    autoCapitalize="words"
    containerStyle={{ marginBottom: spacing.md }}
   />

   <RhfDatePickerInput
    control={control}
    name="birth_date"
    label={t('editProfile.birthDateLabel')}
    placeholder={t('editProfile.birthDatePlaceholder')}
   mode="date"
   maximumDate={new Date()}
   isDisabled={isLoading}
   containerStyle={{ marginBottom: spacing.md }}
  />

  <RhfSelectInput
   control={control}
   name="gender"
   label={t('editProfile.genderLabel')}
   placeholder={t('editProfile.genderPlaceholder')}
   options={genderOptions}
   isDisabled={isLoading}
   containerStyle={{ marginBottom: spacing.xl }}
  />

    <BaseButton
     label={t('editProfile.submitButton')}
     onPress={handleSubmit(handleSave)}
     isLoading={isLoading}
     fullWidth
    />
   </ScreenContainer>
   <LoadingOverlay message={t('editProfile.loading')} visible={isLoading} />
  </View>
 );
}
