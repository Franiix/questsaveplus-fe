import { FontAwesome5 } from '@expo/vector-icons';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type BadgeSize = 'sm' | 'md';

type BadgeProps = {
 label: string;
 color?: string;
 backgroundColor?: string;
 size?: BadgeSize;
 icon?: React.ComponentProps<typeof FontAwesome5>['name'];
 style?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<
 BadgeSize,
 { paddingHorizontal: number; paddingVertical: number; fontSize: number }
> = {
 sm: {
  paddingHorizontal: spacing.sm,
  paddingVertical: 2,
  fontSize: typography.size.xs,
 },
 md: {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  fontSize: typography.size.sm,
 },
};

/**
 * Atom: pill di testo colorato.
 *
 * Building block generico per tag, stati e categorie.
 * Usato da StatusBadge per i 4 stati backlog.
 */
export function Badge({
 label,
 color = colors.text.primary,
 backgroundColor = colors.primary.DEFAULT,
 size = 'sm',
 icon,
 style,
}: BadgeProps) {
 const { paddingHorizontal, paddingVertical, fontSize } = sizeStyles[size];

 return (
  <View
   style={[
    {
     backgroundColor,
     borderRadius: borderRadius.full,
     paddingHorizontal,
     paddingVertical,
     alignSelf: 'flex-start',
     flexDirection: 'row',
     alignItems: 'center',
     gap: 4,
    },
    style,
   ]}
  >
   {icon ? <FontAwesome5 name={icon} size={fontSize - 1} color={color} solid /> : null}
   <Text
    style={{
     color,
     fontSize,
     fontFamily: typography.font.medium,
    }}
   >
    {label}
   </Text>
  </View>
 );
}
