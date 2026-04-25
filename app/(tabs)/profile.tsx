import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/base/display/Card';
import { InfoRow } from '@/components/base/display/InfoRow';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';

const PILL_BUTTON_STYLE = {
 flexDirection: 'row' as const,
 alignItems: 'center' as const,
 gap: spacing.sm,
 paddingVertical: spacing.xs,
 paddingHorizontal: spacing.sm,
 borderRadius: borderRadius.full,
 backgroundColor: colors.surface.pillButton,
};

function ProfilePillButton({
 onPress,
 icon,
 iconColor,
 label,
 labelColor,
}: {
 onPress: () => void;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 iconColor: string;
 label: string;
 labelColor: string;
}) {
 return (
  <Pressable onPress={onPress} style={PILL_BUTTON_STYLE}>
   <FontAwesome5 name={icon} size={13} color={iconColor} solid />
   <Text
    style={{
     color: labelColor,
     fontSize: typography.size.sm,
     fontFamily: typography.font.semibold,
    }}
   >
    {label}
   </Text>
  </Pressable>
 );
}

export default function ProfileScreen() {
 const { t, i18n } = useTranslation();
 const router = useSafeRouter();
 const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
 const handleBackPress = useCallback(() => {
  router.replace('/(tabs)');
 }, [router]);
 const insets = useSafeAreaInsets();
 const deleteAccount = useAuthStore((state) => state.deleteAccount);
 const clearAuthError = useAuthStore((state) => state.clearError);
 const authError = useAuthStore((state) => state.error);
 const isAuthMutating = useAuthStore((state) => state.isLoading);
 const profile = useProfileStore((state) => state.profile);
 const isLoading = useProfileStore((state) => state.isLoading);

 async function handleDeleteAccount(confirmation: string) {
  const deleted = await deleteAccount(confirmation);
  if (deleted) {
   setIsDeleteModalVisible(false);
  }
 }

 if (isLoading || !profile) {
  return (
   <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <LoadingSpinner fullScreen />
   </SafeAreaView>
  );
 }

 return (
  <SafeAreaView
   edges={['top', 'bottom']}
   style={{ flex: 1, backgroundColor: colors.background.primary }}
  >
   <AppBackground />
   <ScreenHeader title={t('tabs.profile')} onBack={handleBackPress} />
   <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: layout.screenBottomPadding }}
   >
    <ProfileHero
     topInset={insets.top}
     fullName={profile.full_name}
     username={profile.username}
     avatarUrl={profile.avatar_url}
     subtitle={t('profile.heroTagline')}
    />

    <Card
     variant="outlined"
     style={{
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
     }}
    >
     <InfoRow icon="at" label={t('profile.fields.username')} value={profile.username} />

     {profile.birth_date ? (
      <InfoRow
       icon="calendar-alt"
       label={t('profile.fields.birthDate')}
       value={
        profile.age !== null
         ? `${formatDate(profile.birth_date, i18n.language)} (${profile.age} ${t('profile.fields.yearsOld')})`
         : formatDate(profile.birth_date, i18n.language)
       }
      />
     ) : null}

     <InfoRow
      icon="clock"
      label={t('profile.fields.memberSince')}
      value={formatDate(profile.created_at, i18n.language)}
     />
     <InfoRow
      icon="user"
      label={t('profile.fields.gender')}
      value={t(`profile.genderOptions.${profile.gender ?? 'UNSPECIFIED'}`)}
      isLast
     />
    </Card>

    <View
     style={{
      marginHorizontal: spacing.md,
      marginTop: spacing.xl,
      marginBottom: spacing['3xl'],
      alignItems: 'center',
      gap: spacing.md,
     }}
    >
     <ProfilePillButton
      onPress={() => setIsDeleteModalVisible(true)}
      icon="trash-alt"
      iconColor={colors.error}
      label={t('profile.deleteAccount.trigger')}
      labelColor={colors.error}
     />
     <Text
      style={{
       marginTop: spacing.xs,
       color: colors.text.disabled,
       fontSize: typography.size.xs,
       textAlign: 'center',
      }}
     >
      {t('profile.deleteAccount.subtleWarning')}
     </Text>
    </View>
   </ScrollView>

   <DeleteAccountModal
    visible={isDeleteModalVisible}
    isLoading={isAuthMutating}
    errorMessage={authError ? t('profile.deleteAccount.errorGeneric') : null}
    onCancel={() => {
     clearAuthError();
     setIsDeleteModalVisible(false);
    }}
    onConfirm={handleDeleteAccount}
   />
  </SafeAreaView>
 );
}
