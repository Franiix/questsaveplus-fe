import { type StyleProp, Text, type TextStyle } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';

type FormLabelProps = {
 children: string;
 required?: boolean;
 style?: StyleProp<TextStyle>;
};

export function FormLabel({ children, required, style }: FormLabelProps) {
 return (
  <Text
   style={[{ color: colors.text.secondary, fontSize: typography.size.sm, marginBottom: 6 }, style]}
  >
   {children}
   {required ? <Text style={{ color: colors.error }}>{' *'}</Text> : null}
  </Text>
 );
}
