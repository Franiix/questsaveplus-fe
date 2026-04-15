import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseButton } from '@/components/base/display/BaseButton';
import { Card } from '@/components/base/display/Card';
import { InfoRow } from '@/components/base/display/InfoRow';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileStatsCard } from '@/components/profile/ProfileStatsCard';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { colors, spacing } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useProfileStore } from '@/stores/profile.store';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const handleBackPress = () => {
    router.replace('/(tabs)');
  };
  const insets = useSafeAreaInsets();
  const {
    signOut,
    deleteAccount,
    clearError: clearAuthError,
    error: authError,
    isLoading: isAuthMutating,
    session,
  } = useAuthStore();
  const { profile, isLoading } = useProfileStore();
  const { backlogItems, readAll, clearBacklog } = useBacklogStore();

  const userId = session?.user?.id;

  async function handleDeleteAccount(confirmation: string) {
    const deleted = await deleteAccount(confirmation);
    if (deleted) {
      setIsDeleteModalVisible(false);
    }
  }

  useEffect(() => {
    if (!userId) {
      clearBacklog();
      return;
    }

    void readAll(userId);
  }, [clearBacklog, readAll, userId]);

  const stats = useMemo(
    () => ({
      total: backlogItems.length,
      wishlist: backlogItems.filter((item) => item.status === BacklogStatusEnum.WISHLIST).length,
      wantToPlay: backlogItems.filter((item) => item.status === BacklogStatusEnum.WANT_TO_PLAY).length,
      playing: backlogItems.filter((item) => item.status === BacklogStatusEnum.PLAYING).length,
      ongoing: backlogItems.filter((item) => item.status === BacklogStatusEnum.ONGOING).length,
      completed: backlogItems.filter((item) => item.status === BacklogStatusEnum.COMPLETED).length,
      abandoned: backlogItems.filter((item) => item.status === BacklogStatusEnum.ABANDONED).length,
    }),
    [backlogItems],
  );

  if (isLoading || !profile) {
    return (
      <SafeAreaView
        edges={['bottom']}
        style={{ flex: 1, backgroundColor: colors.background.primary }}
      >
        <AppBackground />
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <AppBackground />
      <ScreenHeader title={t('tabs.profile')} onBack={handleBackPress} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <ProfileHero
          topInset={insets.top}
          fullName={profile.full_name}
          username={profile.username}
          avatarUrl={profile.avatar_url}
          subtitle={t('profile.heroTagline')}
        />

        <View
          style={{
            marginHorizontal: spacing.md,
            marginTop: -spacing.lg,
            gap: spacing.sm,
            zIndex: 1,
          }}
        >
          <ProfileStatsCard
            stats={stats}
            labels={{
              total: t('profile.stats.total'),
              wishlist: t('profile.stats.wishlist'),
              wantToPlay: t('profile.stats.wantToPlay'),
              playing: t('profile.stats.playing'),
              ongoing: t('profile.stats.ongoing'),
              completed: t('profile.stats.completed'),
              abandoned: t('profile.stats.abandoned'),
              title: t('profile.stats.title'),
              subtitle: t('profile.stats.subtitle'),
            }}
          />
        </View>

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

        <Card
          variant="outlined"
          style={{
            marginHorizontal: spacing.md,
            marginTop: spacing.sm,
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          <BaseButton
            label={t('profile.editButton')}
            variant="outlined"
            fullWidth
            onPress={() => router.push('/profile/edit-profile')}
          />
          <BaseButton
            label={t('profile.changeEmailButton')}
            variant="outlined"
            fullWidth
            onPress={() => router.push('/profile/change-email')}
          />
          <BaseButton
            label={t('profile.changePasswordButton')}
            variant="outlined"
            fullWidth
            onPress={() => router.push('/profile/change-password')}
          />
          <BaseButton
            label={t('profile.logoutButton')}
            variant="outlined"
            fullWidth
            color={colors.error}
            onPress={signOut}
          />
        </Card>

        <View
          style={{
            marginHorizontal: spacing.md,
            marginTop: spacing.xl,
            marginBottom: spacing['3xl'],
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => setIsDeleteModalVisible(true)}
            style={{
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            <Text
              style={{
                color: colors.error,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              {t('profile.deleteAccount.trigger')}
            </Text>
          </Pressable>
          <Text
            style={{
              marginTop: spacing.xs,
              color: colors.text.disabled,
              fontSize: 11,
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
