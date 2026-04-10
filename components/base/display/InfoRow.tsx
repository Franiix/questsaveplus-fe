import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type InfoRowProps = {
 /** Nome dell'icona FontAwesome5 */
 icon: React.ComponentProps<typeof FontAwesome5>['name'];
 /** Label descrittiva in piccolo sopra il valore */
 label: string;
 /** Valore principale mostrato */
 value: string;
 /** Se true rimuove il separatore inferiore (ultima riga) */
 isLast?: boolean;
};

/**
 * Atom: riga informativa con icona, label e valore.
 *
 * Usata per mostrare metadati strutturati (profilo, dettaglio, impostazioni).
 * Il separatore inferiore viene rimosso sull'ultima riga tramite `isLast`.
 */
export function InfoRow({ icon, label, value, isLast = false }: InfoRowProps) {
 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: isLast ? 0 : 1,
    borderBottomColor: colors.border.DEFAULT,
   }}
  >
   <View style={{ width: 20, alignItems: 'center' }}>
    <FontAwesome5 name={icon} size={16} color={colors.text.tertiary} solid />
   </View>
   <View style={{ flex: 1 }}>
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.xs,
      marginBottom: 2,
     }}
    >
     {label}
    </Text>
    <Text style={{ color: colors.text.primary, fontSize: typography.size.base }}>{value}</Text>
   </View>
  </View>
 );
}
