import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
 ActivityIndicator,
 StyleSheet,
 Text,
 TouchableOpacity,
 type TouchableOpacityProps,
 View,
 type ViewStyle,
} from 'react-native';
import Animated, {
 useAnimatedStyle,
 useSharedValue,
 withSequence,
 withTiming,
} from 'react-native-reanimated';
import { useSingleAction } from '@/hooks/useSingleAction';
import { borderRadius, colors, opacity, spacing, typography } from '@/shared/theme/tokens';

type ButtonVariant = 'filled' | 'outlined' | 'ghost';

type BaseButtonProps = {
 label: string;
 variant?: ButtonVariant;
 isLoading?: boolean;
 isDisabled?: boolean;
 fullWidth?: boolean;
 color?: string;
 iconLeft?: React.ComponentProps<typeof FontAwesome5>['name'];
 iconRight?: React.ComponentProps<typeof FontAwesome5>['name'];
} & Omit<TouchableOpacityProps, 'disabled' | 'style'>;

const FILLED_GRADIENT: readonly [string, string, string] = ['#7B73FF', '#6C63FF', '#5A52E0'];

const filledGlowShadow = {
 shadowColor: '#6C63FF',
 shadowOffset: { width: 0, height: 0 },
 shadowRadius: 16,
 shadowOpacity: 0.45,
 elevation: 8,
} as const;

const baseContainerShared = {
 borderRadius: borderRadius.md,
 paddingVertical: spacing.md,
 paddingHorizontal: spacing.lg,
 alignItems: 'center' as const,
 justifyContent: 'center' as const,
 minHeight: 52,
};

const layoutStyles = StyleSheet.create({
 contentContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 20,
  gap: spacing.sm,
 },
 loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
 },
});

const styles = {
 filled: {
  label: {
   color: colors.text.primary,
   fontSize: typography.size.base,
   fontWeight: typography.weight.semibold,
  },
 },
 outlined: {
  container: {
   ...baseContainerShared,
   backgroundColor: 'rgba(255,255,255,0.02)',
   borderWidth: 1,
   borderColor: 'rgba(123,115,255,0.52)',
  },
  label: {
   color: colors.primary.DEFAULT,
   fontSize: typography.size.base,
   fontWeight: typography.weight.semibold,
  },
 },
 ghost: {
  container: {
   backgroundColor: 'rgba(255,255,255,0.02)',
   paddingVertical: spacing.sm + 2,
   paddingHorizontal: spacing.xs,
   alignItems: 'center' as const,
   justifyContent: 'center' as const,
   borderRadius: borderRadius.md,
  },
  label: {
   color: colors.primary.DEFAULT,
   fontSize: typography.size.md,
   fontWeight: typography.weight.medium,
  },
 },
} as const;

// ─── FilledButton — gradient + shine ────────────────────────────────────────

type FilledButtonProps = Omit<TouchableOpacityProps, 'disabled' | 'style'> & {
 gradientColors: readonly [string, string, string];
 isInactive: boolean;
 fullWidth: boolean;
 children: React.ReactNode;
};

function inferButtonIcon(
 label: string,
 variant: ButtonVariant,
 color?: string,
): {
 left?: React.ComponentProps<typeof FontAwesome5>['name'];
 right?: React.ComponentProps<typeof FontAwesome5>['name'];
} {
 const normalized = label.trim().toLowerCase();

 if (
  normalized.includes('esci') ||
  normalized.includes('logout') ||
  normalized.includes('sign out')
 ) {
  return { left: 'sign-out-alt' };
 }

 if (
  normalized.includes('rimuovi') ||
  normalized.includes('remove') ||
  normalized.includes('elimina') ||
  normalized.includes('delete')
 ) {
  return { left: 'trash-alt' };
 }

 if (color === colors.error) {
  return { left: 'exclamation-triangle' };
 }

 if (normalized.includes('chiudi') || normalized.includes('close')) {
  return { left: 'times' };
 }

 if (normalized.includes('annulla') || normalized.includes('cancel')) {
  return { left: 'times' };
 }

 if (normalized.includes('salva') || normalized.includes('save')) {
  return { left: 'save' };
 }

 if (normalized.includes('aggiorna') || normalized.includes('update')) {
  return { left: 'sync-alt' };
 }

 if (normalized.includes('continua') || normalized.includes('continue')) {
  return { right: 'arrow-right' };
 }

 if (
  normalized.includes('accedi') ||
  normalized.includes('login') ||
  normalized.includes('entra') ||
  normalized.includes('sign in')
 ) {
  return { left: 'sign-in-alt' };
 }

 if (
  normalized.includes('registrati') ||
  normalized.includes('crea') ||
  normalized.includes('create')
 ) {
  return { left: 'user-plus' };
 }

 if (normalized.includes('invia') || normalized.includes('send')) {
  return { left: 'paper-plane' };
 }

 if (normalized.includes('riprova') || normalized.includes('retry')) {
  return { left: 'redo-alt' };
 }

 if (
  normalized.includes('azzera') ||
  normalized.includes('reset') ||
  normalized.includes('ripristina') ||
  normalized.includes('clear filters') ||
  normalized.includes('reset filters')
 ) {
  return { left: 'undo-alt' };
 }

 if (normalized.includes('conferma') || normalized.includes('confirm')) {
  return { left: 'check' };
 }

 if (
  normalized.includes('modifica') ||
  normalized.includes('edit') ||
  normalized.includes('cambia')
 ) {
  return { left: 'pen' };
 }

 if (variant === 'filled') {
  return { right: 'arrow-right' };
 }

 return {};
}

function FilledButton({
 gradientColors,
 isInactive,
 fullWidth,
 onPress,
 children,
 ...props
}: FilledButtonProps) {
 const shineX = useSharedValue(-120);
 const shineOpacity = useSharedValue(0);
 const fullWidthStyle: ViewStyle | undefined = fullWidth ? { width: '100%' } : undefined;

 const shineStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: shineX.value }],
  opacity: shineOpacity.value,
 }));

 function handlePressIn() {
  shineOpacity.value = withTiming(1, { duration: 80 });
  shineX.value = withSequence(
   withTiming(-120, { duration: 0 }),
   withTiming(300, { duration: 420 }),
  );
  shineOpacity.value = withSequence(
   withTiming(1, { duration: 80 }),
   withTiming(1, { duration: 300 }),
   withTiming(0, { duration: 80 }),
  );
 }

 return (
  <TouchableOpacity
   {...props}
   onPress={onPress}
   onPressIn={handlePressIn}
   disabled={isInactive}
   activeOpacity={0.85}
   style={[
    filledGlowShadow,
    ...(fullWidthStyle ? [fullWidthStyle] : []),
    ...(isInactive ? [{ opacity: opacity.disabled }] : []),
   ]}
  >
   <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[baseContainerShared, fullWidthStyle, { overflow: 'hidden' }]}
   >
    {children}
    {/* Shine ray */}
    <Animated.View
     pointerEvents="none"
     style={[
      shineStyle,
      {
       position: 'absolute',
       top: 0,
       bottom: 0,
       width: 80,
       backgroundColor: 'transparent',
      },
     ]}
    >
     <View
      style={{
       flex: 1,
       width: 80,
       backgroundColor: 'rgba(255,255,255,0.22)',
       transform: [{ skewX: '-20deg' }],
      }}
     />
    </Animated.View>
   </LinearGradient>
  </TouchableOpacity>
 );
}

// ─── BaseButton ──────────────────────────────────────────────────────────────

/**
 * Atom: bottone stilato con design token QuestSave+.
 *
 * Varianti: filled (default), outlined, ghost.
 * Gestisce stato loading (ActivityIndicator) e disabled (opacità).
 * La variante filled usa un LinearGradient con glow viola.
 */
export function BaseButton({
 label,
 variant = 'filled',
 isLoading = false,
 isDisabled = false,
 fullWidth = false,
 color,
 iconLeft,
 iconRight,
 onPress,
 ...props
}: BaseButtonProps) {
 const { isLocked, run } = useSingleAction(onPress);
 const isInactive = isLoading || isDisabled || isLocked;
 const resolvedColor = color ?? colors.primary.DEFAULT;
 const indicatorColor = variant === 'filled' ? colors.text.primary : resolvedColor;
 const inferred = inferButtonIcon(label, variant, color);
 const resolvedIconLeft = iconLeft ?? inferred.left;
 const resolvedIconRight = iconRight ?? inferred.right;
 const iconColor = variant === 'filled' ? colors.text.primary : resolvedColor;
 const fullWidthStyle: ViewStyle | undefined = fullWidth ? { width: '100%' } : undefined;

 const labelNode = (
  <Text
   style={[
    variant === 'filled' ? styles.filled.label : undefined,
    variant === 'outlined' ? styles.outlined.label : undefined,
    variant === 'ghost' ? styles.ghost.label : undefined,
    variant !== 'filled' && color ? { color: resolvedColor } : undefined,
    isLoading ? { opacity: 0 } : undefined,
   ]}
  >
   {label}
  </Text>
 );

 const content = (
  <View style={layoutStyles.contentContainer}>
   {resolvedIconLeft ? (
    <FontAwesome5
     name={resolvedIconLeft}
     size={14}
     color={iconColor}
     solid
     style={isLoading ? { opacity: 0 } : undefined}
    />
   ) : null}
   {labelNode}
   {resolvedIconRight ? (
    <FontAwesome5
     name={resolvedIconRight}
     size={14}
     color={iconColor}
     solid
     style={isLoading ? { opacity: 0 } : undefined}
    />
   ) : null}
   {isLoading ? (
    <View pointerEvents="none" style={layoutStyles.loadingOverlay}>
     <ActivityIndicator color={indicatorColor} size="small" />
    </View>
   ) : null}
  </View>
 );

 if (variant === 'filled') {
  const gradientColors: readonly [string, string, string] = color
   ? [color, color, color]
   : FILLED_GRADIENT;

  return (
   <FilledButton
    {...props}
    gradientColors={gradientColors}
    isInactive={isInactive}
    fullWidth={fullWidth}
    onPress={run}
   >
    {content}
   </FilledButton>
  );
 }

 const nonFilledContainer: ViewStyle[] =
  variant === 'outlined'
   ? [
      styles.outlined.container,
      ...(fullWidthStyle ? [fullWidthStyle] : []),
      ...(isInactive ? [{ opacity: opacity.disabled }] : []),
      ...(color ? [{ borderColor: `${resolvedColor}88` }] : []),
     ]
   : [
      styles.ghost.container,
      ...(fullWidthStyle ? [fullWidthStyle] : []),
      ...(color ? [{ borderColor: `${resolvedColor}44` }, { borderWidth: 1 }] : []),
      ...(isInactive ? [{ opacity: opacity.disabled }] : []),
     ];

 return (
  <TouchableOpacity
   {...props}
   onPress={run}
   disabled={isInactive}
   activeOpacity={0.75}
   style={nonFilledContainer}
  >
   {content}
  </TouchableOpacity>
 );
}
