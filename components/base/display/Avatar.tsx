import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { colors, typography } from '@/shared/theme/tokens';

type AvatarProps = {
 uri?: string;
 name?: string;
 size?: number;
};

/**
 * Atom: immagine profilo circolare con fallback alle iniziali.
 *
 * Se uri è presente usa expo-image (lazy load + cache).
 * Altrimenti mostra la prima lettera del nome su sfondo primary.
 */
export function Avatar({ uri, name, size = 40 }: AvatarProps) {
 const radius = size / 2;
 const initial = name?.trim().charAt(0).toUpperCase() ?? '?';

 if (uri) {
  return (
   <Image
    source={{ uri }}
    style={{ width: size, height: size, borderRadius: radius }}
    contentFit="cover"
   />
  );
 }

 return (
  <View
   style={{
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <Text
    style={{
     color: colors.text.primary,
     fontSize: size * 0.4,
     fontFamily: typography.font.semibold,
     lineHeight: size * 0.5,
    }}
   >
    {initial}
   </Text>
  </View>
 );
}
