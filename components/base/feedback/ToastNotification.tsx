import { FontAwesome5 } from '@expo/vector-icons';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, {
 runOnJS,
 useAnimatedStyle,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import type { Toast, ToastVariant } from '@/stores/toast.store';
import { useToastStore } from '@/stores/toast.store';

// ─── Icon map ─────────────────────────────────────────────────────────────────

type IconName = React.ComponentProps<typeof FontAwesome5>['name'];

const VARIANT_ICON: Record<ToastVariant, IconName> = {
 success: 'check-circle',
 error: 'times-circle',
 info: 'info-circle',
 warning: 'exclamation-triangle',
};

const VARIANT_COLOR: Record<ToastVariant, string> = {
 success: colors.success,
 error: colors.error,
 info: colors.info,
 warning: colors.warning,
};

// ─── Single toast item ────────────────────────────────────────────────────────

type ToastItemProps = {
 toast: Toast;
 onDismiss: (id: string) => void;
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
 const translateY = useSharedValue(-60);
 const opacity = useSharedValue(0);
 const dismissedRef = useRef(false);

 const color = VARIANT_COLOR[toast.variant];
 const icon = VARIANT_ICON[toast.variant];

 const dismiss = useCallback(() => {
  if (dismissedRef.current) return;
  dismissedRef.current = true;
  opacity.value = withTiming(0, { duration: 250 });
  translateY.value = withTiming(-60, { duration: 250 }, (finished) => {
   if (finished) {
    runOnJS(onDismiss)(toast.id);
   }
  });
 }, [opacity, translateY, onDismiss, toast.id]);

 useEffect(() => {
  // Slide in
  translateY.value = withTiming(0, { duration: 300 });
  opacity.value = withTiming(1, { duration: 300 });

  // Auto-dismiss
  const timer = setTimeout(dismiss, toast.duration);
  return () => clearTimeout(timer);
 }, [dismiss, toast.duration, translateY, opacity]);

 const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
  opacity: opacity.value,
 }));

 return (
  <Animated.View style={animatedStyle}>
   <View
    style={{
     backgroundColor: colors.background.elevated,
     borderLeftWidth: 4,
     borderLeftColor: color,
     borderRadius: borderRadius.md,
     paddingHorizontal: spacing.md,
     paddingVertical: 12,
     marginHorizontal: spacing.md,
     marginBottom: spacing.sm,
     flexDirection: 'row',
     alignItems: 'center',
     gap: spacing.sm,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.3,
     shadowRadius: 4,
     elevation: 6,
    }}
   >
    <FontAwesome5 name={icon} size={16} color={color} solid />
    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.regular,
      flex: 1,
     }}
     numberOfLines={2}
    >
     {toast.message}
    </Text>
   </View>
  </Animated.View>
 );
}

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * Container: renderizza tutti i toast attivi dallo store.
 *
 * Va montato una sola volta nel root layout, posizionato
 * in alto sotto la safe area con zIndex elevato.
 */
export function ToastContainer() {
 const { toasts, dismissToast } = useToastStore();
 const insets = useSafeAreaInsets();

 if (toasts.length === 0) return null;

 return (
  <View
   style={{
    position: 'absolute',
    top: insets.top,
    left: 0,
    right: 0,
    zIndex: 9999,
   }}
   pointerEvents="none"
  >
   {toasts.map((toast) => (
    <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
   ))}
  </View>
 );
}
