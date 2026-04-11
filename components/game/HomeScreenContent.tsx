import { FontAwesome5 } from '@expo/vector-icons';
import { type ComponentRef, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type FlatList, Pressable, View } from 'react-native';
import Animated, {
 useAnimatedScrollHandler,
 useAnimatedStyle,
 useDerivedValue,
 useSharedValue,
 withSpring,
 withTiming,
} from 'react-native-reanimated';
import { EmptyState } from '@/components/base/feedback/EmptyState';
import { LoadingSpinner } from '@/components/base/feedback/LoadingSpinner';
import { RetryState } from '@/components/base/feedback/RetryState';
import { DiscoveryContextCard } from '@/components/game/DiscoveryContextCard';
import { DiscoverySortBar } from '@/components/game/DiscoverySortBar';
import { GameCard } from '@/components/game/GameCard';
import { GameCardSkeleton } from '@/components/game/GameCardSkeleton';
import { GameCarouselSection } from '@/components/game/GameCarouselSection';
import { RecentlyAddedRow } from '@/components/game/RecentlyAddedRow';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import type { HomeDiscoveryContextCard } from '@/shared/models/home/HomeDiscoveryContextCard.model';
import type { HomeDiscoveryEmptyState } from '@/shared/models/home/HomeDiscoveryEmptyState.model';
import type { HomeOrdering } from '@/shared/models/home/HomeOrdering.model';
import type { HomeSectionViewModel } from '@/shared/models/home/HomeSectionViewModel.model';
import type { HomeSortOption } from '@/shared/models/home/HomeSortOption.model';
import { colors, spacing } from '@/shared/theme/tokens';

const NUM_COLUMNS = 2;
const COLUMN_GAP = spacing.sm;
const HORIZONTAL_PADDING = spacing.md;

type HomeScreenContentProps = {
 activeOrdering: HomeOrdering;
 areAllSectionsError: boolean;
 cardWidth: number;
 carouselCardWidth: number;
 discoveryContextCard: HomeDiscoveryContextCard | null;
 discoveryEmptyState: HomeDiscoveryEmptyState;
 discoveryOriginLabel: string | null;
 fetchMoreDiscovery: () => void;
 games: CatalogGame[];
 homeSections: HomeSectionViewModel[];
 isDiscoveryError: boolean;
 isDiscoveryMode: boolean;
 isInitialLoading: boolean;
 isSectionsLoading: boolean;
 onGameLongPress: (game: CatalogGame) => void;
 onGamePress: (game: CatalogGame) => void;
 onResetFilters: () => void;
 onRetryDiscovery: () => void;
 onRetrySections: () => void;
 onSelectOrdering: (ordering: HomeOrdering) => void;
 scrollRequestKey: number;
 screenHeight: number;
 sortOptions: HomeSortOption[];
 uiState: {
  hasActiveFilters: boolean;
  isFetchingNextPage: boolean;
 };
};

export function HomeScreenContent({
 activeOrdering,
 areAllSectionsError,
 cardWidth,
 carouselCardWidth,
 discoveryContextCard,
 discoveryEmptyState,
 discoveryOriginLabel,
 fetchMoreDiscovery,
 games,
 homeSections,
 isDiscoveryError,
 isDiscoveryMode,
 isInitialLoading,
 isSectionsLoading,
 onGameLongPress,
 onGamePress,
 onResetFilters,
 onRetryDiscovery,
 onRetrySections,
 onSelectOrdering,
 scrollRequestKey,
 screenHeight,
 sortOptions,
 uiState,
}: HomeScreenContentProps) {
 const { t } = useTranslation();
 const flatListRef = useRef<FlatList | null>(null);
 const scrollViewRef = useRef<ComponentRef<typeof Animated.ScrollView> | null>(null);
 const scrollY = useSharedValue(0);

 const scrollHandler = useAnimatedScrollHandler((event) => {
  scrollY.value = event.contentOffset.y;
 });
 const fabVisible = useDerivedValue(() => scrollY.value > screenHeight * 3);
 const fabStyle = useAnimatedStyle(() => ({
  opacity: withTiming(fabVisible.value ? 1 : 0, { duration: 200 }),
  transform: [{ scale: withSpring(fabVisible.value ? 1 : 0.6, { damping: 15, stiffness: 180 }) }],
 }));

 useEffect(() => {
  if (scrollRequestKey === 0) {
   return;
  }

  if (isDiscoveryMode) {
   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
   return;
  }

  scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
 }, [isDiscoveryMode, scrollRequestKey]);

 const renderDiscoveryItem = useMemo(
  () =>
   ({ item }: { item: CatalogGame }) => (
    <GameCard game={item} width={cardWidth} onPress={onGamePress} onLongPress={onGameLongPress} />
   ),
  [cardWidth, onGameLongPress, onGamePress],
 );

 const discoveryFooter = useMemo(() => {
  if (!uiState.isFetchingNextPage) return null;

  return (
   <View style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
    <LoadingSpinner size="small" />
   </View>
  );
 }, [uiState.isFetchingNextPage]);

 const scrollToTop = () => {
  if (isDiscoveryMode) {
   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
   return;
  }

  scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
 };

 if (isDiscoveryMode && isDiscoveryError) {
  return (
   <RetryState
    message={t('auth.errors.generic')}
    actionLabel={t('home.errorRetry')}
    onRetry={onRetryDiscovery}
   />
  );
 }

 if (isDiscoveryMode && isInitialLoading) {
  return (
   <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: spacing.sm }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: COLUMN_GAP }}>
     {Array.from({ length: 6 }).map((_, index) => (
      <GameCardSkeleton
       // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton grid, no reordering
       key={index}
       width={cardWidth}
      />
     ))}
    </View>
   </View>
  );
 }

 if (isDiscoveryMode && games.length === 0) {
  return (
   <EmptyState
    icon="gamepad"
    title={discoveryEmptyState.title}
    subtitle={discoveryEmptyState.subtitle}
    action={
     uiState.hasActiveFilters
      ? {
         label: t('home.clearFilters'),
         onPress: onResetFilters,
        }
      : undefined
    }
   />
  );
 }

 if (isDiscoveryMode) {
  return (
   <>
    <Animated.FlatList
     ref={flatListRef}
     onScroll={scrollHandler}
     scrollEventThrottle={16}
     data={games}
     renderItem={renderDiscoveryItem}
     keyExtractor={(item) => item.id}
     numColumns={NUM_COLUMNS}
     onEndReached={fetchMoreDiscovery}
     onEndReachedThreshold={0.4}
     ListHeaderComponent={
      <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
       {discoveryContextCard ? (
        <View style={{ marginBottom: spacing.md }}>
         <DiscoveryContextCard
          eyebrow={discoveryOriginLabel ?? undefined}
          title={discoveryContextCard.title}
          subtitle={discoveryContextCard.subtitle}
          icon={discoveryContextCard.icon}
          clearLabel={t('home.clearFilters')}
          onClear={onResetFilters}
         />
        </View>
       ) : null}

       <DiscoverySortBar
        options={sortOptions}
        selectedKey={activeOrdering}
        onSelect={onSelectOrdering}
       />
      </View>
     }
     ListFooterComponent={discoveryFooter}
     contentContainerStyle={{
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: spacing.sm,
      paddingBottom: 80,
      gap: COLUMN_GAP,
     }}
     columnWrapperStyle={{ gap: COLUMN_GAP }}
     showsVerticalScrollIndicator={false}
     keyboardShouldPersistTaps="handled"
     keyboardDismissMode="on-drag"
     style={{ flex: 1 }}
    />

    <Animated.View
     style={[
      fabStyle,
      {
       position: 'absolute',
       bottom: 96,
       right: HORIZONTAL_PADDING,
       width: 44,
       height: 44,
       borderRadius: 22,
       backgroundColor: colors.primary.DEFAULT,
       alignItems: 'center',
       justifyContent: 'center',
       shadowColor: colors.primary.DEFAULT,
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.4,
       shadowRadius: 8,
       elevation: 8,
      },
     ]}
    >
     <Pressable
      onPress={scrollToTop}
      accessibilityRole="button"
      accessibilityLabel="Torna in cima"
      hitSlop={8}
      style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
     >
      <FontAwesome5 name="arrow-up" size={16} color="#fff" solid />
     </Pressable>
    </Animated.View>
   </>
  );
 }

 if (areAllSectionsError) {
  return (
   <RetryState
    message={t('auth.errors.generic')}
    actionLabel={t('home.errorRetry')}
    onRetry={onRetrySections}
   />
  );
 }

 if (isSectionsLoading) {
  return (
   <View style={{ paddingTop: spacing.sm }}>
    {homeSections.map((section) => (
     <GameCarouselSection
      key={section.key}
      title={section.title}
      games={[]}
      cardWidth={carouselCardWidth}
      isLoading
      onPress={onGamePress}
      onLongPress={onGameLongPress}
     />
    ))}
   </View>
  );
 }

 return (
  <Animated.ScrollView
   ref={scrollViewRef}
   onScroll={scrollHandler}
   scrollEventThrottle={16}
   showsVerticalScrollIndicator={false}
   keyboardShouldPersistTaps="handled"
   keyboardDismissMode="on-drag"
   contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 96 }}
   style={{ flex: 1 }}
  >
   <RecentlyAddedRow />
   {homeSections.map((section) => (
    <GameCarouselSection
     key={section.key}
     title={section.title}
     games={section.games}
     cardWidth={carouselCardWidth}
     isLoading={section.isLoading}
     isFetchingNextPage={section.isFetchingNextPage}
     hasNextPage={section.hasNextPage}
     isError={section.isError}
     errorText={t('auth.errors.generic')}
     retryLabel={t('home.errorRetry')}
     onEndReached={section.onEndReached}
     onRetry={section.onRetry}
     onPress={onGamePress}
     onLongPress={onGameLongPress}
    />
   ))}
  </Animated.ScrollView>
 );
}
