import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { AuthMessageAccent } from '@/components/auth/AuthMessageAccent';
import { AuthStatusIcon } from '@/components/auth/AuthStatusIcon';
import { BaseButton } from '@/components/base/display/BaseButton';
import { HintBox } from '@/components/base/display/HintBox';
import { ScreenContainer } from '@/components/base/layout/ScreenContainer';
import { colors, spacing, typography } from '@/shared/theme/tokens';

export default function CheckEmailScreen() {
 const { t } = useTranslation();
 const router = useRouter();

 return (
  <ScreenContainer
   scrollable={false}
   keyboardAvoiding={false}
   style={{ justifyContent: 'center', alignItems: 'center' }}
   contentContainerStyle={{ paddingHorizontal: spacing.xl }}
  >
   <View style={{ alignItems: 'center', paddingHorizontal: spacing.xl }}>
    <AuthStatusIcon name="envelope-open" />

    <Text
     style={{
      color: colors.text.primary,
      fontSize: typography.size['2xl'],
      fontFamily: typography.font.bold,
      textAlign: 'center',
      marginBottom: spacing.sm,
     }}
    >
     {t('auth.checkEmail.title')}
    </Text>

    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.md,
      textAlign: 'center',
      marginBottom: spacing.md,
      lineHeight: Math.ceil(typography.size.md * typography.lineHeight.normal),
     }}
    >
     {t('auth.checkEmail.subtitle')}
    </Text>

    <HintBox style={{ marginBottom: spacing['2xl'] }}>
     <AuthMessageAccent icon="trophy" label={t('auth.checkEmail.badge')} containerStyle={{ marginBottom: spacing.md }} />
     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.sm,
       textAlign: 'center',
       lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
      }}
     >
      {t('auth.checkEmail.hint')}
     </Text>
    </HintBox>

    <BaseButton
     label={t('auth.checkEmail.backToLogin')}
     variant="outlined"
     onPress={() => router.replace('/(auth)/login')}
    />
   </View>
  </ScreenContainer>
 );
}
