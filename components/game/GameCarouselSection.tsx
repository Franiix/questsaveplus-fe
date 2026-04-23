import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { GameCard, type GameCardItem } from '@/components/game/GameCard';
import { GameCardSkeleton } from '@/components/game/GameCardSkeleton';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type GameCarouselSectionProps = {
 title: string;
 games: GameCardItem[];
 cardWidth: number;
 horizontalPadding?: number;
 isLoading?: boolean;
 isFetchingNextPage?: boolean;
 hasNextPage?: boolean;
 isError?: boolean;
 errorText?: string;
 retryLabel?: string;
 onEndReached?: () => void;
 onRetry?: () => void;
 onPress: (game: GameCardItem) => void;
 onPressIn?: (game: GameCardItem) => void;
 onLongPress?: (game: GameCardItem) => void;
};

export function GameCarouselSection({
 title,
 games,
 cardWidth,
 horizontalPadding = spacing.md,
 isLoading = false,
 isFetchingNextPage = false,
 hasNextPage = false,
 isError = false,
 errorText = 'Something went wrong.',
 retryLabel = 'Retry',
 onEndReached,
 onRetry,
 onPress,
 onPressIn,
 onLongPress,
}: GameCarouselSectionProps) {
 const renderItem = useCallback(
  ({ item }: { item: GameCardItem }) => (
   <GameCard
    game={item}
    width={cardWidth}
    onPress={onPress}
    onPressIn={onPressIn}
    onLongPress={onLongPress}
   />
  ),
  [cardWidth, onLongPress, onPress, onPressIn],
 );

 const keyExtractor = useCallback((item: GameCardItem, index: number) => `${item.id}-${index}`, []);

 return (
  <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
   <SectionTitle title={title} style={{ paddingHorizontal: horizontalPadding }} />

   {isError ? (
    <View style={{ paddingHorizontal: horizontalPadding }}>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.regular,
       marginBottom: spacing.xs,
      }}
     >
      {errorText}
     </Text>
     {onRetry ? (
      <Text
       onPress={onRetry}
       style={{
        color: colors.primary.DEFAULT,
        fontSize: typography.size.sm,
        fontFamily: typography.font.semibold,
       }}
      >
       {retryLabel}
      </Text>
     ) : null}
    </View>
   ) : isLoading ? (
    <FlatList
     horizontal
     data={Array.from({ length: 4 }, (_, index) => ({ id: `skeleton-${title}-${index}` }))}
     keyExtractor={(item) => item.id}
     showsHorizontalScrollIndicator={false}
     contentContainerStyle={{ paddingHorizontal: horizontalPadding, gap: spacing.sm }}
     renderItem={() => <GameCardSkeleton width={cardWidth} />}
    />
   ) : (
    <FlatList
     horizontal
     data={games}
     renderItem={renderItem}
     keyExtractor={keyExtractor}
     onEndReached={() => {
      if (hasNextPage && !isFetchingNextPage) {
       onEndReached?.();
      }
     }}
     onEndReachedThreshold={0.5}
     showsHorizontalScrollIndicator={false}
     contentContainerStyle={{ paddingHorizontal: horizontalPadding, gap: spacing.sm }}
     ListFooterComponent={isFetchingNextPage ? <GameCardSkeleton width={cardWidth} /> : null}
    />
   )}
  </View>
 );
}
