import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/base/display/Card';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { SectionTitle } from '@/components/base/layout/SectionTitle';
import type { LegalDocument } from '@/shared/models/LegalDocument.model';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type LegalDocumentScreenProps = {
 document: LegalDocument;
};

export function LegalDocumentScreen({ document }: LegalDocumentScreenProps) {
 const router = useRouter();

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={document.title} onBack={() => router.back()} />
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
      {document.title}
     </Text>
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.base,
       fontFamily: typography.font.regular,
       lineHeight: 22,
      }}
     >
      {document.subtitle}
     </Text>
     <View
      style={{
       alignSelf: 'flex-start',
       marginTop: spacing.xs,
       paddingHorizontal: spacing.sm + 2,
       paddingVertical: spacing.xs,
       borderRadius: borderRadius.full,
       backgroundColor: colors.background.elevated,
       borderWidth: 1,
       borderColor: colors.border.strong,
      }}
     >
      <Text
       style={{
        color: colors.primary['200'],
        fontSize: typography.size.caption,
        fontFamily: typography.font.medium,
       }}
      >
       {document.lastUpdated}
      </Text>
     </View>
    </View>

    {document.sections.map((section) => (
     <Card
      key={section.title}
      variant="outlined"
      style={{
       padding: spacing.md,
       gap: spacing.sm,
      }}
     >
      <SectionTitle title={section.title} />

      {section.paragraphs?.map((paragraph) => (
       <Text
        key={paragraph}
        style={{
         color: colors.text.secondary,
         fontSize: typography.size.sm,
         fontFamily: typography.font.regular,
         lineHeight: 22,
        }}
       >
        {paragraph}
       </Text>
      ))}

      {section.bullets?.map((bullet) => (
       <View
        key={bullet}
        style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}
       >
        <Text
         style={{
          color: colors.primary.DEFAULT,
          fontSize: typography.size.base,
          lineHeight: 22,
         }}
        >
         {'\u2022'}
        </Text>
        <Text
         style={{
          flex: 1,
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.regular,
          lineHeight: 22,
         }}
        >
         {bullet}
        </Text>
       </View>
      ))}
     </Card>
    ))}

    {document.footerNote ? (
     <Card
      variant="outlined"
      style={{
       padding: spacing.md,
       backgroundColor: colors.background.elevated,
       borderColor: colors.primary.glow,
      }}
     >
      <Text
       style={{
        color: colors.primary['100'],
        fontSize: typography.size.sm,
        fontFamily: typography.font.medium,
        lineHeight: 22,
       }}
      >
       {document.footerNote}
      </Text>
     </Card>
    ) : null}
   </ScrollView>
  </SafeAreaView>
 );
}
