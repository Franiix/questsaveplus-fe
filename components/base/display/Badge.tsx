import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type BadgeSize = 'sm' | 'md';

type BadgeProps = {
 label: string;
 color?: string;
 backgroundColor?: string;
 size?: BadgeSize;
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
    },
    style,
   ]}
  >
   <Text
    style={{
     color,
     fontSize,
     fontWeight: typography.weight.medium as '500',
    }}
   >
    {label}
   </Text>
  </View>
 );
}
