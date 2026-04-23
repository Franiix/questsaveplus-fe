import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/shared/theme/tokens';

type Props = {
 width?: number;
};

export function GradientUnderline({ width = 52 }: Props) {
 return (
  <LinearGradient
   colors={[colors.primary.DEFAULT, 'transparent']}
   start={{ x: 0, y: 0 }}
   end={{ x: 1, y: 0 }}
   style={{ height: 2, width, borderRadius: 1 }}
  />
 );
}
