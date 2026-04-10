import { FontAwesome5 } from '@expo/vector-icons';
import type React from 'react';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';
import { BaseButton } from '../display/BaseButton';

type EmptyStateProps = {
 icon?: React.ComponentProps<typeof FontAwesome5>['name'];
 title: string;
 subtitle?: string;
 action?: {
  label: string;
  onPress: () => void;
 };
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: schermata/sezione vuota con icona, titolo, sottotitolo e azione opzionale.
 *
 * Usato per liste senza elementi (es. nessun gioco nel backlog).
 * Centra il contenuto verticalmente con flex:1.
 */
export function EmptyState({ icon, title, subtitle, action, style }: EmptyStateProps) {
 return (
  <View
   style={[
    {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     paddingHorizontal: spacing.xl,
     gap: spacing.sm,
    },
    style,
   ]}
  >
   {icon ? <FontAwesome5 name={icon} size={52} color={colors.text.disabled} solid /> : null}

   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontWeight: typography.weight.semibold as '600',
     textAlign: 'center',
     marginTop: icon ? spacing.sm : 0,
    }}
   >
    {title}
   </Text>

   {subtitle ? (
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.md,
      textAlign: 'center',
      lineHeight: Math.ceil(typography.size.md * typography.lineHeight.normal),
     }}
    >
     {subtitle}
    </Text>
   ) : null}

   {action ? (
    <View style={{ marginTop: spacing.md }}>
     <BaseButton label={action.label} onPress={action.onPress} variant="outlined" />
    </View>
   ) : null}
  </View>
 );
}
