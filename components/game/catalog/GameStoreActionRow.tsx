import { FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, Text, View } from 'react-native';
import { Card } from '@/components/base/display/Card';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogExternalStoreItems } from '@/shared/utils/gameCatalog';

type GameStoreActionRowProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 title: string;
 ctaLabel: string;
};

type StoreIconName =
 | 'steam'
 | 'playstation'
 | 'xbox'
 | 'itch-io'
 | 'apple'
 | 'google-play'
 | 'gamepad'
 | 'shopping-bag';

function getStoreIconName(sourceKey?: string | null, title?: string | null): StoreIconName {
 const value = `${sourceKey ?? ''} ${title ?? ''}`.toLowerCase();
 if (value.includes('steam')) return 'steam';
 if (value.includes('playstation')) return 'playstation';
 if (value.includes('xbox') || value.includes('microsoft')) return 'xbox';
 if (value.includes('itch')) return 'itch-io';
 if (value.includes('app store') || value.includes('apple')) return 'apple';
 if (value.includes('android') || value.includes('google')) return 'google-play';
 if (value.includes('gog')) return 'gamepad';
 if (value.includes('epic')) return 'shopping-bag';
 return 'shopping-bag';
}

export function GameStoreActionRow({ providerId, raw, title, ctaLabel }: GameStoreActionRowProps) {
 const storeItems = getGameCatalogExternalStoreItems(raw).slice(0, 3);

 if (providerId !== 'igdb' || storeItems.length === 0) return null;

 return (
  <View style={{ marginBottom: spacing.lg, gap: spacing.sm }}>
   <Text
    style={{
     color: colors.text.tertiary,
     fontSize: typography.size.xs,
     fontFamily: typography.font.semibold,
     textTransform: 'uppercase',
     letterSpacing: typography.letterSpacing.wide,
    }}
   >
    {title}
   </Text>

   <View style={{ flexDirection: 'row', gap: spacing.sm }}>
    {storeItems.map((item) => {
     const iconName = getStoreIconName(item.sourceKey, item.title);
     const isBrandIcon = [
      'steam',
      'playstation',
      'xbox',
      'itch-io',
      'apple',
      'google-play',
     ].includes(iconName);
     return (
      <Card
       key={item.url}
       variant="outlined"
       style={{ flex: 1, padding: spacing.md, backgroundColor: colors.background.elevated }}
      >
       <Pressable onPress={() => void Linking.openURL(item.url)} style={{ gap: spacing.sm }}>
        <View
         style={{
          width: 36,
          height: 36,
          borderRadius: borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary.glowSoft,
         }}
        >
         <FontAwesome5
          name={iconName}
          size={16}
          color={colors.primary['200']}
          brand={isBrandIcon}
          solid={!isBrandIcon}
         />
        </View>

        <View style={{ gap: 2 }}>
         <Text
          numberOfLines={1}
          style={{
           color: colors.text.primary,
           fontSize: typography.size.sm,
           fontFamily: typography.font.semibold,
          }}
         >
          {item.title}
         </Text>
         <Text
          style={{
           color: colors.primary['200'],
           fontSize: typography.size.xs,
           fontFamily: typography.font.semibold,
          }}
         >
          <FontAwesome5 name="external-link-alt" size={11} color={colors.primary['200']} solid />{' '}
          {ctaLabel}
         </Text>
        </View>
       </Pressable>
      </Card>
     );
    })}
   </View>
  </View>
 );
}
