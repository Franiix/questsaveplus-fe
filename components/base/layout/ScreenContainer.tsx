import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { colors } from '@/shared/theme/tokens';

type ScreenContainerProps = {
  children: ReactNode;
  /** Se true (default) avvolge il contenuto in ScrollView con keyboardShouldPersistTaps. */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Atom: wrapper standard per ogni screen.
 *
 * Combina SafeAreaView + KeyboardAvoidingView + ScrollView (opzionale).
 * Elimina il boilerplate duplicato in ogni schermata.
 * Include AppBackground per il look & feel globale dell'app.
 */
export function ScreenContainer({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background.primary }, style]}>
      <AppBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
