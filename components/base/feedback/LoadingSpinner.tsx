import { ActivityIndicator, type StyleProp, View, type ViewStyle } from 'react-native';
import { colors } from '@/shared/theme/tokens';

type LoadingSpinnerProps = {
 size?: 'small' | 'large';
 color?: string;
 /** Se true occupa tutto lo spazio disponibile e centra lo spinner. */
 fullScreen?: boolean;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: ActivityIndicator centrato con colori brand.
 *
 * fullScreen=true → flex:1 + center (per screen di loading).
 * fullScreen=false → spinner inline senza wrapper aggiuntivo.
 */
export function LoadingSpinner({
 size = 'large',
 color = colors.primary.DEFAULT,
 fullScreen = false,
 style,
}: LoadingSpinnerProps) {
 if (fullScreen) {
  return (
   <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}>
    <ActivityIndicator size={size} color={color} />
   </View>
  );
 }

 return <ActivityIndicator size={size} color={color} style={style} />;
}
