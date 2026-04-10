import { FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExternalLinkCard } from '@/components/base/display/ExternalLinkCard';
import { Card } from '@/components/base/display/Card';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type CreditLink = {
 key: string;
 title: string;
 subtitle: string;
 accentColor: string;
 mark: ReactNode;
 url: string;
};

function BrandMark({
 label,
 accentColor,
 iconName,
 brand = false,
}: {
 label: string;
 accentColor: string;
 iconName?: React.ComponentProps<typeof FontAwesome5>['name'];
 brand?: boolean;
}) {
 return (
  <View
   style={{
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${accentColor}1F`,
    borderWidth: 1,
    borderColor: `${accentColor}55`,
   }}
  >
   {iconName ? (
    <FontAwesome5 name={iconName} size={18} color={accentColor} brand={brand} solid={!brand} />
   ) : (
    <Text
     style={{
      color: accentColor,
      fontSize: typography.size.xs,
      fontFamily: typography.font.bold,
      letterSpacing: typography.letterSpacing.wide,
      textTransform: 'uppercase',
     }}
    >
     {label}
    </Text>
   )}
  </View>
 );
}

function CreditsSection({
 title,
 subtitle,
 links,
 openLabel,
}: {
 title: string;
 subtitle: string;
 links: CreditLink[];
 openLabel: string;
}) {
 return (
  <Card
   variant="outlined"
   style={{
    padding: spacing.md,
    gap: spacing.sm,
   }}
  >
   <SectionTitle title={title} />
   <Text
    style={{
     color: colors.text.secondary,
     fontSize: typography.size.sm,
     fontFamily: typography.font.regular,
    }}
   >
    {subtitle}
   </Text>

   <View style={{ gap: spacing.sm }}>
    {links.map((link) => (
     <ExternalLinkCard
      key={link.key}
      title={link.title}
      subtitle={link.subtitle}
      mark={link.mark}
      accentColor={link.accentColor}
      primaryAction={{
       label: openLabel,
       onPress: () => void Linking.openURL(link.url),
      }}
     />
    ))}
   </View>
  </Card>
 );
}

export default function CreditsScreen() {
 const { t } = useTranslation();
 const router = useRouter();
 const handleBackPress = () => {
  router.replace('/(tabs)');
 };

 const dataSources: CreditLink[] = [
  {
   key: 'igdb',
   title: 'IGDB',
   subtitle: t('credits.igdbSubtitle'),
   accentColor: '#8B7BFF',
   mark: <BrandMark label="IGDB" accentColor="#8B7BFF" />,
   url: 'https://www.igdb.com',
  },
 ];

 const creatorLinks: CreditLink[] = [
   {
     key: 'github',
     title: 'GitHub',
     subtitle: t('credits.githubSubtitle'),
     accentColor: '#F4F4FF',
     mark: <BrandMark iconName="github" brand accentColor="#F4F4FF" label="GH" />,
     url: 'https://github.com/Franiix',
   },
  {
   key: 'linkedin',
   title: 'LinkedIn',
   subtitle: t('credits.linkedinSubtitle'),
   accentColor: '#0A66C2',
   mark: <BrandMark iconName="linkedin-in" brand accentColor="#0A66C2" label="in" />,
   url: 'https://www.linkedin.com/in/francescoscamardella/',
  },
 ];

 const legalLinks: CreditLink[] = [
  {
   key: 'terms',
   title: t('credits.termsTitle'),
   subtitle: t('credits.termsSubtitle'),
   accentColor: '#7B73FF',
   mark: <BrandMark iconName="file-contract" accentColor="#7B73FF" label="T" />,
   url: 'memorycard://legal/terms',
  },
  {
   key: 'privacy',
   title: t('credits.privacyTitle'),
   subtitle: t('credits.privacySubtitle'),
   accentColor: '#3AA7FF',
   mark: <BrandMark iconName="user-shield" accentColor="#3AA7FF" label="P" />,
   url: 'memorycard://legal/privacy',
  },
  {
   key: 'policy',
   title: t('credits.policyTitle'),
   subtitle: t('credits.policySubtitle'),
   accentColor: '#14C38E',
   mark: <BrandMark iconName="shield-alt" accentColor="#14C38E" label="S" />,
   url: 'memorycard://legal/policy',
  },
 ];

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={t('tabs.credits')} onBack={handleBackPress} />
   <ScrollView
    showsVerticalScrollIndicator={false}
   contentContainerStyle={{
     paddingHorizontal: spacing.md,
     paddingTop: 84,
     paddingBottom: 110,
     gap: spacing.md,
    }}
   >
    <View style={{ gap: spacing.xs }}>
     <Text
      style={{
       color: colors.text.primary,
       fontSize: typography.size['2xl'],
       fontFamily: typography.font.bold,
      }}
      >
      {t('credits.title')}
     </Text>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       fontFamily: typography.font.regular,
      }}
     >
      {t('credits.subtitle')}
     </Text>
    </View>

    <CreditsSection
      title={t('credits.dataSourcesTitle')}
      subtitle={t('credits.dataSourcesSubtitle')}
      links={dataSources}
      openLabel={t('credits.openLink')}
    />

    <CreditsSection
      title={t('credits.creatorTitle')}
      subtitle={t('credits.creatorSubtitle')}
      links={creatorLinks}
      openLabel={t('credits.openLink')}
    />

    <Card
      variant="outlined"
      style={{
        padding: spacing.md,
        gap: spacing.sm,
      }}
    >
      <SectionTitle title={t('credits.legalTitle')} />
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.regular,
        }}
      >
        {t('credits.legalSubtitle')}
      </Text>

      <View style={{ gap: spacing.sm }}>
        {legalLinks.map((link) => (
          <ExternalLinkCard
            key={link.key}
            title={link.title}
            subtitle={link.subtitle}
            mark={link.mark}
            accentColor={link.accentColor}
            primaryAction={{
              label: t('credits.openDocument'),
              iconName: 'folder-open',
              onPress: () =>
                router.push(
                  link.key === 'terms'
                    ? '/legal/terms'
                    : link.key === 'privacy'
                      ? '/legal/privacy'
                      : '/legal/policy',
                ),
            }}
          />
        ))}
      </View>
    </Card>
   </ScrollView>
  </SafeAreaView>
 );
}
