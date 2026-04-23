import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Badge } from '@/components/base/display/Badge';
import { Card } from '@/components/base/display/Card';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import type { GameEditorialRow } from '@/shared/utils/gameCatalog';

type GameEditorialFeatureCardProps = {
 title: string;
 subtitle?: string | null;
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 accentColor?: string;
 rows?: Array<GameEditorialRow & { onPress?: (() => void) | null }>;
 bullets?: string[];
 closeLabel?: string;
};

export function GameEditorialFeatureCard({
 title,
 subtitle = null,
 icon,
 accentColor = colors.primary.DEFAULT,
 rows = [],
 bullets = [],
 closeLabel = 'Close',
}: GameEditorialFeatureCardProps) {
 const [expandedRow, setExpandedRow] = useState<
  (GameEditorialRow & { onPress?: (() => void) | null }) | null
 >(null);
 const renderedRows = useMemo(
  () =>
   rows.map((row) => {
    const items = row.items ?? [];
    const visibleItems = items.slice(0, 2);
    const hiddenCount = Math.max(0, items.length - visibleItems.length);
    return {
     ...row,
     visibleItems,
     hiddenCount,
     displayValue: items.length > 0 ? visibleItems.join(' • ') : row.value,
    };
   }),
  [rows],
 );

 if (rows.length === 0 && bullets.length === 0) {
  return null;
 }

 return (
  <>
   <Card
    variant="outlined"
    style={{
     marginTop: spacing.lg,
     padding: spacing.md,
     gap: spacing.md,
     backgroundColor: colors.background.surface,
    }}
   >
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
     <View
      style={{
       width: 40,
       height: 40,
       borderRadius: 20,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: `${accentColor}20`,
       borderWidth: 1,
       borderColor: `${accentColor}4D`,
      }}
     >
      <FontAwesome5 name={icon} size={16} color={accentColor} solid />
     </View>

     <View style={{ flex: 1, gap: spacing.xs }}>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontFamily: typography.font.bold,
       }}
      >
       {title}
      </Text>
      {subtitle ? (
       <Text
        style={{
         color: colors.text.secondary,
         fontSize: typography.size.sm,
         fontFamily: typography.font.medium,
         lineHeight: 18,
        }}
       >
        {subtitle}
       </Text>
      ) : null}
     </View>
    </View>

    {renderedRows.length > 0 ? (
     <View style={{ gap: spacing.sm }}>
      {renderedRows.map((row) => {
       const content = (
        <View
         style={{
          gap: spacing.xs,
          paddingBottom: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.subtle,
         }}
        >
         <Text
          style={{
           color: colors.text.tertiary,
           fontSize: typography.size.xs,
           fontFamily: typography.font.semibold,
           letterSpacing: typography.letterSpacing.wide,
           textTransform: 'uppercase',
          }}
         >
          {row.label}
         </Text>
         <View
          style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs }}
         >
          <Text
           style={{
            color: colors.text.primary,
            fontSize: typography.size.md,
            fontFamily: typography.font.semibold,
           }}
          >
           {row.displayValue}
          </Text>
          {row.hiddenCount > 0 ? (
           <Pressable onPress={() => setExpandedRow(row)}>
            <Text
             style={{
              color: accentColor,
              fontSize: typography.size.sm,
              fontFamily: typography.font.semibold,
             }}
            >
             {`+${row.hiddenCount}`}
            </Text>
           </Pressable>
          ) : null}
          {row.onPress ? <FontAwesome5 name="chevron-right" size={11} color={accentColor} /> : null}
         </View>
        </View>
       );

       if (row.onPress) {
        return (
         <Pressable key={row.key} onPress={row.onPress}>
          {content}
         </Pressable>
        );
       }

       return <View key={row.key}>{content}</View>;
      })}
     </View>
    ) : null}

    {bullets.length > 0 ? (
     <View style={{ gap: spacing.sm }}>
      {bullets.map((bullet) => (
       <View key={bullet} style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View
         style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginTop: 6,
          backgroundColor: accentColor,
         }}
        />
        <Text
         style={{
          flex: 1,
          color: colors.text.primary,
          fontSize: typography.size.md,
          fontFamily: typography.font.medium,
          lineHeight: 21,
         }}
        >
         {bullet}
        </Text>
       </View>
      ))}
     </View>
    ) : null}
   </Card>

   <Modal
    visible={Boolean(expandedRow)}
    animationType="slide"
    transparent
    onRequestClose={() => setExpandedRow(null)}
   >
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
        <SectionTitle title={expandedRow?.label ?? title} />
       </View>
       <ModalCloseButton label={closeLabel} onPress={() => setExpandedRow(null)} />
      </View>

      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xs }}>
       <Card variant="outlined" style={{ padding: spacing.md }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
         {(expandedRow?.items ?? []).map((item) => (
          <Badge
           key={`${expandedRow?.key ?? 'row'}-${item}`}
           label={item}
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
