import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { borderRadius, colors, spacing } from '@/shared/theme/tokens';

type HintBoxProps = {
 children: ReactNode;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: box informativo con sfondo surface e bordo sottile.
 *
 * Estratto dal boilerplate inline in check-email.tsx.
 * Usato per suggerimenti, istruzioni, note contestuali.
 */
export function HintBox({ children, style }: HintBoxProps) {
 return (
  <View
   style={[
    {
     backgroundColor: colors.background.surface,
     borderWidth: 1,
     borderColor: colors.border.DEFAULT,
     borderRadius: borderRadius.md,
     paddingHorizontal: spacing.md,
     paddingVertical: spacing.md,
    },
    style,
   ]}
  >
   {children}
  </View>
 );
}
