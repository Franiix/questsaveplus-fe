import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';

type SectionTitleProps = {
 title: string;
 /** Testo secondario a destra (es. conteggio elementi: "24 giochi"). */
 trailing?: string;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: intestazione di sezione con titolo a sinistra e testo opzionale a destra.
 *
 * @example
 * <SectionTitle title="Il mio backlog" trailing="24 giochi" />
 * <SectionTitle title="In corso" />
 */
export function SectionTitle({ title, trailing, style }: SectionTitleProps) {
 return (
  <View
   style={[
    {
     flexDirection: 'row',
     alignItems: 'baseline',
     justifyContent: 'space-between',
    },
    style,
   ]}
  >
   <Text
    style={{
     color: colors.text.primary,
     fontSize: typography.size.lg,
     fontWeight: typography.weight.semibold as '600',
     flex: 1,
    }}
    numberOfLines={1}
   >
    {title}
   </Text>

   {trailing ? (
    <Text
     style={{
      color: colors.text.secondary,
      fontSize: typography.size.sm,
      marginLeft: 8,
     }}
    >
     {trailing}
    </Text>
   ) : null}
  </View>
 );
}
