import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { borderRadius, colors } from '@/shared/theme/tokens';

type ImageWithFallbackProps = {
 uri: string | null | undefined;
 width: number;
 height: number;
 radius?: number;
 style?: StyleProp<ViewStyle>;
};

/**
 * Atom: Image con fallback automatico.
 *
 * Mostra l'immagine se l'URI è valido e il caricamento va a buon fine.
 * In caso di URI nullo/undefined o errore di caricamento mostra un
 * placeholder con sfondo surface e icona controller.
 */
export function ImageWithFallback({
 uri,
 width,
 height,
 radius = borderRadius.md,
 style,
}: ImageWithFallbackProps) {
 const [failed, setFailed] = useState(false);

 const containerStyle = [
  {
   width,
   height,
   borderRadius: radius,
   overflow: 'hidden' as const,
   backgroundColor: colors.background.elevated,
  },
  style,
 ];

 if (!uri || failed) {
  return (
   <View style={[containerStyle, { alignItems: 'center', justifyContent: 'center' }]}>
    <FontAwesome5 name="gamepad" size={width * 0.4} color={colors.text.disabled} solid />
   </View>
  );
 }

 return (
  <Image
   source={{ uri }}
   style={{ width, height, borderRadius: radius }}
   onError={() => setFailed(true)}
   contentFit="cover"
  />
 );
}
