import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { usePrefetchGameResources } from '@/hooks/usePrefetchGameResources';
import { useSingleAction } from '@/hooks/useSingleAction';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import type { BacklogItemEntity } from '@/shared/entities/BacklogItem.entity';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { useAuthStore } from '@/stores/auth.store';
import { useBacklogStore } from '@/stores/backlog.store';

const CARD_WIDTH = 110;
const CARD_HEIGHT = 160;

export function RecentlyAddedRow() {
  const { t } = useTranslation();
  const router = useSafeRouter();
  const { session } = useAuthStore();
  const { recentBacklogItems, readAll, clearBacklog } = useBacklogStore();
  const { prefetchGameById } = usePrefetchGameResources();

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      clearBacklog();
      return;
    }

    void readAll(userId, { orderBy: 'added_at', limit: 5, target: 'recentBacklogItems' });
  }, [clearBacklog, readAll, userId]);

  useEffect(() => {
    void Promise.all(
      recentBacklogItems.slice(0, 4).map((item) =>
        prefetchGameById(item.game_id, item.game_cover_url ? [item.game_cover_url] : []),
      ),
    );
  }, [prefetchGameById, recentBacklogItems]);

  const handlePress = useCallback(
    (item: BacklogItemEntity) => {
      router.push({ pathname: '/game/[id]', params: { id: item.game_id } });
    },
    [router],
  );

  if (recentBacklogItems.length === 0) return null;

  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
      <SectionTitle title={t('home.recentlyAdded')} style={{ paddingHorizontal: spacing.md }} />
      <FlatList
        horizontal
        data={recentBacklogItems}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
        renderItem={({ item }) => <RecentlyAddedCard item={item} onPress={handlePress} />}
      />
    </View>
  );
}

function RecentlyAddedCard({
 item,
 onPress,
}: {
 item: BacklogItemEntity;
 onPress: (item: BacklogItemEntity) => void;
}) {
 const { isLocked, run } = useSingleAction(() => onPress(item));

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
