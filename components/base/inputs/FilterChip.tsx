import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, type ViewStyle, View } from 'react-native';
import {
 borderRadius,
 colors,
 opacity as opacityTokens,
 spacing,
 typography,
} from '@/shared/theme/tokens';

const CHIP_CONTENT_STYLE: ViewStyle = {
 minHeight: 39,
 borderRadius: borderRadius.full,
 paddingHorizontal: spacing.md + 2,
 paddingVertical: spacing.sm + 1,
 alignItems: 'center',
 justifyContent: 'center',
};

const CHIP_CONTENT_STYLE_SELECTED: ViewStyle[] = [CHIP_CONTENT_STYLE, { flexDirection: 'row', gap: 5 }];

const CHIP_CONTENT_STYLE_UNSELECTED: ViewStyle[] = [
 CHIP_CONTENT_STYLE,
 { backgroundColor: colors.background.elevated, flexDirection: 'row', gap: 5 },
];

const CHIP_LABEL_STYLE = {
 color: '#FFFFFF',
 fontSize: typography.size.sm,
 fontFamily: typography.font.semibold,
} as const;

type FilterChipProps = {
 label: string;
 isSelected: boolean;
 onPress: () => void;
 isDisabled?: boolean;
 color?: string;
 icon?: React.ComponentProps<typeof FontAwesome5>['name'];
};

/**
 * Atom: pill pressabile per filtri con stato selected/unselected.
 *
 * Selected: sfondo tinto (15% opacità) + bordo brand.
 * Unselected: sfondo trasparente + bordo default.
 */
export function FilterChip({ label, isSelected, onPress, isDisabled = false, color, icon }: FilterChipProps) {
 const selectedColor = colors.primary.DEFAULT;
 const selectedGlow = colors.primary.glow;
 const iconColor = color ?? '#FFFFFF';
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
     style={CHIP_CONTENT_STYLE_SELECTED}
   >
     {icon ? <FontAwesome5 name={icon} size={11} color={iconColor} solid /> : null}
     <Text style={CHIP_LABEL_STYLE}>{label}</Text>
    </LinearGradient>
   ) : (
    <View style={CHIP_CONTENT_STYLE_UNSELECTED}>
     {icon ? <FontAwesome5 name={icon} size={11} color={iconColor} solid /> : null}
     <Text style={CHIP_LABEL_STYLE}>{label}</Text>
    </View>
   )}
  </Pressable>
 );
}
