import type { ReactNode } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { borderRadius, colors, spacing } from '@/shared/theme/tokens';

type GameCatalogModalCardListProps = {
 title: string;
 values: string[];
 closeLabel: string;
 visible: boolean;
 onClose: () => void;
 renderValue?: (value: string) => ReactNode;
};

export function GameCatalogModalCardList({
 title,
 values,
 closeLabel,
 visible,
 onClose,
 renderValue,
}: GameCatalogModalCardListProps) {
 return (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
   <View style={{ flex: 1, backgroundColor: 'rgba(7,8,16,0.56)', justifyContent: 'flex-end' }}>
    <View
     style={{
      backgroundColor: 'rgba(14,16,28,0.98)',
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.lg,
      gap: spacing.md,
      maxHeight: '72%',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
     }}
    >
     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
       <SectionTitle title={title} />
      </View>
      <ModalCloseButton label={closeLabel} onPress={onClose} />
     </View>
     <ScrollView contentContainerStyle={{ gap: spacing.sm }}>
      {values.map((value) => (
       <Card key={`${title}-${value}`} variant="outlined" style={{ padding: spacing.md }}>
        {renderValue ? (
         renderValue(value)
        ) : (
         <Text style={{ color: colors.text.primary }}>{value}</Text>
        )}
       </Card>
      ))}
     </ScrollView>
    </View>
   </View>
  </Modal>
 );
}
