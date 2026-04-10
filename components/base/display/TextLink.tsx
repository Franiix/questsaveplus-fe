import { Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme/tokens';

type TextLinkProps = {
 /** Testo normale a sinistra del link. */
 text: string;
 /** Testo cliccabile a destra. */
 linkText: string;
 onPress: () => void;
};

/**
 * Atom: pattern "testo normale + link cliccabile" inline.
 *
 * Estratto dal boilerplate duplicato in login.tsx e register.tsx.
 * Es: "Non sei registrato? Registrati ora!"
 */
export function TextLink({ text, linkText, onPress }: TextLinkProps) {
 return (
  <View
   style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
   }}
  >
   <Text style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>{text}</Text>
   <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
    <Text
     style={{
      color: colors.primary.DEFAULT,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold as '600',
     }}
    >
     {linkText}
    </Text>
   </TouchableOpacity>
  </View>
 );
}
