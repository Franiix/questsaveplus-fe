import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { Card } from '@/components/base/display/Card';
import { ModalCloseButton } from '@/components/base/feedback/ModalCloseButton';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import type { IgdbRawExtras } from '@/shared/models/IgdbCatalogExtras.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';
import { getGameCatalogInfo } from '@/shared/utils/gameCatalog';

const LANGUAGE_REGION_FALLBACK: Record<string, string> = {
 en: 'GB',
 ar: 'SA',
 ja: 'JP',
 ko: 'KR',
 zh: 'CN',
 it: 'IT',
 fr: 'FR',
 de: 'DE',
 es: 'ES',
 pt: 'PT',
 ru: 'RU',
 pl: 'PL',
 tr: 'TR',
};

function getRegionCode(locale?: string | null) {
 if (!locale) return null;
 const [language, regionCandidate] = locale.split(/[-_]/);
 const region = (
  regionCandidate ?? LANGUAGE_REGION_FALLBACK[language?.toLowerCase() ?? '']
 )?.toUpperCase();
 if (!region || region.length !== 2) return null;
 return region;
}

function getLocalePrefix(locale?: string | null) {
 if (!locale) return null;
 const normalized = locale.replace('_', '-');
 return normalized.split('-')[0]?.toUpperCase() ?? null;
}

type GameCatalogLanguageSupportButtonProps = {
 providerId?: string | null;
 raw?: IgdbRawExtras | null;
 title: string;
 openLabel: string;
 closeLabel: string;
 labels: {
  language: string;
  interface: string;
  audio: string;
  subtitles: string;
 };
 locale?: string;
};

export function GameCatalogLanguageSupportButton({
 providerId,
 raw,
 title,
 openLabel,
 closeLabel,
 labels,
 locale = 'en',
}: GameCatalogLanguageSupportButtonProps) {
 const [visible, setVisible] = useState(false);
 const rows = useMemo(
  () => getGameCatalogInfo(raw, locale.startsWith('it') ? 'it' : 'en').languageSupportRows,
  [locale, raw],
 );

 if (providerId !== 'igdb' || rows.length === 0) return null;

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
     <Text style={{ color: colors.text.primary, fontFamily: typography.font.semibold }}>
      {openLabel}
     </Text>
     <FontAwesome5 name="chevron-right" size={12} color={colors.primary['200']} solid />
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
       maxHeight: '75%',
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

      <View style={{ flexDirection: 'row', paddingBottom: spacing.sm }}>
       <Text style={{ flex: 2, color: colors.text.tertiary }}>{labels.language}</Text>
       <Text style={{ flex: 1, color: colors.text.tertiary, textAlign: 'center' }}>
        {labels.interface}
       </Text>
       <Text style={{ flex: 1, color: colors.text.tertiary, textAlign: 'center' }}>
        {labels.audio}
       </Text>
       <Text style={{ flex: 1, color: colors.text.tertiary, textAlign: 'center' }}>
        {labels.subtitles}
       </Text>
      </View>

      <ScrollView
       style={{ flexGrow: 0 }}
       contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xs }}
       showsVerticalScrollIndicator
      >
       {rows.map((row) => {
        const regionCode = getRegionCode(row.locale);
        const localePrefix = getLocalePrefix(row.locale);
        return (
         <Card
          key={`${row.language}-${row.locale ?? 'base'}`}
          variant="outlined"
          style={{ padding: spacing.md }}
         >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <View style={{ flex: 2, gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
             {regionCode ? (
              <CountryFlag isoCode={regionCode.toLowerCase()} size={14} />
             ) : localePrefix ? (
              <Text
               style={{
                color: colors.text.tertiary,
                fontSize: typography.size.xs,
                fontFamily: typography.font.semibold,
               }}
              >
               {localePrefix}
              </Text>
             ) : null}
             <Text style={{ color: colors.text.primary, flexShrink: 1 }}>{row.language}</Text>
            </View>
           </View>
           <View style={{ flex: 1, alignItems: 'center' }}>
            <FontAwesome5
             name={row.interface ? 'check' : 'minus'}
             size={12}
             color={row.interface ? colors.success : colors.text.disabled}
             solid={row.interface}
            />
           </View>
           <View style={{ flex: 1, alignItems: 'center' }}>
            <FontAwesome5
             name={row.audio ? 'check' : 'minus'}
             size={12}
             color={row.audio ? colors.success : colors.text.disabled}
             solid={row.audio}
            />
           </View>
           <View style={{ flex: 1, alignItems: 'center' }}>
            <FontAwesome5
             name={row.subtitles ? 'check' : 'minus'}
             size={12}
             color={row.subtitles ? colors.success : colors.text.disabled}
             solid={row.subtitles}
            />
           </View>
          </View>
         </Card>
        );
       })}
      </ScrollView>
     </View>
    </View>
   </Modal>
  </>
 );
}
