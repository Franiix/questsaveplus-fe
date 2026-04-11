import { useCallback, useRef, useState } from 'react';
import type {
 NativeScrollEvent,
 NativeSyntheticEvent,
 ScrollView as RNScrollView,
} from 'react-native';
import { Animated } from 'react-native';
import { spacing } from '@/shared/theme/tokens';

type UseGameDetailScreenStateParams = {
 stickyThreshold: number;
};

export function useGameDetailScreenState({ stickyThreshold }: UseGameDetailScreenStateParams) {
 const scrollViewRef = useRef<RNScrollView | null>(null);
 const sectionOffsetsRef = useRef<Record<string, number>>({});
 const scrollY = useRef(new Animated.Value(0)).current;
 const [descriptionExpanded, setDescriptionExpanded] = useState(false);
 const [storylineExpanded, setStorylineExpanded] = useState(false);
 const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
 const [isStickyVisible, setIsStickyVisible] = useState(false);

 const registerSectionOffset = useCallback((key: string, y: number) => {
  sectionOffsetsRef.current[key] = y;
 }, []);

 const scrollToSection = useCallback((key: string) => {
  const y = sectionOffsetsRef.current[key];
  if (typeof y !== 'number') return;
  scrollViewRef.current?.scrollTo({ y: Math.max(0, y - spacing.lg), animated: true });
 }, []);

 const handleNotesFocus = useCallback(() => {
  setTimeout(() => {
   const backlogOffset = sectionOffsetsRef.current.backlog;
   if (typeof backlogOffset === 'number') {
    scrollViewRef.current?.scrollTo({
     y: Math.max(0, backlogOffset - spacing.md),
     animated: true,
    });
    return;
   }

   scrollViewRef.current?.scrollToEnd({ animated: true });
  }, 200);
 }, []);

 const handleScroll = useCallback(
  (event: NativeSyntheticEvent<NativeScrollEvent>) => {
   const offsetY = event.nativeEvent.contentOffset.y;
   const shouldShow = offsetY >= stickyThreshold;
   if (shouldShow !== isStickyVisible) {
    setIsStickyVisible(shouldShow);
   }
  },
  [isStickyVisible, stickyThreshold],
 );

 const stickyHeaderOpacity = scrollY.interpolate({
  inputRange: [stickyThreshold - 40, stickyThreshold],
  outputRange: [0, 1],
  extrapolate: 'clamp',
 });

 const stickyHeaderTranslateY = scrollY.interpolate({
  inputRange: [stickyThreshold - 40, stickyThreshold],
  outputRange: [-12, 0],
  extrapolate: 'clamp',
 });

 return {
  confirmRemoveVisible,
  descriptionExpanded,
  handleNotesFocus,
  handleScroll,
  isStickyVisible,
  registerSectionOffset,
  scrollToSection,
  scrollViewRef,
  scrollY,
  setConfirmRemoveVisible,
  setDescriptionExpanded,
  setStorylineExpanded,
  stickyHeaderOpacity,
  stickyHeaderTranslateY,
  storylineExpanded,
 } as const;
}
