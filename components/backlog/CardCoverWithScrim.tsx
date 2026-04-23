import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { View } from 'react-native';
import { ImageWithFallback } from '@/components/base/display/ImageWithFallback';
import { colors } from '@/shared/theme/tokens';

type Props = {
 uri: string | null | undefined;
};

export const CardCoverWithScrim = memo(function CardCoverWithScrim({ uri }: Props) {
 return (
  <View style={{ width: 60, height: 96 }}>
   <ImageWithFallback uri={uri} width={60} height={96} radius={0} />
   <LinearGradient
    colors={['transparent', `${colors.background.surface}F0`]}
    start={{ x: 0, y: 0.3 }}
    end={{ x: 0, y: 1 }}
    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
   />
  </View>
 );
});
