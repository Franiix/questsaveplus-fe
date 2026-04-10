import { useEffect } from 'react';
import { AccessibilityInfo, TextInput, type TextInputProps } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';
import { useInputStyles } from './useInputStyles';

type BaseInputProps = {
 isError?: boolean;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 accessibilityLabel?: string;
 errorMessage?: string;
} & Omit<TextInputProps, 'style'>;

export function BaseInput({
 isError = false,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
 placeholderTextColor = colors.text.disabled,
 accessibilityLabel,
 errorMessage,
 onFocus: onFocusProp,
 onBlur: onBlurProp,
 ...inputProps
}: BaseInputProps) {
 const { inputStyle, handlers } = useInputStyles({
  isError,
  isDisabled: inputProps.editable === false,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 useEffect(() => {
  if (!errorMessage) return;
  const announcement = accessibilityLabel ? `${accessibilityLabel}. ${errorMessage}` : errorMessage;
  AccessibilityInfo.announceForAccessibility(announcement);
 }, [errorMessage, accessibilityLabel]);

 return (
  <TextInput
   {...inputProps}
   accessibilityLabel={accessibilityLabel}
   accessibilityState={{
    ...inputProps.accessibilityState,
    disabled: inputProps.editable === false,
   }}
   placeholderTextColor={placeholderTextColor}
   style={[inputStyle, { color: colors.text.primary, fontSize: typography.size.md }]}
   onFocus={(e) => {
    handlers.onFocus();
    onFocusProp?.(e);
   }}
   onBlur={(e) => {
    handlers.onBlur();
    onBlurProp?.(e);
   }}
  />
 );
}
