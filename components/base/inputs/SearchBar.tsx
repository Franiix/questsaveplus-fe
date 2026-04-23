import { FontAwesome5 } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput } from 'react-native';
import Animated, {
 interpolateColor,
 useAnimatedStyle,
 useSharedValue,
 withTiming,
} from 'react-native-reanimated';
import { shadows } from '@/shared/theme/shadows';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type SearchBarProps = {
 value: string;
 onChangeText: (text: string) => void;
 placeholder?: string;
 onClear?: () => void;
 /** Se true mostra uno spinner al posto dell'icona clear (ricerca in corso). */
 isLoading?: boolean;
 isDisabled?: boolean;
 accessibilityLabel?: string;
};

const ANIM_DURATION = 180;

/**
 * Atom: input stilato per ricerca con icona search + clear/loading.
 *
 * Al focus: border color animato verso primary, leggero scale-up + glow.
 * onClear viene chiamato al tap sulla X — svuotare `value` è responsabilità del parent.
 * L'intera area cliccabile porta il focus sull'input garantendo l'apertura della tastiera.
 */
export function SearchBar({
 value,
 onChangeText,
 placeholder = 'Cerca...',
 onClear,
 isLoading = false,
 isDisabled = false,
 accessibilityLabel,
}: SearchBarProps) {
 const [isFocused, setIsFocused] = useState(false);
 const inputRef = useRef<TextInput>(null);
 const focusAnim = useSharedValue(0);

 const animStyle = useAnimatedStyle(() => ({
  borderColor: interpolateColor(
   focusAnim.value,
   [0, 1],
   [colors.border.strong, colors.primary.DEFAULT],
  ),
  transform: [{ scale: 1 + focusAnim.value * 0.012 }],
  ...(focusAnim.value > 0.5 ? shadows.inputFocus : {}),
 }));

 function handleFocus() {
  setIsFocused(true);
  focusAnim.value = withTiming(1, { duration: ANIM_DURATION });
 }

 function handleBlur() {
  setIsFocused(false);
  focusAnim.value = withTiming(0, { duration: ANIM_DURATION });
 }

 return (
  <Animated.View
   style={[
    {
     backgroundColor: colors.background.elevated,
     borderRadius: borderRadius.lg + 2,
     borderWidth: 1,
     opacity: isDisabled ? 0.5 : 1,
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: spacing.md,
     height: 48,
    },
    animStyle,
   ]}
  >
   <Pressable
    onPress={() => {
     if (!isDisabled) inputRef.current?.focus();
    }}
    accessible={false}
    style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
   >
    <FontAwesome5
     name="search"
     size={16}
     color={isFocused ? colors.primary['300'] : colors.text.tertiary}
     solid
     style={{ marginRight: spacing.sm }}
    />

    <TextInput
     ref={inputRef}
     value={value}
     onChangeText={onChangeText}
     placeholder={placeholder}
     placeholderTextColor={colors.text.tertiary}
     editable={!isDisabled}
     autoCorrect={false}
     autoCapitalize="none"
     returnKeyType="search"
     accessibilityLabel={accessibilityLabel ?? placeholder}
     style={{
      flex: 1,
      color: colors.text.primary,
      fontSize: typography.size.md,
      fontFamily: typography.font.regular,
     }}
     onFocus={handleFocus}
     onBlur={handleBlur}
    />
   </Pressable>

   {isLoading ? (
    <ActivityIndicator
     size="small"
     color={colors.text.secondary}
     style={{ marginLeft: spacing.sm }}
    />
   ) : value.length > 0 ? (
    <Pressable
     onPress={onClear}
     accessibilityRole="button"
     accessibilityLabel="Cancella ricerca"
     hitSlop={8}
     style={{ marginLeft: spacing.sm }}
    >
     <FontAwesome5 name="times-circle" size={16} color={colors.text.secondary} solid />
    </Pressable>
   ) : null}
  </Animated.View>
 );
}
