import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthStatusIcon } from '@/components/auth/AuthStatusIcon';
import { BaseButton } from '@/components/base/display/BaseButton';
import { supabase } from '@/lib/supabase';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type CallbackStatus = 'loading' | 'success' | 'error';

export default function AuthCallbackScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>('loading');

  useEffect(() => {
    async function handleCallback() {
      try {
        const url = await Linking.getInitialURL();

        if (!url) {
          setStatus('error');
          return;
        }

        const fragment = url.split('#')[1] ?? '';

        if (!fragment) {
          setStatus('error');
          return;
        }

        const params: Record<string, string> = {};
        for (const pair of fragment.split('&')) {
          const [key, value] = pair.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        }

        const accessToken = params.access_token;
        const refreshToken = params.refresh_token;

        if (!accessToken || !refreshToken) {
          setStatus('error');
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        setStatus(error ? 'error' : 'success');
      } catch {
        setStatus('error');
      }
    }

    handleCallback();
  }, []);

  if (status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: typography.size.md,
            fontFamily: typography.font.regular,
          }}
        >
          {t('auth.callback.loading')}
        </Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.primary,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing.xl,
        }}
      >
        <AuthStatusIcon
          name="exclamation-triangle"
          color={colors.error}
          backgroundColor={`${colors.error}22`}
        />
        <Text
          style={{
            color: colors.error,
            fontSize: typography.size.xl,
            fontFamily: typography.font.bold,
            textAlign: 'center',
            marginBottom: spacing.xl,
          }}
        >
          {t('auth.callback.error')}
        </Text>
        <BaseButton
          label={t('auth.callback.backToLogin')}
          variant="outlined"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
      }}
    >
      <AuthStatusIcon
        name="trophy"
        color={colors.warning}
        backgroundColor={`${colors.warning}22`}
        size={30}
      />

      <Text
        style={{
          color: colors.text.primary,
          fontSize: typography.size['2xl'],
          fontFamily: typography.font.bold,
          textAlign: 'center',
          marginBottom: spacing.sm,
        }}
      >
        {t('auth.callback.success')}
      </Text>

      <Text
        style={{
          color: colors.text.secondary,
          fontSize: typography.size.sm,
          fontFamily: typography.font.regular,
          textAlign: 'center',
          lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
          marginBottom: spacing.xl,
        }}
      >
       {t('auth.callback.successSub')}
      </Text>

      <BaseButton
        label={t('auth.callback.goToDashboard')}
        onPress={() => router.replace('/')}
        fullWidth
      />
    </View>
  );
}
