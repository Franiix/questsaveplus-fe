import type { ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type BottomSheetProps = {
 isVisible: boolean;
 onClose: () => void;
 children: ReactNode;
 title?: string;
};

/**
 * Atom: panel scorrevole dal basso per azioni contestuali rapide.
 *
 * Altezza dinamica in base al contenuto.
 * Toccare il backdrop chiama onClose.
 * Usare per azioni rapide (cambio status, rating, delete) che non
 * richiedono una screen dedicata.
 */
export function BottomSheet({ isVisible, onClose, children, title }: BottomSheetProps) {
 return (
  <Modal
   visible={isVisible}
   transparent
   animationType="slide"
   onRequestClose={onClose}
   statusBarTranslucent
  >
   <Pressable
    style={{
     flex: 1,
     backgroundColor: 'rgba(0,0,0,0.6)',
     justifyContent: 'flex-end',
    }}
    onPress={onClose}
   >
    {/* Pressable interno blocca la propagazione del tap */}
    <Pressable
     style={{
      backgroundColor: colors.background.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
     }}
     onPress={() => {}}
    >
     {/* Handle bar */}
     <View
      style={{
       width: 40,
       height: 4,
       borderRadius: borderRadius.full,
       backgroundColor: colors.border.DEFAULT,
       alignSelf: 'center',
       marginBottom: spacing.md,
      }}
     />

     {title ? (
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontFamily: typography.font.semibold,
        marginBottom: spacing.md,
       }}
      >
       {title}
      </Text>
     ) : null}

     {children}
    </Pressable>
   </Pressable>
  </Modal>
 );
}
