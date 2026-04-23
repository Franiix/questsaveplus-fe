import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
 runOnJS,
 useAnimatedStyle,
 useSharedValue,
 withRepeat,
 withSequence,
 withTiming,
} from 'react-native-reanimated';
import { colors, typography } from '@/shared/theme/tokens';

const MIN_VISIBLE_MS = 700;
const FADE_IN_MS = 280;
const FADE_OUT_MS = 340;

type LoadingOverlayProps = {
 message?: string;
 visible?: boolean;
};

export function LoadingOverlay({
 message = 'Caricamento...',
 visible = true,
}: LoadingOverlayProps) {
 const [shouldRender, setShouldRender] = useState(visible);
 const plusScale = useSharedValue(1);
 const plusOpacity = useSharedValue(1);
 const overlayOpacity = useSharedValue(visible ? 1 : 0);
 const shownAtRef = useRef<number | null>(visible ? Date.now() : null);
 const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
  if (!shouldRender) return;

  plusScale.value = withRepeat(
   withSequence(withTiming(1.18, { duration: 700 }), withTiming(1, { duration: 700 })),
   -1,
   true,
  );
  plusOpacity.value = withRepeat(
   withSequence(withTiming(0.6, { duration: 700 }), withTiming(1, { duration: 700 })),
   -1,
   true,
  );
 }, [plusOpacity, plusScale, shouldRender]);

 useEffect(() => {
  if (hideTimerRef.current) {
   clearTimeout(hideTimerRef.current);
   hideTimerRef.current = null;
  }

  if (visible) {
   if (!shouldRender) setShouldRender(true);
   shownAtRef.current = Date.now();
   overlayOpacity.value = withTiming(1, { duration: FADE_IN_MS });
   return;
  }

  if (!shouldRender) return;

  const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
  const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

  hideTimerRef.current = setTimeout(() => {
   overlayOpacity.value = withTiming(0, { duration: FADE_OUT_MS }, (finished) => {
    if (finished) runOnJS(setShouldRender)(false);
   });
  }, remaining);

  return () => {
   if (hideTimerRef.current) {
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
   }
  };
 }, [overlayOpacity, shouldRender, visible]);

 const plusStyle = useAnimatedStyle(() => ({
  transform: [{ scale: plusScale.value }],
  opacity: plusOpacity.value,
 }));

 const overlayStyle = useAnimatedStyle(() => ({
  opacity: overlayOpacity.value,
 }));

 return (
  <Modal visible={shouldRender} transparent statusBarTranslucent animationType="none">
   <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
    <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

    <LinearGradient
     colors={['rgba(7,8,18,0.72)', 'rgba(9,10,22,0.80)', 'rgba(10,10,20,0.86)']}
     style={StyleSheet.absoluteFill}
    />

    <LinearGradient
     colors={['rgba(123,92,255,0.08)', 'rgba(123,92,255,0.14)', 'rgba(0,0,0,0)']}
     style={StyleSheet.absoluteFill}
    />

    <View style={styles.centered}>
     <View style={styles.card}>
      <LinearGradient
       colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
       start={{ x: 0, y: 0 }}
       end={{ x: 1, y: 1 }}
       style={StyleSheet.absoluteFill}
      />

      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
       <Text style={styles.title}>QuestSave</Text>
       <Animated.Text style={[plusStyle, styles.plus]}>+</Animated.Text>
      </View>

      <Text style={styles.message}>{message}</Text>
     </View>
    </View>
   </Animated.View>
  </Modal>
 );
}

const styles = StyleSheet.create({
 centered: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
 },
 card: {
  minWidth: 214,
  maxWidth: 270,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  backgroundColor: 'rgba(15,16,29,0.64)',
  paddingHorizontal: 26,
  paddingVertical: 22,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.32,
  shadowRadius: 32,
  shadowOffset: { width: 0, height: 16 },
  elevation: 16,
 },
 title: {
  color: colors.text.primary,
  fontFamily: typography.font.bold,
  fontSize: typography.size.lg,
  letterSpacing: typography.letterSpacing.tight,
 },
 plus: {
  color: colors.primary.DEFAULT,
  fontFamily: typography.font.black,
  fontSize: typography.size.lg,
  marginLeft: 2,
 },
 message: {
  color: colors.text.secondary,
  fontFamily: typography.font.medium,
  fontSize: typography.size.sm,
  letterSpacing: typography.letterSpacing.normal,
  textAlign: 'center',
  opacity: 0.96,
 },
});
