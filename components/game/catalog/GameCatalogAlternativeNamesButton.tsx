import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GameCatalogModalCardList } from '@/components/game/catalog/GameCatalogModalCardList';
import { getGameCatalogAlternativeNames } from '@/shared/utils/gameCatalog';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type GameCatalogAlternativeNamesButtonProps = {
 providerId?: string | null;
 raw?: unknown | null;
 title: string;
 closeLabel: string;
};

export function GameCatalogAlternativeNamesButton({
 providerId,
 raw,
 title,
 closeLabel,
}: GameCatalogAlternativeNamesButtonProps) {
 const [visible, setVisible] = useState(false);
 const items = useMemo(() => getGameCatalogAlternativeNames(raw), [raw]);

 if (providerId !== 'igdb' || items.length === 0) return null;

 return (
  <>
   <Pressable
    onPress={() => setVisible(true)}
    style={{
     marginBottom: spacing.sm,
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
      {title}
     </Text>
     <FontAwesome5 name="chevron-right" size={12} color={colors.primary['200']} solid />
    </View>
   </Pressable>
   <GameCatalogModalCardList
    title={title}
    values={items}
    closeLabel={closeLabel}
    visible={visible}
    onClose={() => setVisible(false)}
   />
  </>
 );
}
