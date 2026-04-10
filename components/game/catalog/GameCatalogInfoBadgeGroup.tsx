import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Badge } from '@/components/base/display/Badge';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { Card } from '@/components/base/display/Card';
import type { GameCatalogLabel } from '@/shared/models/GameCatalogLabel.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type GameCatalogInfoBadgeGroupProps = {
 label: string;
 values: Array<string | GameCatalogLabel>;
 closeLabel?: string;
 maxVisible?: number;
};

export function GameCatalogInfoBadgeGroup({
 label,
 values,
 closeLabel,
 maxVisible = 2,
}: GameCatalogInfoBadgeGroupProps) {
 const { t } = useTranslation();
 const [isOpen, setIsOpen] = useState(false);
 const renderedValues = useMemo(
  () =>
   values.map((value) =>
    typeof value === 'string'
     ? value
     : t(value.translationKey, { defaultValue: value.fallback, ...(value.values ?? {}) }),
   ),
  [t, values],
 );
 if (values.length === 0) return null;
 const visibleValues = renderedValues.slice(0, maxVisible);
 const hiddenValues = renderedValues.slice(maxVisible);

 return (
  <>
   <View style={{ gap: spacing.sm }}>
    <Text
     style={{
      color: colors.text.tertiary,
      fontSize: typography.size.xs,
      fontFamily: typography.font.semibold,
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
     }}
    >
     {label}
    </Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
     {visibleValues.map((value) => (
      <Badge
       key={`${label}-${value}`}
       label={value}
       color={colors.text.primary}
       backgroundColor={colors.primary.glowSoft}
       style={{ borderWidth: 1, borderColor: colors.border.glow }}
      />
     ))}
     {hiddenValues.length > 0 ? (
      <Pressable onPress={() => setIsOpen(true)}>
       <Badge
        label={`+${hiddenValues.length}`}
        color={colors.text.primary}
        backgroundColor={colors.background.elevated}
        style={{ borderWidth: 1, borderColor: colors.primary.DEFAULT }}
       />
      </Pressable>
     ) : null}
    </View>
   </View>

   <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => setIsOpen(false)}>
    <View style={{ flex: 1, backgroundColor: 'rgba(4,4,10,0.82)', justifyContent: 'flex-end' }}>
     <View
      style={{
       backgroundColor: colors.background.primary,
       borderTopLeftRadius: borderRadius.xl,
       borderTopRightRadius: borderRadius.xl,
       padding: spacing.lg,
       gap: spacing.md,
       maxHeight: '70%',
      }}
     >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <View style={{ flex: 1, paddingRight: spacing.md }}>
        <SectionTitle title={label} />
       </View>
       <ModalCloseButton label={closeLabel ?? t('gameDetail.closeInfo')} onPress={() => setIsOpen(false)} />
      </View>

      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xs }}>
       <Card variant="outlined" style={{ padding: spacing.md }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
         {renderedValues.map((value) => (
          <Badge
           key={`${label}-expanded-${value}`}
           label={value}
           color={colors.text.primary}
           backgroundColor={colors.primary.glowSoft}
           style={{ borderWidth: 1, borderColor: colors.border.glow }}
          />
         ))}
        </View>
       </Card>
      </ScrollView>
     </View>
    </View>
   </Modal>
  </>
 );
}
