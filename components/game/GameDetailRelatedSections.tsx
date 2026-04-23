import { useMemo } from 'react';
import { View } from 'react-native';
import type { CatalogGame } from '@/shared/models/Catalog.model';
import { spacing } from '@/shared/theme/tokens';
import { GameCarouselSection } from './GameCarouselSection';

type RelatedSection = {
 key: string;
 title: string;
 games: CatalogGame[];
 isLoading?: boolean;
};

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
 const sections: RelatedSection[] = useMemo(
  () => [
   { key: 'series', title: seriesTitle, games: sameSeriesGames, isLoading: isSeriesLoading },
   { key: 'dlc', title: dlcTitle, games: dlcGames, isLoading: isAdditionsLoading },
   { key: 'editions', title: editionsTitle, games: editionGames },
   { key: 'expansions', title: expansionsTitle, games: expansionGames },
   {
    key: 'developer-games',
    title: moreFromDeveloperTitle,
    games: moreFromDeveloper,
    isLoading: isDeveloperGamesLoading,
   },
   {
    key: 'publisher-games',
    title: moreFromPublisherTitle,
    games: moreFromPublisher,
    isLoading: isPublisherGamesLoading,
   },
   {
    key: 'similar-games',
    title: similarGamesTitle,
    games: similarGames,
    isLoading: isSimilarGamesLoading,
   },
  ],
  [
   seriesTitle,
   sameSeriesGames,
   isSeriesLoading,
   dlcTitle,
   dlcGames,
   isAdditionsLoading,
   editionsTitle,
   editionGames,
   expansionsTitle,
   expansionGames,
   moreFromDeveloperTitle,
   moreFromDeveloper,
   isDeveloperGamesLoading,
   moreFromPublisherTitle,
   moreFromPublisher,
   isPublisherGamesLoading,
   similarGamesTitle,
   similarGames,
   isSimilarGamesLoading,
  ],
 );
 const visibleSections = useMemo(
  () => sections.filter((section) => section.games.length > 0 || section.isLoading),
  [sections],
 );

 if (visibleSections.length === 0) return null;

 return (
  <View
   style={{ marginTop: spacing['2xl'], gap: spacing.lg }}
   onLayout={(event) => registerSectionOffset('contents', event.nativeEvent.layout.y)}
  >
   {visibleSections.map((section) => {
    const content = (
     <GameCarouselSection
      title={section.title}
      games={section.games}
      cardWidth={relatedCardWidth}
      horizontalPadding={0}
      isLoading={Boolean(section.isLoading && section.games.length === 0)}
      onPress={onRelatedGamePress}
     />
    );

    if (section.key === 'similar-games') {
     return <View key={section.key}>{content}</View>;
    }

    return (
     <View
      key={section.key}
      onLayout={(event) => registerSectionOffset(section.key, event.nativeEvent.layout.y)}
     >
      {content}
     </View>
    );
   })}
  </View>
 );
}
