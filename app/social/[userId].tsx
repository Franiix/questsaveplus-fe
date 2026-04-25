import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmModal } from '@/components/base/feedback/ConfirmModal';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { ProfileCompletionTimeline } from '@/components/profile/ProfileCompletionTimeline';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileStatsCard } from '@/components/profile/ProfileStatsCard';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { supabase } from '@/lib/supabase';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { type BacklogItemModel, toBacklogItemModel } from '@/shared/models/BacklogItem.model';
import type { PublicProfileModel } from '@/shared/models/Social.model';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { formatDate } from '@/shared/utils/date';
import { useAuthStore } from '@/stores/auth.store';
import { useSocialStore } from '@/stores/social.store';
import { useToastStore } from '@/stores/toast.store';

const COVER_W = 52;
const COVER_H = 76;
const STATUS_SECTION_INITIAL = 3;

type DateRowProps = {
 iconName: React.ComponentProps<typeof FontAwesome5>['name'];
 color: string;
 label: string;
 date: string;
 language: string;
};

function DateRow({ iconName, color, label, date, language }: DateRowProps) {
 return (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
   <FontAwesome5 name={iconName} size={9} color={color} solid />
   <Text
    style={{
     color,
     fontSize: typography.size['2xs'],
     fontFamily: typography.font.medium,
    }}
   >
    {label}:{' '}
    <Text style={{ fontFamily: typography.font.regular }}>
     {formatDate(date, language, { day: 'numeric', month: 'short', year: 'numeric' })}
    </Text>
   </Text>
  </View>
 );
}

function BacklogItemCard({
 item,
 language,
 t,
}: {
 item: BacklogItemModel;
 language: string;
 t: (key: string) => string;
}) {
 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.background.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
   }}
  >
   {item.game_cover_url ? (
    <Image
     source={{ uri: item.game_cover_url }}
     style={{
      width: COVER_W,
      height: COVER_H,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background.elevated,
     }}
     resizeMode="cover"
    />
   ) : (
    <View
     style={{
      width: COVER_W,
      height: COVER_H,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background.elevated,
      alignItems: 'center',
      justifyContent: 'center',
     }}
    >
     <FontAwesome5 name="gamepad" size={20} color={colors.text.disabled} />
    </View>
   )}

   <View style={{ flex: 1, gap: 5 }}>
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.semibold,
     }}
     numberOfLines={2}
    >
     {item.game_name}
    </Text>

    <View style={{ gap: 3 }}>
     <DateRow
      iconName="plus"
      color={colors.text.tertiary}
      label={t('backlog.addedAtLabel')}
      date={item.added_at}
      language={language}
     />
     {item.started_at ? (
      <DateRow
       iconName="play"
       color={colors.info}
       label={t('backlog.startedAtLabel')}
       date={item.started_at}
       language={language}
      />
     ) : null}
     {item.completed_at ? (
      <DateRow
       iconName="trophy"
       color={colors.success}
       label={t('backlog.completedAtLabel')}
       date={item.completed_at}
       language={language}
      />
     ) : null}
     {item.abandoned_at ? (
      <DateRow
       iconName="ban"
       color={colors.error}
       label={t('backlog.abandonedAtLabel')}
       date={item.abandoned_at}
       language={language}
      />
     ) : null}
    </View>

    {item.personal_rating !== null ? (
     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => (
       <FontAwesome5
        key={star}
        name="star"
        size={9}
        color={star <= item.personal_rating! ? colors.warning : colors.text.disabled}
        solid={star <= item.personal_rating!}
       />
      ))}
     </View>
    ) : null}
   </View>
  </View>
 );
}

function StatusSection({
 title,
 items,
 language,
 t,
}: {
 title: string;
 items: BacklogItemModel[];
 language: string;
 t: (key: string, opts?: Record<string, unknown>) => string;
}) {
 const [expanded, setExpanded] = useState(false);
 if (items.length === 0) return null;
 const visible = expanded ? items : items.slice(0, STATUS_SECTION_INITIAL);
 const hasMore = items.length > STATUS_SECTION_INITIAL;

 return (
  <View style={{ gap: spacing.sm }}>
   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontFamily: typography.font.bold,
    }}
   >
    {title}
   </Text>

   {visible.map((item) => (
    <BacklogItemCard key={item.id} item={item} language={language} t={t} />
   ))}

   {hasMore && !expanded ? (
    <Pressable
     onPress={() => setExpanded(true)}
     style={{
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      backgroundColor: colors.background.elevated,
     }}
    >
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.medium,
      }}
     >
      {t('social.showMoreItems', { count: items.length - STATUS_SECTION_INITIAL })}
     </Text>
    </Pressable>
   ) : null}
  </View>
 );
}

export default function FriendProfileScreen() {
 const { userId } = useLocalSearchParams<{ userId: string }>();
 const { t, i18n } = useTranslation();
 const router = useSafeRouter();
 const insets = useSafeAreaInsets();
 const showToast = useToastStore((state) => state.showToast);
 const session = useAuthStore((state) => state.session);

 const friends = useSocialStore((state) => state.friends);
 const removeFriend = useSocialStore((state) => state.removeFriend);
 const loadFriends = useSocialStore((state) => state.loadFriends);

 const [profile, setProfile] = useState<PublicProfileModel | null>(null);
 const [backlogItems, setBacklogItems] = useState<BacklogItemModel[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

 const friendship = friends.find((f) => f.friend.id === userId);
 const currentUserId = session?.user?.id;

 useEffect(() => {
  if (!userId) return;

  async function load() {
   setIsLoading(true);

   const [profileRes, backlogRes] = await Promise.all([
    supabase
     .from('profiles')
     .select('id, username, avatar_url, first_name, last_name, created_at')
     .eq('id', userId)
     .single(),
    supabase.from('backlog_items').select('*').eq('user_id', userId).eq('is_archived', false),
   ]);

   if (profileRes.data) {
    const p = profileRes.data as {
     id: string;
     username: string;
     avatar_url: string | null;
     first_name: string;
     last_name: string;
     created_at: string;
    };
    setProfile({
     id: p.id,
     username: p.username,
     avatar_url: p.avatar_url,
     full_name: `${p.first_name} ${p.last_name}`,
     created_at: p.created_at,
    });
   }

   if (backlogRes.data) {
    setBacklogItems(backlogRes.data.map(toBacklogItemModel));
   }

   setIsLoading(false);
  }

  void load();
 }, [userId]);

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
        (ratedItems.reduce((s, i) => s + (i.personal_rating ?? 0), 0) / ratedItems.length) * 10,
       ) / 10
     : null,
  };
 }, [backlogItems]);

 const playingItems = useMemo(
  () =>
   backlogItems
    .filter((item) => item.status === BacklogStatusEnum.PLAYING)
    .sort(
     (a, b) =>
      new Date(b.started_at ?? b.added_at).getTime() -
      new Date(a.started_at ?? a.added_at).getTime(),
    ),
  [backlogItems],
 );

 const ongoingItems = useMemo(
  () =>
   backlogItems
    .filter((item) => item.status === BacklogStatusEnum.ONGOING)
    .sort(
     (a, b) =>
      new Date(b.started_at ?? b.added_at).getTime() -
      new Date(a.started_at ?? a.added_at).getTime(),
    ),
  [backlogItems],
 );

 const wantToPlayItems = useMemo(
  () =>
   backlogItems
    .filter((item) => item.status === BacklogStatusEnum.WANT_TO_PLAY)
    .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime()),
  [backlogItems],
 );

 const abandonedItems = useMemo(
  () =>
   backlogItems
    .filter((item) => item.status === BacklogStatusEnum.ABANDONED)
    .sort(
     (a, b) =>
      new Date(b.abandoned_at ?? b.added_at).getTime() -
      new Date(a.abandoned_at ?? a.added_at).getTime(),
    ),
  [backlogItems],
 );

 const handleRemoveFriend = useCallback(async () => {
  if (!friendship) return;
  setIsRemoveModalVisible(false);
  await removeFriend(friendship.id);
  if (currentUserId) void loadFriends(currentUserId);
  showToast(t('social.removeFriendSuccess'), 'success');
  router.back();
 }, [friendship, removeFriend, loadFriends, currentUserId, showToast, t, router]);

 if (isLoading) {
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <LoadingSpinner fullScreen />
   </SafeAreaView>
  );
 }

 if (!profile) {
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
    <AppBackground />
    <ScreenHeader title="" onBack={() => router.back()} />
   </SafeAreaView>
  );
 }

 return (
  <SafeAreaView
   edges={['top', 'bottom']}
   style={{ flex: 1, backgroundColor: colors.background.primary }}
  >
   <AppBackground />
   <ScreenHeader title={profile.username} onBack={() => router.back()} />
   <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: layout.screenBottomPadding }}
   >
    <ProfileHero
     topInset={insets.top}
     fullName={profile.full_name}
     username={profile.username}
     avatarUrl={profile.avatar_url}
     subtitle={
      friendship?.accepted_at
       ? t('social.friendSince', {
          date: formatDate(friendship.accepted_at, i18n.language, {
           day: 'numeric',
           month: 'long',
           year: 'numeric',
          }),
         })
       : t('social.friendProfileTagline')
     }
    />

    <View
     style={{
      marginHorizontal: spacing.md,
      marginTop: -spacing.lg,
      gap: spacing.lg,
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
       completionRate: t('profile.stats.completionRate'),
       avgRating: t('profile.stats.avgRating'),
       title: t('profile.stats.title'),
       subtitle: t('profile.stats.subtitle'),
      }}
     />

     <ProfileCompletionTimeline items={backlogItems} initialCount={3} />

     <StatusSection
      title={t('social.playingTitle')}
      items={playingItems}
      language={i18n.language}
      t={t}
     />
     <StatusSection
      title={t('social.ongoingTitle')}
      items={ongoingItems}
      language={i18n.language}
      t={t}
     />
     <StatusSection
      title={t('social.wantToPlayTitle')}
      items={wantToPlayItems}
      language={i18n.language}
      t={t}
     />
     <StatusSection
      title={t('social.abandonedTitle')}
      items={abandonedItems}
      language={i18n.language}
      t={t}
     />

     {friendship ? (
      <View style={{ alignItems: 'center', paddingBottom: spacing.xl }}>
       <Pressable
        onPress={() => setIsRemoveModalVisible(true)}
        style={({ pressed }) => ({
         flexDirection: 'row',
         alignItems: 'center',
         gap: spacing.sm,
         paddingVertical: spacing.xs,
         paddingHorizontal: spacing.sm,
         borderRadius: borderRadius.full,
         backgroundColor: pressed ? `${colors.error}22` : 'transparent',
        })}
       >
        <Text
         style={{
          color: colors.error,
          fontSize: typography.size.sm,
          fontFamily: typography.font.semibold,
         }}
        >
         {t('social.removeFriend')}
        </Text>
       </Pressable>
      </View>
     ) : null}
    </View>
   </ScrollView>

   <ConfirmModal
    visible={isRemoveModalVisible}
    title={t('social.removeFriend')}
    message={t('social.removeFriendConfirm')}
    confirmLabel={t('social.removeFriend')}
    cancelLabel={t('common.cancel')}
    isDestructive
    onConfirm={() => void handleRemoveFriend()}
    onCancel={() => setIsRemoveModalVisible(false)}
   />
  </SafeAreaView>
 );
}
