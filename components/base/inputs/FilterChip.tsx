import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import {
 borderRadius,
 colors,
 opacity as opacityTokens,
 spacing,
 typography,
} from '@/shared/theme/tokens';

type FilterChipProps = {
 label: string;
 isSelected: boolean;
 onPress: () => void;
 isDisabled?: boolean;
 /** Colore brand del chip quando selezionato. Default: colors.primary.DEFAULT */
 color?: string;
};

/**
 * Atom: pill pressabile per filtri con stato selected/unselected.
 *
 * Selected: sfondo tinto (15% opacità) + bordo brand.
 * Unselected: sfondo trasparente + bordo default.
 */
export function FilterChip({
 label,
 isSelected,
 onPress,
 isDisabled = false,
}: FilterChipProps) {
 const selectedColor = colors.primary.DEFAULT;
 const selectedGlow = colors.primary.glow;
 const containerStyle = ({ pressed }: { pressed: boolean }) => ({
  minHeight: 42,
  borderRadius: borderRadius.full,
  borderWidth: 1.5,
  borderColor: isSelected ? colors.primary['300'] : selectedColor,
  padding: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  opacity: isDisabled ? opacityTokens.disabled : 1,
  shadowColor: isSelected ? selectedGlow : selectedColor,
  shadowOffset: { width: 0, height: isSelected ? 0 : 2 },
  shadowOpacity: isSelected ? 0.45 : 0.2,
  shadowRadius: isSelected ? 16 : 8,
  elevation: isSelected ? 8 : 3,
  transform: [{ scale: pressed ? 0.98 : 1 }],
 });

 const contentStyle = {
  minHeight: 39,
  borderRadius: borderRadius.full,
  paddingHorizontal: spacing.md + 2,
  paddingVertical: spacing.sm + 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
 };

 return (
  <Pressable
   onPress={() => {
    if (!isDisabled) onPress();
   }}
   accessibilityRole="button"
   accessibilityLabel={label}
   accessibilityState={{ selected: isSelected, disabled: isDisabled }}
   style={containerStyle}
  >
   {isSelected ? (
    <LinearGradient
     colors={['#7B73FF', '#6C63FF', '#5A52E0']}
     start={{ x: 0, y: 0 }}
     end={{ x: 1, y: 0 }}
     style={contentStyle}
    >
     <Text
      style={{
       color: '#FFFFFF',
       fontSize: typography.size.sm,
       fontWeight: typography.weight.semibold as '600',
      }}
     >
      {label}
     </Text>
    </LinearGradient>
   ) : (
    <View
     style={[
      contentStyle,
      {
       backgroundColor: colors.background.elevated,
      },
     ]}
    >
     <Text
      style={{
       color: '#FFFFFF',
       fontSize: typography.size.sm,
       fontWeight: typography.weight.semibold as '600',
      }}
     >
      {label}
     </Text>
    </View>
   )}
  </Pressable>
 );
}
