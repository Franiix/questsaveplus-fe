import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/base/display/Card';
import { AppBackground } from '@/components/base/layout/AppBackground';
import { ScreenHeader } from '@/components/base/layout/ScreenHeader';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type LegalExternalDocumentScreenProps = {
 title: string;
 subtitle: string;
 url: string;
 onOpen: () => void;
};

export function LegalExternalDocumentScreen({
 title,
 subtitle,
 url,
 onOpen,
}: LegalExternalDocumentScreenProps) {
 const router = useRouter();

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
   <AppBackground />
   <ScreenHeader title={title} onBack={() => router.back()} />

   <View
    style={{
     flex: 1,
     paddingHorizontal: spacing.md,
     paddingTop: 96,
     paddingBottom: spacing.xl,
     justifyContent: 'center',
    }}
   >
    <Card
     variant="outlined"
     style={{
      padding: spacing.lg,
      gap: spacing.md,
      backgroundColor: colors.background.surface,
     }}
    >
     <View style={{ gap: spacing.xs }}>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.xl,
        fontFamily: typography.font.bold,
       }}
      >
       {title}
      </Text>
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.regular,
        lineHeight: 22,
       }}
      >
       {subtitle}
      </Text>
     </View>

     <View
      style={{
       padding: spacing.md,
       borderRadius: borderRadius.lg,
       borderWidth: 1,
       borderColor: colors.border.strong,
       backgroundColor: colors.background.elevated,
       gap: spacing.sm,
      }}
     >
      <Text
       style={{
        color: colors.primary['100'],
        fontSize: typography.size.caption,
        fontFamily: typography.font.semibold,
       }}
      >
       Documento esterno
      </Text>
      <Text
       selectable
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
        fontFamily: typography.font.regular,
        lineHeight: 22,
       }}
      >
       {url}
      </Text>
     </View>

     <Pressable
      onPress={onOpen}
      style={({ pressed }) => ({
       minHeight: 48,
       borderRadius: borderRadius.md,
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: colors.primary.DEFAULT,
       opacity: pressed ? 0.86 : 1,
      })}
     >
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.base,
        fontFamily: typography.font.semibold,
       }}
      >
       Apri nel browser
      </Text>
     </Pressable>
    </Card>
   </View>
  </SafeAreaView>
 );
}
