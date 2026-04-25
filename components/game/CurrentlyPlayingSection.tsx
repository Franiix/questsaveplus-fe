import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useSingleAction } from '@/hooks/useSingleAction';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { BacklogStatusEnum } from '@/shared/enums/BacklogStatus.enum';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';

const CARD_WIDTH = 110;
const CARD_HEIGHT = 160;

export function CurrentlyPlayingSection() {
 const { t } = useTranslation();
 const { session } = useAuthStore();
 const isFocused = useIsFocused();
 const backlogItems = useBacklogStore((state) => state.backlogItems);
 const isReadingList = useBacklogStore((state) => state.isReadingList);
 const readAll = useBacklogStore((state) => state.readAll);
 const userId = session?.user?.id;

 useEffect(() => {
  if (!isFocused || !userId || backlogItems.length > 0 || isReadingList) return;
  void readAll(userId);
 }, [isFocused, userId, backlogItems.length, isReadingList, readAll]);

 const currentlyPlaying = backlogItems.filter(
  (item) => item.status === BacklogStatusEnum.PLAYING || item.status === BacklogStatusEnum.ONGOING,
 );

 if (currentlyPlaying.length === 0) return null;

 return (
  <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
   <SectionTitle
    title={t('home.currentlyPlaying.title')}
    style={{ paddingHorizontal: spacing.md }}
   />
   <FlatList
    horizontal
    data={currentlyPlaying}
    keyExtractor={(item) => item.id}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
    renderItem={({ item }) => <CurrentlyPlayingCard item={item} />}
   />
  </View>
 );
}

function CurrentlyPlayingCard({ item }: { item: BacklogItemEntity }) {
 const router = useSafeRouter();
 const handlePress = useCallback(() => {
  router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
 }, [item.game_id, router]);
 const { isLocked, run } = useSingleAction(handlePress);

 const statusColor =
  item.status === BacklogStatusEnum.PLAYING ? colors.status.playing : colors.status.ongoing;

 return (
  <Pressable onPress={run} disabled={isLocked}>
   <View
    style={{
     width: CARD_WIDTH,
     height: CARD_HEIGHT,
     borderRadius: borderRadius.md,
     overflow: 'hidden',
     backgroundColor: colors.background.surface,
     opacity: isLocked ? 0.72 : 1,
    }}
   >
    <ImageWithFallback
     uri={item.game_cover_url}
     width={CARD_WIDTH}
     height={CARD_HEIGHT}
     radius={borderRadius.md}
    />
    <View
     style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: statusColor,
     }}
    />
   </View>
   <Text
    numberOfLines={1}
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.xs,
     fontFamily: typography.font.medium,
     marginTop: spacing.xs,
     width: CARD_WIDTH,
     opacity: isLocked ? 0.72 : 1,
    }}
   >
    {item.game_name}
   </Text>
  </Pressable>
 );
}
