import { Text, View } from 'react-native';
import { BaseButton } from '@/components/base/display/BaseButton';
import { colors, spacing } from '@/shared/theme/tokens';

type RetryStateProps = {
 message: string;
 actionLabel: string;
 onRetry: () => void;
};

/**
 * Molecule: stato di errore centrato con CTA di retry.
 * Serve per schermate che devono mostrare un messaggio semplice e un'azione immediata.
 */
export function RetryState({ message, actionLabel, onRetry }: RetryStateProps) {
 return (
  <View
   style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
   }}
  >
   <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>{message}</Text>
   <BaseButton label={actionLabel} onPress={onRetry} variant="outlined" />
  </View>
 );
}
