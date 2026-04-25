import { FontAwesome5 } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { ProfileStatsCard } from '@/components/profile/ProfileStatsCard';
import { FriendCard } from '@/components/social/FriendCard';
import { FriendRequestCard } from '@/components/social/FriendRequestCard';
import { FriendSearchBar } from '@/components/social/FriendSearchBar';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, layout, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';
import { useSocialStore } from '@/stores/social.store';

const FRIENDS_PAGE_SIZE = 8;

function SectionTitle({ label }: { label: string }) {
 return (
  <Text
   style={{
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontFamily: typography.font.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
   }}
  >
   {label}
  </Text>
 );
}

export default function SocialScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const session = useAuthStore((state) => state.session);
 const backlogItems = useBacklogStore((state) => state.backlogItems);

 const friends = useSocialStore((state) => state.friends);
 const pendingIncoming = useSocialStore((state) => state.pendingIncoming);
 const searchResults = useSocialStore((state) => state.searchResults);
 const isSearching = useSocialStore((state) => state.isSearching);
 const loadFriends = useSocialStore((state) => state.loadFriends);
 const loadPendingRequests = useSocialStore((state) => state.loadPendingRequests);
 const searchUsers = useSocialStore((state) => state.searchUsers);
 const sendRequest = useSocialStore((state) => state.sendRequest);
 const acceptRequest = useSocialStore((state) => state.acceptRequest);
 const rejectRequest = useSocialStore((state) => state.rejectRequest);
 const revokeRequest = useSocialStore((state) => state.revokeRequest);
 const clearSearch = useSocialStore((state) => state.clearSearch);

 const [visibleFriendsCount, setVisibleFriendsCount] = useState(FRIENDS_PAGE_SIZE);
 const [isStatsExpanded, setIsStatsExpanded] = useState(false);

 const userId = session?.user?.id;

 useEffect(() => {
  if (!userId) return;
  void loadFriends(userId);
  void loadPendingRequests(userId);
 }, [userId, loadFriends, loadPendingRequests]);

 const myStats = useMemo(() => {
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

 const handleSearch = useCallback(
  (query: string) => {
   if (!userId) return;
   if (query.trim().length < 2) {
    clearSearch();
    return;
   }
   void searchUsers(query, userId);
  },
  [userId, searchUsers, clearSearch],
 );

 const handleSendRequest = useCallback(
  (recipientId: string) => {
   if (!userId) return;
   void sendRequest(recipientId, userId);
  },
  [userId, sendRequest],
 );

 const handleAcceptRequest = useCallback(
  (friendshipId: string) => {
   void acceptRequest(friendshipId).then(() => {
    if (userId) {
     void loadFriends(userId);
     void loadPendingRequests(userId);
    }
   });
  },
  [acceptRequest, loadFriends, loadPendingRequests, userId],
 );

 const handleRejectRequest = useCallback(
  (friendshipId: string) => {
   void rejectRequest(friendshipId).then(() => {
    if (userId) void loadPendingRequests(userId);
   });
  },
  [rejectRequest, loadPendingRequests, userId],
 );

 const handleRevokeRequest = useCallback(
  (friendshipId: string) => {
   if (!userId) return;
   void revokeRequest(friendshipId, userId);
  },
  [revokeRequest, userId],
 );

 const handleFriendPress = useCallback(
  (friendUserId: string) => {
   router.push({ pathname: '/social/[userId]', params: { userId: friendUserId } });
  },
  [router],
 );

 const visibleFriends = friends.slice(0, visibleFriendsCount);
 const hasMoreFriends = friends.length > visibleFriendsCount;

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('tabs.social')} onBack={() => router.back()} />
   <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
     paddingHorizontal: spacing.md,
     paddingTop: layout.screenContentTopPadding,
     paddingBottom: layout.screenBottomPadding,
     gap: spacing.xl,
    }}
    keyboardShouldPersistTaps="handled"
   >
    <View style={{ gap: spacing.sm }}>
     <Pressable
      onPress={() => setIsStatsExpanded((v) => !v)}
      style={({ pressed }) => ({
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingVertical: spacing.xs,
       opacity: pressed ? 0.7 : 1,
      })}
     >
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.xs,
        fontFamily: typography.font.semibold,
        letterSpacing: typography.letterSpacing.wide,
        textTransform: 'uppercase',
       }}
      >
       {t('social.myStatsTitle')}
      </Text>
      <FontAwesome5
       name={isStatsExpanded ? 'chevron-up' : 'chevron-down'}
       size={10}
       color={colors.text.secondary}
      />
     </Pressable>
     {isStatsExpanded ? (
      <ProfileStatsCard
       stats={myStats}
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
     ) : null}
    </View>

    <View style={{ gap: spacing.sm }}>
     <SectionTitle label={t('social.searchTitle')} />
     <FriendSearchBar
      results={searchResults}
      isSearching={isSearching}
      onSearch={handleSearch}
      onSendRequest={handleSendRequest}
      onAcceptRequest={handleAcceptRequest}
      onRevokeRequest={handleRevokeRequest}
     />
    </View>

    {pendingIncoming.length > 0 ? (
     <View style={{ gap: spacing.sm }}>
      <SectionTitle label={t('social.requestsTitle')} />
      {pendingIncoming.map((friendship) => (
       <FriendRequestCard
        key={friendship.id}
        friendship={friendship}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
       />
      ))}
     </View>
    ) : null}

    {friends.length > 0 ? (
     <View style={{ gap: spacing.sm }}>
      <SectionTitle label={`${t('social.friendsTitle')} (${friends.length})`} />
      <View
       style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
        rowGap: spacing.md,
       }}
      >
       {visibleFriends.map((friendship, index) => (
        <FriendCard
         key={friendship.id}
         friendship={friendship}
         colorIndex={index}
         onPress={handleFriendPress}
        />
       ))}
      </View>
      {hasMoreFriends ? (
       <Pressable
        onPress={() => setVisibleFriendsCount((prev) => prev + FRIENDS_PAGE_SIZE)}
        style={({ pressed }) => ({
         alignSelf: 'center',
         paddingHorizontal: spacing.md,
         paddingVertical: spacing.xs,
         borderRadius: borderRadius.full,
         borderWidth: 1,
         borderColor: colors.border.DEFAULT,
         backgroundColor: pressed ? colors.background.elevated : 'transparent',
        })}
       >
        <Text
         style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.medium,
         }}
        >
         {t('social.showMoreFriends', { count: friends.length - visibleFriendsCount })}
        </Text>
       </Pressable>
      ) : null}
     </View>
    ) : null}

    {friends.length === 0 && pendingIncoming.length === 0 ? (
     <View style={{ paddingTop: spacing.xl, alignItems: 'center', gap: spacing.sm }}>
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        textAlign: 'center',
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
       }}
      >
       {t('social.noFriends')}
      </Text>
     </View>
    ) : null}
   </ScrollView>
  </SafeAreaView>
 );
}
