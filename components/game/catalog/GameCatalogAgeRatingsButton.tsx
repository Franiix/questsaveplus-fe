import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Badge } from '@/components/base/display/Badge';
import { Card } from '@/components/base/display/Card';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogAgeRatingItems } from '@/shared/utils/gameCatalog';

type GameCatalogAgeRatingsButtonProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 title: string;
 openLabel: string;
 closeLabel: string;
};

export function GameCatalogAgeRatingsButton({
 providerId,
 raw,
 title,
 openLabel,
 closeLabel,
}: GameCatalogAgeRatingsButtonProps) {
 const [isOpen, setIsOpen] = useState(false);
 const ageRatingItems = useMemo(() => getGameCatalogAgeRatingItems(raw), [raw]);

 if (providerId !== 'igdb' || ageRatingItems.length === 0) return null;

 return (
  <>
   <Pressable
    onPress={() => setIsOpen(true)}
    style={{
     borderRadius: borderRadius.lg,
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.08)',
     padding: spacing.md,
     backgroundColor: 'rgba(255,255,255,0.03)',
    }}
   >
    <View
     style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
     }}
    >
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.semibold,
       flex: 1,
      }}
     >
      {openLabel}
     </Text>
     <FontAwesome5 name="chevron-right" size={12} color={colors.primary['200']} solid />
    </View>
   </Pressable>

   <Modal
    visible={isOpen}
    animationType="slide"
    transparent
    onRequestClose={() => setIsOpen(false)}
   >
    <View style={{ flex: 1, backgroundColor: 'rgba(7,8,16,0.56)', justifyContent: 'flex-end' }}>
     <View
      style={{
       backgroundColor: 'rgba(14,16,28,0.98)',
       borderTopLeftRadius: borderRadius.xl,
       borderTopRightRadius: borderRadius.xl,
       padding: spacing.lg,
       gap: spacing.md,
       maxHeight: '75%',
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.08)',
      }}
     >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <View style={{ flex: 1, paddingRight: spacing.md }}>
        <SectionTitle title={title} />
       </View>
       <ModalCloseButton label={closeLabel} onPress={() => setIsOpen(false)} />
      </View>

      <ScrollView
       contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xs }}
       showsVerticalScrollIndicator={false}
      >
       {ageRatingItems.map((item) => (
        <Card key={item.key} variant="outlined" style={{ padding: spacing.md, gap: spacing.sm }}>
         <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
         >
          {item.system ? (
           <Badge
            label={item.system}
            color={colors.text.primary}
            backgroundColor={colors.background.elevated}
            style={{ borderWidth: 1, borderColor: colors.border.strong }}
           />
          ) : null}
          {item.rating ? (
           <Badge
            label={item.rating}
            color={colors.text.inverse}
            backgroundColor={colors.primary.DEFAULT}
           />
          ) : null}
         </View>
        </Card>
       ))}
      </ScrollView>
     </View>
    </View>
   </Modal>
  </>
 );
}
