import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { GameCatalogModalCardList } from '@/components/game/catalog/GameCatalogModalCardList';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogAlternativeNames } from '@/shared/utils/gameCatalog';

type GameCatalogAlternativeNamesButtonProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
};

export function GameCatalogAlternativeNamesButton({
 providerId,
 raw,
}: GameCatalogAlternativeNamesButtonProps) {
 const { t } = useTranslation();
 const [visible, setVisible] = useState(false);
 const items = useMemo(() => getGameCatalogAlternativeNames(raw), [raw]);
 const title = t('gameDetail.openAlsoKnownAs');
 const closeLabel = t('gameDetail.closeInfo');

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
