import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type ErrorBoxProps = {
 message: string;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: box di errore globale con sfondo semi-trasparente.
 *
 * Estratto dal boilerplate inline in login.tsx e register.tsx.
 * Usa colors.error con sfondo a 12% di opacità.
 */
export function ErrorBox({ message, style }: ErrorBoxProps) {
 return (
  <View
   style={[
    {
     // #F44336 a 12% di opacità: 0.12 * 255 ≈ 31 → 0x1F
     backgroundColor: `${colors.error}1F`,
     borderWidth: 1,
     borderColor: colors.error,
     borderRadius: borderRadius.md,
     paddingHorizontal: spacing.md,
     paddingVertical: 12,
    },
    style,
   ]}
  >
   <Text style={{ color: colors.error, fontSize: typography.size.sm }}>{message}</Text>
  </View>
 );
}
