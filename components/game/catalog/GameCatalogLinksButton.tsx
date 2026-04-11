import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import type { GameCatalogLinkItem, LinkCategory } from '@/shared/models/GameCatalogLinkItem.model';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import {
 getGameCatalogExternalStoreItems,
 getGameCatalogWebsiteItems,
} from '@/shared/utils/gameCatalog';

type GameCatalogLinksButtonProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 title: string;
 openLabel: string;
 hintLabel?: string | null;
 closeLabel: string;
 groupLabels: {
  official: string;
  store: string;
  community: string;
  video: string;
  social: string;
 };
};

const CATEGORY_ORDER: LinkCategory[] = ['official', 'store', 'community', 'video', 'social'];

export function GameCatalogLinksButton({
 providerId,
 raw,
 title,
 openLabel,
 hintLabel,
 closeLabel,
 groupLabels,
}: GameCatalogLinksButtonProps) {
 const [visible, setVisible] = useState(false);

 const grouped = useMemo(() => {
  const deduped = new Map<string, GameCatalogLinkItem>();
  for (const item of [
   ...getGameCatalogExternalStoreItems(raw),
   ...getGameCatalogWebsiteItems(raw),
  ]) {
   if (!deduped.has(item.url)) {
    deduped.set(item.url, item);
   }
  }
  const all = Array.from(deduped.values());
  const groups = new Map<LinkCategory, GameCatalogLinkItem[]>();
  const uncategorized: GameCatalogLinkItem[] = [];
  for (const item of all) {
   if (item.category) {
    const existing = groups.get(item.category) ?? [];
    existing.push(item);
    groups.set(item.category, existing);
   } else {
    uncategorized.push(item);
   }
  }
  if (uncategorized.length > 0) {
   const existing = groups.get('official') ?? [];
   groups.set('official', [...existing, ...uncategorized]);
  }
  return { groups, total: all.length };
 }, [raw]);

 if (providerId !== 'igdb' || grouped.total === 0) return null;

 return (
  <>
   <Pressable
    onPress={() => setVisible(true)}
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
     <View style={{ flex: 1 }}>
      <Text style={{ color: colors.text.primary, fontFamily: typography.font.semibold }}>
       {openLabel}
      </Text>
      {hintLabel ? (
       <Text
        style={{
         marginTop: spacing.xs,
         color: colors.text.secondary,
         fontSize: typography.size.xs,
         fontFamily: typography.font.medium,
        }}
       >
        {hintLabel}
       </Text>
      ) : null}
     </View>
     <Text
      style={{
       color: colors.primary['200'],
       fontSize: typography.size.base,
       fontFamily: typography.font.bold,
      }}
     >
      {'>'}
     </Text>
    </View>
   </Pressable>

   <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={() => setVisible(false)}
   >
    <View style={{ flex: 1, backgroundColor: 'rgba(7,8,16,0.56)', justifyContent: 'flex-end' }}>
     <View
      style={{
       backgroundColor: 'rgba(14,16,28,0.98)',
       borderTopLeftRadius: borderRadius.xl,
       borderTopRightRadius: borderRadius.xl,
       padding: spacing.lg,
       gap: spacing.md,
       maxHeight: '78%',
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.08)',
      }}
     >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <View style={{ flex: 1, paddingRight: spacing.md }}>
        <SectionTitle title={title} />
       </View>
       <ModalCloseButton label={closeLabel} onPress={() => setVisible(false)} />
      </View>

      <ScrollView
       contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xs }}
       showsVerticalScrollIndicator={false}
      >
       {CATEGORY_ORDER.map((cat) => {
        const items = grouped.groups.get(cat);
        if (!items || items.length === 0) return null;
        return (
         <View key={cat} style={{ gap: spacing.sm }}>
          <Text
           style={{
            color: colors.text.tertiary,
            fontSize: typography.size.xs,
            fontFamily: typography.font.semibold,
            textTransform: 'uppercase',
            letterSpacing: typography.letterSpacing.wide,
           }}
          >
           {groupLabels[cat]}
          </Text>
          {items.map((item) => (
           <Card
            key={item.url}
            variant="outlined"
            style={{ padding: spacing.md, backgroundColor: colors.background.elevated }}
           >
            <Pressable onPress={() => void Linking.openURL(item.url)}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
               <Text
                style={{
                 color: colors.text.primary,
                 fontSize: typography.size.sm,
                 fontFamily: typography.font.semibold,
                 marginBottom: 2,
                }}
               >
                {item.title}
               </Text>
               <Text
                numberOfLines={1}
                style={{
                 color: colors.text.secondary,
                 fontSize: typography.size.caption,
                 fontFamily: typography.font.regular,
                }}
               >
                {item.subtitle}
               </Text>
              </View>
              <Text style={{ color: colors.primary['200'], fontSize: typography.size.base }}>
               {'>'}
              </Text>
             </View>
            </Pressable>
           </Card>
          ))}
         </View>
        );
       })}
      </ScrollView>
     </View>
    </View>
   </Modal>
  </>
 );
}
