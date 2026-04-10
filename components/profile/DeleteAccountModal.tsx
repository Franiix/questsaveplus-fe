import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@/components/base/display/BaseButton';
import { BaseInput } from '@/components/base/inputs/BaseInput';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

type DeleteAccountModalProps = {
 visible: boolean;
 isLoading?: boolean;
 errorMessage?: string | null;
 onCancel: () => void;
 onConfirm: (confirmation: string) => Promise<void> | void;
};

const REQUIRED_PHRASE = 'GAME OVER';

export function DeleteAccountModal({
 visible,
 isLoading = false,
 errorMessage,
 onCancel,
 onConfirm,
}: DeleteAccountModalProps) {
 const { t } = useTranslation();
 const [confirmation, setConfirmation] = useState('');

 useEffect(() => {
  if (!visible) {
   setConfirmation('');
  }
 }, [visible]);

 const isValid = useMemo(() => confirmation.trim() === REQUIRED_PHRASE, [confirmation]);

 return (
  <Modal
   visible={visible}
   transparent
   animationType="fade"
   onRequestClose={onCancel}
   statusBarTranslucent
  >
   <Pressable
    style={{
     flex: 1,
     backgroundColor: 'rgba(5,6,12,0.72)',
     justifyContent: 'center',
     paddingHorizontal: spacing.lg,
    }}
    onPress={onCancel}
   >
    <Pressable
     style={{
      backgroundColor: 'rgba(16,18,30,0.97)',
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      padding: spacing.lg,
      gap: spacing.md,
      overflow: 'hidden',
      shadowColor: colors.background.overlay,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.24,
      shadowRadius: 28,
      elevation: 16,
     }}
     onPress={() => {}}
    >
     <LinearGradient
      colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)']}
      style={{ position: 'absolute', inset: 0 }}
     />

     <View style={{ gap: spacing.xs }}>
      <Text
       style={{
        color: colors.error,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold as '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
       }}
      >
       {t('profile.deleteAccount.eyebrow')}
      </Text>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold as '600',
       }}
      >
       {t('profile.deleteAccount.title')}
      </Text>
     </View>

     <Text
      style={{
       color: colors.text.secondary,
       fontSize: typography.size.md,
       lineHeight: Math.ceil(typography.size.md * typography.lineHeight.normal),
      }}
     >
      {t('profile.deleteAccount.message')}
     </Text>

     <View
      style={{
       padding: spacing.md,
       borderRadius: borderRadius.lg,
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.06)',
       backgroundColor: 'rgba(255,255,255,0.03)',
       gap: spacing.xs,
      }}
     >
      <Text
       style={{
        color: colors.text.secondary,
        fontSize: typography.size.sm,
       }}
      >
       {t('profile.deleteAccount.typeHint')}
      </Text>
      <Text
       style={{
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold as '700',
        letterSpacing: 1.4,
      }}
      >
       {REQUIRED_PHRASE}
      </Text>
     </View>

     <BaseInput
      value={confirmation}
      onChangeText={setConfirmation}
      autoCapitalize="characters"
      autoCorrect={false}
      placeholder={t('profile.deleteAccount.placeholder')}
      accessibilityLabel={t('profile.deleteAccount.inputLabel')}
      returnKeyType="done"
      backgroundColor="rgba(255,255,255,0.03)"
      borderColor={isValid || confirmation.length === 0 ? undefined : `${colors.error}88`}
      activeBorderColor={colors.primary.DEFAULT}
     />

     <Text
      style={{
       color: colors.text.disabled,
       fontSize: typography.size.sm,
       lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
      }}
     >
      {t('profile.deleteAccount.inputHelp')}
     </Text>

     {errorMessage ? (
      <Text
       style={{
        color: colors.error,
        fontSize: typography.size.sm,
        lineHeight: Math.ceil(typography.size.sm * typography.lineHeight.normal),
       }}
      >
       {errorMessage}
      </Text>
     ) : null}

     <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
      <BaseButton
       label={t('profile.deleteAccount.confirm')}
       onPress={() => onConfirm(confirmation.trim())}
       fullWidth
       color={colors.error}
       isDisabled={!isValid}
       isLoading={isLoading}
      />
      <BaseButton
       label={t('profile.deleteAccount.cancel')}
       onPress={onCancel}
       variant="outlined"
       fullWidth
      />
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}
