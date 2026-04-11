import { FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type MediaTab = 'screenshots' | 'artworks' | 'trailers';

type MediaTabOption = {
 key: MediaTab;
 label: string;
 count: number;
};

type TrailerItem = {
 title: string;
 videoId: string;
 url: string;
 thumbnail: string;
};

type GameMediaSectionProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
};

const THUMBNAIL_WIDTH = 240;
const THUMBNAIL_HEIGHT = 135;

function buildIgdbImageUrl(imageId?: string, size = 't_screenshot_huge') {
 if (!imageId) return null;
 return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

function getYoutubeThumbnail(videoId?: string) {
 if (!videoId) return null;
 return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getYoutubeUrl(videoId?: string) {
 if (!videoId) return null;
 return `https://www.youtube.com/watch?v=${videoId}`;
}

function buildTrailerItems(videos: IgdbRawExtras['videos']): TrailerItem[] {
 return (videos ?? [])
  .map((video) => {
   const videoId = video.video_id ?? null;
   const url = getYoutubeUrl(video.video_id);
   const thumbnail = getYoutubeThumbnail(video.video_id);

   if (!videoId || !url || !thumbnail) {
    return null;
   }

   return {
    title: video.name?.trim() || 'Trailer',
    videoId,
    url,
    thumbnail,
   };
  })
  .filter((item): item is TrailerItem => item !== null);
}

function buildMediaTabOptions(
 providerId: string | null | undefined,
 t: ReturnType<typeof useTranslation>['t'],
 trailersCount: number,
 screenshotsCount: number,
 artworksCount: number,
): MediaTabOption[] {
 if (providerId !== 'igdb') {
  return [];
 }

 return [
  { key: 'trailers' as const, label: t('gameDetail.trailers'), count: trailersCount },
  { key: 'screenshots' as const, label: t('gameDetail.screenshots'), count: screenshotsCount },
  { key: 'artworks' as const, label: t('gameDetail.artworks'), count: artworksCount },
 ].filter((item) => item.count > 0);
}

export function GameMediaSection({ providerId, raw }: GameMediaSectionProps) {
 const { t } = useTranslation();
 const { width: screenWidth, height: screenHeight } = useWindowDimensions();
 const [selectedImage, setSelectedImage] = useState<string | null>(null);
 const [activeTab, setActiveTab] = useState<MediaTab>('screenshots');

 const media = raw ?? null;
 const screenshots = useMemo(
  () =>
   (media?.screenshots ?? [])
    .map((item) => buildIgdbImageUrl(item.image_id))
    .filter((item): item is string => Boolean(item)),
  [media?.screenshots],
 );
 const artworks = useMemo(
  () =>
   (media?.artworks ?? [])
    .map((item) => buildIgdbImageUrl(item.image_id))
    .filter((item): item is string => Boolean(item)),
  [media?.artworks],
 );
 const trailers = useMemo(() => buildTrailerItems(media?.videos), [media?.videos]);
 const tabs = useMemo(
  () => buildMediaTabOptions(providerId, t, trailers.length, screenshots.length, artworks.length),
  [artworks.length, providerId, screenshots.length, t, trailers.length],
 );

 const defaultTab = tabs[0]?.key ?? 'screenshots';
 useEffect(() => {
  if (tabs.length > 0 && !tabs.some((tab) => tab.key === activeTab)) {
   setActiveTab(defaultTab);
  }
 }, [activeTab, defaultTab, tabs]);

 if (providerId !== 'igdb' || tabs.length === 0) return null;

 const imageItems = activeTab === 'artworks' ? artworks : screenshots;
 const previewWidth = Math.max(260, screenWidth - spacing.xl * 2);
 const previewHeight = Math.min(screenHeight * 0.68, previewWidth * 0.5625);

 return (
  <>
   <Card
    variant="outlined"
    style={{
     marginTop: spacing.xl,
     padding: spacing.md,
     gap: spacing.md,
    }}
   >
    <SectionTitle title={t('gameDetail.media')} />

    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
     {tabs.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
       <Pressable
        key={tab.key}
        onPress={() => setActiveTab(tab.key)}
        style={{
         borderRadius: borderRadius.full,
         paddingHorizontal: spacing.md,
         paddingVertical: spacing.sm,
         borderWidth: 1,
         borderColor: isActive ? colors.primary.DEFAULT : colors.border.subtle,
         backgroundColor: isActive ? colors.primary.glowSoft : colors.background.elevated,
        }}
       >
        <Text
         style={{
          color: colors.text.primary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.semibold,
         }}
        >
         {tab.label}
        </Text>
       </Pressable>
      );
     })}
    </View>

    {activeTab === 'trailers' ? (
     <FlatList
      horizontal
      data={trailers}
      keyExtractor={(item) => String(item.videoId)}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm }}
      renderItem={({ item }) => (
       <Card
        variant="outlined"
        onPress={() => {
         if (item.url) {
          void Linking.openURL(item.url);
         }
        }}
        style={{ overflow: 'hidden' }}
       >
        <View>
         <ImageWithFallback
          uri={item.thumbnail ?? undefined}
          width={THUMBNAIL_WIDTH}
          height={THUMBNAIL_HEIGHT}
          radius={borderRadius.lg}
         />
         <View
          style={{
           position: 'absolute',
           top: 0,
           right: 0,
           bottom: 0,
           left: 0,
           alignItems: 'center',
           justifyContent: 'center',
          }}
         >
          <View
           style={{
            width: 56,
            height: 56,
            borderRadius: borderRadius.full,
            backgroundColor: 'rgba(0,0,0,0.58)',
            alignItems: 'center',
            justifyContent: 'center',
           }}
          >
           <FontAwesome5 name="play" size={16} color={colors.text.primary} solid />
          </View>
         </View>
        </View>
        <View style={{ padding: spacing.md, gap: spacing.xs }}>
         <Text
          numberOfLines={2}
          style={{
           color: colors.text.primary,
           fontSize: typography.size.base,
           fontFamily: typography.font.semibold,
          }}
         >
          {item.title}
         </Text>
         <Text
          style={{
           color: colors.primary.DEFAULT,
           fontSize: typography.size.sm,
           fontFamily: typography.font.semibold,
          }}
         >
          {t('gameDetail.watchTrailer')}
         </Text>
        </View>
       </Card>
      )}
     />
    ) : imageItems.length > 0 ? (
     <FlatList
      horizontal
      data={imageItems}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm }}
      renderItem={({ item }) => (
       <Card
        variant="outlined"
        onPress={() => setSelectedImage(item)}
        style={{ overflow: 'hidden' }}
       >
        <ImageWithFallback
         uri={item}
         width={THUMBNAIL_WIDTH}
         height={THUMBNAIL_HEIGHT}
         radius={borderRadius.lg}
        />
       </Card>
      )}
     />
    ) : (
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.regular,
      }}
     >
      {t('gameDetail.noScreenshots')}
     </Text>
    )}
   </Card>

   <Modal
    visible={Boolean(selectedImage)}
    transparent
    animationType="fade"
    onRequestClose={() => setSelectedImage(null)}
   >
    <View
     style={{
      flex: 1,
      backgroundColor: 'rgba(4, 4, 10, 0.94)',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
     }}
    >
     <Pressable
      onPress={() => setSelectedImage(null)}
      style={{
       position: 'absolute',
       top: spacing['2xl'],
       right: spacing.lg,
       zIndex: 2,
       width: 42,
       height: 42,
       borderRadius: borderRadius.full,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: 'rgba(255,255,255,0.08)',
       borderWidth: 1,
       borderColor: colors.border.strong,
      }}
     >
      <FontAwesome5 name="times" size={18} color={colors.text.primary} solid />
     </Pressable>
     {selectedImage ? (
      <View style={{ alignItems: 'center' }}>
       <ImageWithFallback
        uri={selectedImage}
        width={previewWidth}
        height={previewHeight}
        radius={borderRadius.xl}
       />
      </View>
     ) : null}
    </View>
   </Modal>
  </>
 );
}
