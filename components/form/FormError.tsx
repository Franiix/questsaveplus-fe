import { type StyleProp, Text, type TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type FormErrorProps = {
 message: string;
 color?: string;
 style?: StyleProp<TextStyle>;
};

export function FormError({ message, color = colors.error, style }: FormErrorProps) {
 return (
  <Text
   accessibilityLiveRegion="polite"
   style={[{ color, fontSize: typography.size.caption, marginTop: spacing.xs }, style]}
  >
   {message}
  </Text>
 );
}
