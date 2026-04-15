import { LinearGradient } from 'expo-linear-gradient';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { colors, typography } from '@/shared/theme/tokens';

const MIN_VISIBLE_MS = 700;
const FADE_IN_MS = 220;
const FADE_OUT_MS = 260;

type LoadingOverlayProps = {
  /** Testo sotto il logo. Default: 'Caricamento...' */
  message?: string;
  /** Se false il componente non viene renderizzato. Default: true */
  visible?: boolean;
};

/**
 * Molecule: overlay fullscreen con logo QuestSave+ animato.
 * Usa Modal nativo per garantire copertura totale dello schermo
 * indipendentemente dall'albero di componenti (inclusa status bar su Android).
 */
export function LoadingOverlay({ message = 'Caricamento...', visible = true }: LoadingOverlayProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const plusScale = useSharedValue(1);
  const plusOpacity = useSharedValue(1);
  const overlayOpacity = useSharedValue(visible ? 1 : 0);
  const shownAtRef = useRef<number | null>(visible ? Date.now() : null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldRender) return;

    plusScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      true,
    );
    plusOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
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
      if (!shouldRender) {
        setShouldRender(true);
      }
      shownAtRef.current = Date.now();
      overlayOpacity.value = withTiming(1, { duration: FADE_IN_MS });
      return;
    }

    if (!shouldRender) {
      return;
    }

    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    hideTimerRef.current = setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: FADE_OUT_MS }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
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
    <Modal
      visible={shouldRender}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }, overlayStyle]}>
        <LinearGradient
          colors={['rgba(7,8,16,0.12)', 'rgba(9,10,22,0.36)', 'rgba(10,10,20,0.58)']}
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={['rgba(123,92,255,0.04)', 'rgba(123,92,255,0.09)', 'rgba(0,0,0,0)']}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={{
            minWidth: 214,
            maxWidth: 270,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(15,16,29,0.56)',
            paddingHorizontal: 26,
            paddingVertical: 22,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.24,
            shadowRadius: 28,
            shadowOffset: { width: 0, height: 14 },
            elevation: 14,
          }}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              style={{
                color: colors.text.primary,
                fontFamily: typography.font.bold,
                fontSize: typography.size.lg,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              QuestSave
            </Text>
            <Animated.Text
              style={[
                plusStyle,
                {
                  color: colors.primary.DEFAULT,
                  fontFamily: typography.font.black,
                  fontSize: typography.size.lg,
                  marginLeft: 2,
                },
              ]}
            >
              +
            </Animated.Text>
          </View>

          <Text
            style={{
              color: colors.text.secondary,
              fontFamily: typography.font.medium,
              fontSize: typography.size.sm,
              letterSpacing: typography.letterSpacing.normal,
              textAlign: 'center',
              opacity: 0.96,
            }}
          >
            {message}
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}
