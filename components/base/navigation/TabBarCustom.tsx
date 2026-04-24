import { FontAwesome5 } from '@expo/vector-icons';
import { useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { colors, typography } from '@/shared/theme/tokens';

type TabKey = 'index' | 'backlog' | 'archive' | 'play-next';
type IconName = React.ComponentProps<typeof FontAwesome5>['name'];

const TAB_ICONS: Record<TabKey, IconName> = {
 index: 'home',
 backlog: 'bookmark',
 archive: 'archive',
 'play-next': 'bolt',
};

const TAB_LABEL_KEYS: Record<
 TabKey,
 'tabs.home' | 'tabs.backlog' | 'tabs.archive' | 'tabs.playNext'
> = {
 index: 'tabs.home',
 backlog: 'tabs.backlog',
 archive: 'tabs.archive',
 'play-next': 'tabs.playNext',
};

const TAB_ROUTES: Record<
 TabKey,
 '/(tabs)' | '/(tabs)/backlog' | '/backlog-archive' | '/(tabs)/play-next'
> = {
 index: '/(tabs)',
 backlog: '/(tabs)/backlog',
 archive: '/backlog-archive',
 'play-next': '/(tabs)/play-next',
};

const TAB_ORDER: TabKey[] = ['index', 'backlog', 'play-next', 'archive'];
const TAB_HEIGHT = 46;
const HORIZONTAL_INSET = 28;
const CONTAINER_PADDING = 5;

function resolveActiveTab(segments: string[]): TabKey {
 const [first, second] = segments;

 if (first === '(tabs)') {
  if (second === 'backlog') return 'backlog';
  if (second === 'play-next') return 'play-next';
  return 'index';
 }

 if (first === 'backlog-archive') return 'archive';
 if (first === 'play-next-reorder') return 'play-next';
 if (first === 'game') return 'index';
 return 'index';
}

export function TabBarCustom() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const segments = useSegments();
 const { width: screenWidth } = useWindowDimensions();
 const insets = useSafeAreaInsets();

 const hidden = segments[0] === '(auth)' || (segments[0] === 'auth' && segments[1] === 'callback');
 const isProfileSurface =
  (segments[0] === '(tabs)' && (segments[1] === 'profile' || segments[1] === 'credits')) ||
  segments[0] === 'profile';

 const activeTab = resolveActiveTab(segments);
 const barWidth = screenWidth - HORIZONTAL_INSET * 2;
 const innerWidth = barWidth - CONTAINER_PADDING * 2;
 const tabWidth = innerWidth / TAB_ORDER.length;
 const activeIndex = Math.max(0, TAB_ORDER.indexOf(activeTab));
 const bubbleWidth = tabWidth;
 const bubbleX = useSharedValue(activeIndex * tabWidth);

 useEffect(() => {
  bubbleX.value = withSpring(activeIndex * tabWidth, {
   damping: 18,
   stiffness: 170,
  });
 }, [activeIndex, bubbleX, tabWidth]);

 const bubbleStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: bubbleX.value }],
 }));

 if (hidden || isProfileSurface) return null;

 return (
  <View
   pointerEvents="box-none"
   style={{
    position: 'absolute',
    left: HORIZONTAL_INSET,
    right: HORIZONTAL_INSET,
    bottom: Math.max(insets.bottom - 2, 4),
   }}
  >
   <View
    style={{
     borderRadius: 24,
     backgroundColor: 'rgba(10, 11, 20, 0.88)',
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.07)',
     padding: CONTAINER_PADDING,
     shadowColor: colors.background.overlay,
     shadowOffset: { width: 0, height: 10 },
     shadowOpacity: 0.2,
     shadowRadius: 20,
     elevation: 12,
     overflow: 'hidden',
    }}
   >
    <View
     pointerEvents="none"
     style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.025)',
     }}
    />
    <View
     pointerEvents="none"
     style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 22,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: 'rgba(8,8,16,0.18)',
     }}
    />
    <Animated.View
     pointerEvents="none"
     style={[
      {
       position: 'absolute',
       top: CONTAINER_PADDING,
       left: CONTAINER_PADDING,
       width: bubbleWidth,
       height: TAB_HEIGHT,
       borderRadius: 18,
       backgroundColor: 'rgba(108, 99, 255, 0.19)',
       borderWidth: 1,
       borderColor: 'rgba(186, 179, 255, 0.1)',
       shadowColor: colors.primary.DEFAULT,
       shadowOffset: { width: 0, height: 0 },
       shadowOpacity: 0.14,
       shadowRadius: 12,
      },
      bubbleStyle,
     ]}
    />

    <View style={{ flexDirection: 'row', height: TAB_HEIGHT }}>
     {TAB_ORDER.map((tab) => {
      const isFocused = tab === activeTab;
      const iconColor = isFocused ? colors.primary['200'] : colors.text.disabled;
      const label = t(TAB_LABEL_KEYS[tab]);

      return (
       <Pressable
        key={tab}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={() => {
         if (isFocused) return;
         router.navigate(TAB_ROUTES[tab]);
        }}
        style={{
         width: tabWidth,
         alignItems: 'center',
         justifyContent: 'center',
         gap: 2,
         borderRadius: 18,
        }}
       >
        <FontAwesome5 name={TAB_ICONS[tab]} size={17} color={iconColor} solid={isFocused} />
        <Text
         numberOfLines={1}
         style={{
          color: iconColor,
          fontSize: typography.size.xs,
          fontFamily: isFocused ? typography.font.semibold : typography.font.medium,
          opacity: isFocused ? 1 : 0.82,
          textShadowColor: isFocused ? 'rgba(0,0,0,0.35)' : 'transparent',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 4,
          letterSpacing: isFocused
           ? typography.letterSpacing.normal
           : typography.letterSpacing.tight,
         }}
        >
         {label}
        </Text>
       </Pressable>
      );
     })}
    </View>
   </View>
  </View>
 );
}
