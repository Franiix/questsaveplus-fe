import { FontAwesome5 } from '@expo/vector-icons';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type ScreenHeaderProps = {
 title: string;
 onBack?: () => void;
 rightAction?: {
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  onPress: () => void;
  accessibilityLabel?: string;
 };
};

const ICON_SLOT_WIDTH = 32;
const HEADER_PILL_HEIGHT = 48;

/**
 * Atom: header custom per schermate che non usano il header di Expo Router.
 *
 * Layout: [back?] [title centrato] [rightAction?]
 * Le due slot laterali hanno larghezza fissa per mantenere il titolo centrato.
 */
export function ScreenHeader({ title, onBack, rightAction }: ScreenHeaderProps) {
 const { t } = useTranslation();
 const insets = useSafeAreaInsets();

 return (
  <View
   style={{
    position: 'absolute',
    top: insets.top + spacing.sm,
    left: spacing.md,
    right: spacing.md,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_PILL_HEIGHT,
    paddingHorizontal: spacing.md,
    borderRadius: 24,
    backgroundColor: 'rgba(11, 12, 22, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: colors.background.overlay,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
   }}
  >
   <View
    pointerEvents="none"
    style={{
     position: 'absolute',
     inset: 0,
     borderRadius: 24,
     backgroundColor: 'rgba(255,255,255,0.035)',
    }}
   />
   <View
    pointerEvents="none"
    style={{
     position: 'absolute',
     left: 0,
     right: 0,
     bottom: 0,
     height: 18,
     borderBottomLeftRadius: 24,
     borderBottomRightRadius: 24,
     backgroundColor: 'rgba(8,8,16,0.18)',
    }}
   />
   {/* Slot sinistra */}
   {onBack ? (
    <Pressable
     onPress={onBack}
     accessibilityRole="button"
     accessibilityLabel={t('common.back')}
     hitSlop={8}
     style={{
      width: ICON_SLOT_WIDTH,
      height: ICON_SLOT_WIDTH,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
     }}
    >
     <FontAwesome5 name="arrow-left" size={16} color={colors.text.primary} solid />
    </Pressable>
   ) : (
    <View style={{ width: ICON_SLOT_WIDTH }} />
   )}

   {/* Titolo centrato */}
   <Text
    style={{
     flex: 1,
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontFamily: typography.font.semibold,
     textAlign: 'center',
     letterSpacing: typography.letterSpacing.tight,
    }}
    numberOfLines={1}
   >
    {title}
   </Text>

   {/* Slot destra */}
   {rightAction ? (
    <Pressable
     onPress={rightAction.onPress}
     accessibilityRole="button"
     accessibilityLabel={rightAction.accessibilityLabel}
     hitSlop={8}
     style={{
      width: ICON_SLOT_WIDTH,
      height: ICON_SLOT_WIDTH,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
     }}
    >
     <FontAwesome5 name={rightAction.icon} size={16} color={colors.text.primary} solid />
    </Pressable>
   ) : (
    <View style={{ width: ICON_SLOT_WIDTH }} />
   )}
  </View>
 );
}
