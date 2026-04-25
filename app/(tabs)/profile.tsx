import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/base/display/Card';
import { InfoRow } from '@/components/base/display/InfoRow';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileStatsCard } from '@/components/profile/ProfileStatsCard';
import { useDeferredInteractionGate } from '@/hooks/useDeferredInteractionGate';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
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
 const session = useAuthStore((state) => state.session);
 const profile = useProfileStore((state) => state.profile);
 const isLoading = useProfileStore((state) => state.isLoading);
 const backlogItems = useBacklogStore((state) => state.backlogItems);
 const readAll = useBacklogStore((state) => state.readAll);
 const clearBacklog = useBacklogStore((state) => state.clearBacklog);

 const userId = session?.user?.id;
 const shouldHydrateProfileStats = Boolean(userId) && backlogItems.length === 0;
 const deferredStatsLoadEnabled = useDeferredInteractionGate({
  enabled: shouldHydrateProfileStats,
  delayMs: 450,
 });

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

  if (!deferredStatsLoadEnabled) {
   return;
  }

  void readAll(userId);
 }, [clearBacklog, deferredStatsLoadEnabled, readAll, userId]);

 const stats = useMemo(() => {
  const total = backlogItems.length;
  const completed = backlogItems.filter(
   (item) => item.status === BacklogStatusEnum.COMPLETED,
  ).length;
  const ratedItems = backlogItems.filter((item) => item.personal_rating !== null);
  return {
   total,
   wishlist: backlogItems.filter((item) => item.status === BacklogStatusEnum.WISHLIST).length,
   wantToPlay: backlogItems.filter((item) => item.status === BacklogStatusEnum.WANT_TO_PLAY).length,
   playing: backlogItems.filter((item) => item.status === BacklogStatusEnum.PLAYING).length,
   ongoing: backlogItems.filter((item) => item.status === BacklogStatusEnum.ONGOING).length,
   completed,
   abandoned: backlogItems.filter((item) => item.status === BacklogStatusEnum.ABANDONED).length,
   completionRate: total > 0 ? Math.round((completed / total) * 100) : null,
   avgRating:
    ratedItems.length > 0
     ? Math.round(
        (ratedItems.reduce((s, i) => s + i.personal_rating!, 0) / ratedItems.length) * 10,
       ) / 10
     : null,
  };
 }, [backlogItems]);

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

    <View
     style={{
      marginHorizontal: spacing.md,
      marginTop: -spacing.lg,
      gap: spacing.sm,
      zIndex: 1,
     }}
    >
     {stats.total === 0 ? (
      <Card
       variant="outlined"
       style={{
        padding: spacing.md,
        backgroundColor: 'rgba(16,18,30,0.9)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
       }}
      >
       <EmptyState
        icon="gamepad"
        title={t('profile.stats.emptyTitle')}
        subtitle={t('profile.stats.emptySubtitle')}
        style={{ flex: 0, paddingHorizontal: spacing.md, paddingVertical: spacing.lg }}
       />
      </Card>
     ) : (
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
        completionRate: t('profile.stats.completionRate'),
        avgRating: t('profile.stats.avgRating'),
        title: t('profile.stats.title'),
        subtitle: t('profile.stats.subtitle'),
       }}
      />
     )}
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
