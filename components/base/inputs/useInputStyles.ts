import { useState } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { borderRadius, colors, opacity, spacing } from '@/shared/theme/tokens';

type InputStyleOptions = {
 isError?: boolean;
 isDisabled?: boolean;
 isFocused?: boolean;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
};

type UseInputStylesReturn = {
 isFocused: boolean;
 inputStyle: TextStyle & ViewStyle;
 handlers: {
  onFocus: () => void;
  onBlur: () => void;
 };
};

export function useInputStyles({
 isError = false,
 isDisabled = false,
 isFocused: externalIsFocused,
 backgroundColor = colors.background.surface,
 borderColor = colors.border.DEFAULT,
 activeBorderColor = colors.border.focus,
 errorColor = colors.error,
}: InputStyleOptions = {}): UseInputStylesReturn {
 const [isFocusedInternal, setIsFocused] = useState(false);

 const isFocused = externalIsFocused ?? isFocusedInternal;

 const resolvedBorderColor = isError ? errorColor : isFocused ? activeBorderColor : borderColor;

 const inputStyle: TextStyle & ViewStyle = {
  backgroundColor,
  borderRadius: borderRadius.md,
  paddingHorizontal: spacing.md,
  paddingVertical: 14, // valore intenzionale tra sm:8 e md:16 per l'altezza degli input
  borderWidth: isFocused || isError ? 2 : 1,
  borderColor: resolvedBorderColor,
  opacity: isDisabled ? opacity.disabled : 1,
 };

 return {
  isFocused,
  inputStyle,
  handlers: {
   onFocus: () => setIsFocused(true),
   onBlur: () => setIsFocused(false),
  },
 };
}
