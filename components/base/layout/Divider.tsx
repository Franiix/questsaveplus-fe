import { type StyleProp, View, type ViewStyle } from 'react-native';
import { colors } from '@/shared/theme/tokens';

type DividerProps = {
 direction?: 'horizontal' | 'vertical';
 color?: string;
 thickness?: number;
 /** Margine applicato perpendicolarmente alla linea (vertical su horizontal, horizontal su vertical). */
 inset?: number;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: linea separatrice orizzontale o verticale.
 *
 * direction "horizontal" (default): si estende in larghezza.
 * direction "vertical": si estende in altezza (richiede altezza dal parent).
 */
export function Divider({
 direction = 'horizontal',
 color = colors.border.DEFAULT,
 thickness = 1,
 inset,
 style,
}: DividerProps) {
 const isHorizontal = direction === 'horizontal';

 return (
  <View
   style={[
    {
     backgroundColor: color,
     ...(isHorizontal
      ? {
         height: thickness,
         marginHorizontal: inset,
        }
      : {
         width: thickness,
         marginVertical: inset,
        }),
    },
    style,
   ]}
  />
 );
}
