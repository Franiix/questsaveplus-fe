/**
 * Schermata callback OAuth / email confirmation.
 *
 * Supabase reindirizza qui dopo la verifica email con uno dei formati:
 *   questsave://auth/callback?code=<pkce_code>          ← PKCE flow
 *   questsave://auth/callback#access_token=<t>&...      ← implicit flow (legacy)
 *
 * REQUISITI CONFIGURAZIONE (una-tantum, non codice):
 *   1. Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
 *      Aggiungere: questsave://**
 *   2. L'app deve essere una build nativa (expo run:ios / EAS Build).
 *      Expo Go non registra lo scheme personalizzato e non può aprire questsave://.
 */
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthMessageAccent } from '@/components/auth/AuthMessageAccent';
import { AuthStatusIcon } from '@/components/auth/AuthStatusIcon';
import { BaseButton } from '@/components/base/display/BaseButton';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { supabase } from '@/lib/supabase';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type CallbackStatus = 'loading' | 'success' | 'error';

// Expo Router parsa automaticamente sia ?param=... sia #param=... nell'URL del deep link.
type CallbackParams = {
 code?: string;
 access_token?: string;
 refresh_token?: string;
 error_code?: string;
 error_description?: string;
};

export default function AuthCallbackScreen() {
 const { t } = useTranslation();
 const router = useSafeRouter();
 const [status, setStatus] = useState<CallbackStatus>('loading');
 const processed = useRef(false);

 // useLocalSearchParams riceve i params già estratti da Expo Router, senza bisogno
 // di parsare manualmente l'URL con `new URL()` (che può fallire in Hermes su scheme custom).
 const params = useLocalSearchParams<CallbackParams>();

 useEffect(() => {
  const { code, access_token, refresh_token, error_code, error_description } = params;

  // Aspetta che Expo Router abbia popolato i params.
  const hasAnyParam = code ?? access_token ?? refresh_token ?? error_code ?? error_description;
  if (!hasAnyParam) return;

  // Evita doppia elaborazione se il componente ri-renderizza.
  if (processed.current) return;
  processed.current = true;

  async function processCallback() {
   if (error_code || error_description) {
    setStatus('error');
    return;
   }

   try {
    let authError: Error | null = null;

    if (code) {
     // PKCE: scambia il codice con la sessione; il code_verifier è in SecureStore.
     const { error } = await supabase.auth.exchangeCodeForSession(code);
     authError = error;
    } else if (access_token && refresh_token) {
     // Implicit / legacy token flow.
     const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
     });
     authError = error;
    } else {
     // Nessun token riconoscibile.
     setStatus('error');
     return;
    }

    if (authError) {
     setStatus('error');
     return;
    }

    // Firma fuori dopo la verifica: l'utente dovrà fare login esplicitamente.
    await supabase.auth.signOut();
    setStatus('success');
   } catch {
    setStatus('error');
   }
  }

  void processCallback();
 }, [params]);

 // Fallback: se dopo 6 secondi i params non sono ancora arrivati mostra errore.
 useEffect(() => {
  const timer = setTimeout(() => {
   if (!processed.current) {
    setStatus('error');
   }
  }, 6000);
  return () => clearTimeout(timer);
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

   <AuthMessageAccent
    icon="user-astronaut"
    label={t('auth.callback.badge')}
    iconColor={colors.warning}
    iconBackgroundColor={`${colors.warning}22`}
    containerStyle={{ marginBottom: spacing.md }}
   />

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
