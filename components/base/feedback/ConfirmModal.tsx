import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { BaseButton } from '../display/BaseButton';

type ConfirmModalProps = {
 visible: boolean;
 title: string;
 message: string;
 onConfirm: () => void;
 onCancel: () => void;
 confirmLabel?: string;
 cancelLabel?: string;
 /** Se true il bottone di conferma usa colors.error invece del brand. */
 isDestructive?: boolean;
};

/**
 * Atom: modal di conferma per azioni importanti o distruttive.
 *
 * Toccare fuori dal box chiama onCancel.
 * isDestructive colora il bottone di conferma in rosso.
 */
export function ConfirmModal({
 visible,
 title,
 message,
 onConfirm,
 onCancel,
 confirmLabel,
 cancelLabel,
 isDestructive = false,
}: ConfirmModalProps) {
 return (
  <Modal
   visible={visible}
   transparent
   animationType="fade"
   onRequestClose={onCancel}
   statusBarTranslucent
  >
   <Pressable
    style={{
     flex: 1,
     backgroundColor: 'rgba(5,6,12,0.62)',
     justifyContent: 'center',
     paddingHorizontal: spacing.lg,
    }}
    onPress={onCancel}
   >
    {/* Pressable interno blocca la propagazione del tap */}
    <Pressable
     style={{
      backgroundColor: 'rgba(16,18,30,0.96)',
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      padding: spacing.lg,
      gap: spacing.md,
      overflow: 'hidden',
      shadowColor: colors.background.overlay,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.24,
      shadowRadius: 28,
      elevation: 16,
     }}
     onPress={() => {}}
    >
     <LinearGradient
      colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
      style={{ position: 'absolute', inset: 0 }}
     />
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.lg,
       fontWeight: typography.weight.semibold as '600',
      }}
     >
      {title}
     </Text>

     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.md,
       lineHeight: Math.ceil(typography.size.md * typography.lineHeight.normal),
      }}
     >
      {message}
     </Text>

     <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
      <BaseButton
       label={confirmLabel}
       onPress={onConfirm}
       fullWidth
       color={isDestructive ? colors.error : undefined}
      />
      <BaseButton label={cancelLabel} onPress={onCancel} variant="outlined" fullWidth />
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}
