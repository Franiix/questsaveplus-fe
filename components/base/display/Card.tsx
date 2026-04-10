import type { ReactNode } from 'react';
import { type StyleProp, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { borderRadius, colors } from '@/shared/theme/tokens';

type CardVariant = 'flat' | 'outlined';

type CardProps = {
 children: ReactNode;
 variant?: CardVariant;
 /** Se presente, la card diventa un TouchableOpacity pressabile. */
 onPress?: () => void;
 style?: StyleProp<ViewStyle>;
};

const baseStyle = {
 backgroundColor: colors.background.surface,
 borderRadius: borderRadius.lg,
} as const;

const variantStyles: Record<CardVariant, object> = {
 flat: {},
 outlined: {
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(18,20,36,0.84)',
  shadowColor: colors.background.overlay,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.12,
  shadowRadius: 20,
  elevation: 8,
 },
};

/**
 * Atom: container card con background surface e border radius.
 *
 * Varianti: flat (default, nessun bordo), outlined (bordo sottile).
 * Se onPress è fornito diventa TouchableOpacity, altrimenti View.
 */
export function Card({ children, variant = 'flat', onPress, style }: CardProps) {
 const combinedStyle = [baseStyle, variantStyles[variant], style];

 if (onPress) {
  return (
   <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={combinedStyle}>
    {children}
   </TouchableOpacity>
  );
 }

 return <View style={combinedStyle}>{children}</View>;
}
