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

function getCallbackParams(url: string): URLSearchParams {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.search);
  const hashParams = new URLSearchParams(parsedUrl.hash.startsWith('#') ? parsedUrl.hash.slice(1) : parsedUrl.hash);

  hashParams.forEach((value, key) => {
    if (!params.has(key)) {
      params.set(key, value);
    }
  });

  return params;
}

export default function AuthCallbackScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>('loading');

  useEffect(() => {
    let isResolved = false;

    async function handleCallbackUrl(url: string | null) {
      if (isResolved) return;

      try {
        if (!url) {
          return;
        }

        const params = getCallbackParams(url);
        const errorCode = params.get('error_code');
        const errorDescription = params.get('error_description');

        if (errorCode || errorDescription) {
          isResolved = true;
          setStatus('error');
          return;
        }

        const authCode = params.get('code');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        let authError: Error | null = null;

        if (authCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(authCode);
          authError = error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          authError = error;
        } else {
          return;
        }

        if (authError) {
          isResolved = true;
          setStatus('error');
          return;
        }

        await supabase.auth.signOut();
        isResolved = true;
        setStatus('success');
      } catch {
        isResolved = true;
        setStatus('error');
      }
    }

    Linking.getInitialURL()
      .then((url) => handleCallbackUrl(url))
      .catch(() => {
        isResolved = true;
        setStatus('error');
      });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void handleCallbackUrl(url);
    });

    const fallbackTimer = setTimeout(() => {
      if (!isResolved) {
        setStatus('error');
      }
    }, 2500);

    return () => {
      isResolved = true;
      clearTimeout(fallbackTimer);
      subscription.remove();
    };
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
        label={t('auth.callback.backToLogin')}
        onPress={() => router.replace('/(auth)/login')}
        fullWidth
      />
    </View>
  );
}
