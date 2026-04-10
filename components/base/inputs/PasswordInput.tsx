import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { useInputStyles } from './useInputStyles';

type PasswordInputProps = {
 isError?: boolean;
 backgroundColor?: string;
 borderColor?: string;
 activeBorderColor?: string;
 errorColor?: string;
 accessibilityLabel?: string;
} & Omit<TextInputProps, 'style' | 'secureTextEntry'>;

export function PasswordInput({
 isError = false,
 backgroundColor,
 borderColor,
 activeBorderColor,
 errorColor,
 accessibilityLabel,
 onFocus: onFocusProp,
 onBlur: onBlurProp,
 ...inputProps
}: PasswordInputProps) {
 const [isVisible, setIsVisible] = useState(false);

 const { inputStyle, handlers } = useInputStyles({
  isError,
  isDisabled: inputProps.editable === false,
  backgroundColor,
  borderColor,
  activeBorderColor,
  errorColor,
 });

 return (
  <View
   style={{
    backgroundColor: inputStyle.backgroundColor,
    borderRadius: inputStyle.borderRadius,
    borderWidth: inputStyle.borderWidth,
    borderColor: inputStyle.borderColor,
    opacity: inputStyle.opacity,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
   }}
  >
   <TextInput
    {...inputProps}
    accessibilityLabel={accessibilityLabel}
    secureTextEntry={!isVisible}
    placeholderTextColor={colors.text.disabled}
    style={{
     flex: 1,
     color: colors.text.primary,
     fontSize: typography.size.md,
     paddingVertical: 14,
    }}
    onFocus={(e) => {
     handlers.onFocus();
     onFocusProp?.(e);
    }}
    onBlur={(e) => {
     handlers.onBlur();
     onBlurProp?.(e);
    }}
   />
   <Pressable
    onPress={() => setIsVisible((v) => !v)}
    accessibilityLabel={isVisible ? 'Nascondi password' : 'Mostra password'}
    accessibilityRole="button"
    hitSlop={8}
   >
    <FontAwesome5
     name={isVisible ? 'eye-slash' : 'eye'}
     size={18}
     color={colors.text.secondary}
     solid
    />
   </Pressable>
  </View>
 );
}
