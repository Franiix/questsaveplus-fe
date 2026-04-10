import { View } from 'react-native';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { spacing } from '@/shared/theme/tokens';
import { GameCarouselSection } from './GameCarouselSection';

type GameDetailRelatedSectionsProps = {
  sameSeriesGames: CatalogGame[];
  isSeriesLoading: boolean;
  seriesTitle: string;
  dlcGames: CatalogGame[];
  isAdditionsLoading: boolean;
  dlcTitle: string;
  editionGames: CatalogGame[];
  editionsTitle: string;
  expansionGames: CatalogGame[];
  expansionsTitle: string;
  moreFromDeveloper: CatalogGame[];
  isDeveloperGamesLoading: boolean;
  moreFromDeveloperTitle: string;
  moreFromPublisher: CatalogGame[];
  isPublisherGamesLoading: boolean;
  moreFromPublisherTitle: string;
  similarGames: CatalogGame[];
  isSimilarGamesLoading: boolean;
  similarGamesTitle: string;
  relatedCardWidth: number;
  onRelatedGamePress: (game: CatalogGame) => void;
  registerSectionOffset: (key: string, y: number) => void;
};

export function GameDetailRelatedSections({
  sameSeriesGames,
  isSeriesLoading,
  seriesTitle,
  dlcGames,
  isAdditionsLoading,
  dlcTitle,
  editionGames,
  editionsTitle,
  expansionGames,
  expansionsTitle,
  moreFromDeveloper,
  isDeveloperGamesLoading,
  moreFromDeveloperTitle,
  moreFromPublisher,
  isPublisherGamesLoading,
  moreFromPublisherTitle,
  similarGames,
  isSimilarGamesLoading,
  similarGamesTitle,
  relatedCardWidth,
  onRelatedGamePress,
  registerSectionOffset,
}: GameDetailRelatedSectionsProps) {
  const hasRelatedSections =
    sameSeriesGames.length > 0 ||
    isSeriesLoading ||
    dlcGames.length > 0 ||
    editionGames.length > 0 ||
    expansionGames.length > 0 ||
    isAdditionsLoading ||
    similarGames.length > 0 ||
    isSimilarGamesLoading ||
    moreFromDeveloper.length > 0 ||
    isDeveloperGamesLoading ||
    moreFromPublisher.length > 0 ||
    isPublisherGamesLoading;

  if (!hasRelatedSections) return null;

  return (
    <View
      style={{ marginTop: spacing['2xl'], gap: spacing.lg }}
      onLayout={(event) => registerSectionOffset('contents', event.nativeEvent.layout.y)}
    >
      {sameSeriesGames.length > 0 || isSeriesLoading ? (
        <View onLayout={(event) => registerSectionOffset('series', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={seriesTitle}
            games={sameSeriesGames}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            isLoading={isSeriesLoading && sameSeriesGames.length === 0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {dlcGames.length > 0 || isAdditionsLoading ? (
        <View onLayout={(event) => registerSectionOffset('dlc', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={dlcTitle}
            games={dlcGames}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            isLoading={isAdditionsLoading && dlcGames.length === 0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {editionGames.length > 0 ? (
        <View onLayout={(event) => registerSectionOffset('editions', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={editionsTitle}
            games={editionGames}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {expansionGames.length > 0 ? (
        <View onLayout={(event) => registerSectionOffset('expansions', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={expansionsTitle}
            games={expansionGames}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {moreFromDeveloper.length > 0 || isDeveloperGamesLoading ? (
        <View onLayout={(event) => registerSectionOffset('developer-games', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={moreFromDeveloperTitle}
            games={moreFromDeveloper}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            isLoading={isDeveloperGamesLoading && moreFromDeveloper.length === 0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {moreFromPublisher.length > 0 || isPublisherGamesLoading ? (
        <View onLayout={(event) => registerSectionOffset('publisher-games', event.nativeEvent.layout.y)}>
          <GameCarouselSection
            title={moreFromPublisherTitle}
            games={moreFromPublisher}
            cardWidth={relatedCardWidth}
            horizontalPadding={0}
            isLoading={isPublisherGamesLoading && moreFromPublisher.length === 0}
            onPress={onRelatedGamePress}
          />
        </View>
      ) : null}

      {similarGames.length > 0 || isSimilarGamesLoading ? (
        <GameCarouselSection
          title={similarGamesTitle}
          games={similarGames}
          cardWidth={relatedCardWidth}
          horizontalPadding={0}
          isLoading={isSimilarGamesLoading && similarGames.length === 0}
          onPress={onRelatedGamePress}
        />
      ) : null}
    </View>
  );
}
