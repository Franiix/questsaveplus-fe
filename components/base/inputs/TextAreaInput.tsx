import { useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';
import { useInputStyles } from './useInputStyles';

// Stessa costante usata in useInputStyles (paddingVertical intenzionale tra sm:8 e md:16)
const PADDING_VERTICAL = 14;
const LINE_HEIGHT = Math.ceil(typography.size.md * 1.5); // 15 * 1.5 ≈ 23

type TextAreaInputProps = {
 isError?: boolean;
 minRows?: number;
 maxRows?: number;
 autoResize?: boolean;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 accessibilityLabel?: string;
} & Omit<TextInputProps, 'style' | 'multiline' | 'textAlignVertical'>;

export function TextAreaInput({
 isError = false,
 minRows = 3,
 maxRows = 6,
 autoResize = true,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
 accessibilityLabel,
 onFocus: onFocusProp,
 onBlur: onBlurProp,
 ...inputProps
}: TextAreaInputProps) {
 const minHeight = PADDING_VERTICAL * 2 + minRows * LINE_HEIGHT;
 const maxHeight = PADDING_VERTICAL * 2 + maxRows * LINE_HEIGHT;
 const [contentHeight, setContentHeight] = useState(minRows * LINE_HEIGHT);

 const { inputStyle, handlers } = useInputStyles({
  isError,
  isDisabled: inputProps.editable === false,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 const computedHeight = autoResize
  ? Math.min(Math.max(contentHeight + PADDING_VERTICAL * 2, minHeight), maxHeight)
  : minHeight;

 function handleContentSizeChange(nextHeight: number) {
  const normalizedHeight = Math.round(nextHeight);
  setContentHeight((currentHeight) => {
   if (Math.abs(currentHeight - normalizedHeight) < 2) {
    return currentHeight;
   }
   return normalizedHeight;
  });
 }

 return (
  <TextInput
   {...inputProps}
   accessibilityLabel={accessibilityLabel}
   multiline
   textAlignVertical="top"
   scrollEnabled={autoResize ? contentHeight + PADDING_VERTICAL * 2 > maxHeight : true}
   placeholderTextColor={colors.text.disabled}
   style={[
    inputStyle,
    {
     color: colors.text.primary,
     fontSize: typography.size.md,
     lineHeight: LINE_HEIGHT,
     height: computedHeight,
    },
   ]}
   onContentSizeChange={
    autoResize ? (e) => handleContentSizeChange(e.nativeEvent.contentSize.height) : undefined
   }
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
