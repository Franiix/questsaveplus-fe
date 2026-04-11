import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/shared/theme/tokens';

const AVATAR_MAX_DIMENSION = 512;
const AVATAR_COMPRESS_QUALITY = 0.78;
const AVATAR_SIZE = 96;

export type PickedAvatar = {
 uri: string;
 base64: string | null;
};

type AvatarPickerProps = {
 uri: string | null;
 onPick: (avatar: PickedAvatar) => void;
 label?: string;
 buttonLabel?: string;
 isDisabled?: boolean;
};

export function AvatarPicker({ uri, onPick, label, buttonLabel, isDisabled }: AvatarPickerProps) {
 async function handlePress() {
  if (isDisabled) return;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return;

  const result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ['images'],
   allowsEditing: true,
   aspect: [1, 1],
   quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
   const manipulated = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: AVATAR_MAX_DIMENSION, height: AVATAR_MAX_DIMENSION } }],
    {
     compress: AVATAR_COMPRESS_QUALITY,
     format: ImageManipulator.SaveFormat.JPEG,
     base64: true,
    },
   );

   onPick({
    uri: manipulated.uri,
    base64: manipulated.base64 ?? null,
   });
  }
 }

 return (
  <View style={{ alignItems: 'center', gap: spacing.sm }}>
   {label ? (
    <Text style={{ color: colors.text.secondary, fontSize: typography.size.sm }}>{label}</Text>
   ) : null}

   <Pressable
    onPress={handlePress}
    disabled={isDisabled}
    style={({ pressed }) => ({
     width: AVATAR_SIZE,
     height: AVATAR_SIZE,
     borderRadius: borderRadius.full,
     backgroundColor: colors.background.elevated,
     borderWidth: 2,
     borderColor: uri ? colors.primary.DEFAULT : colors.border.DEFAULT,
     alignItems: 'center',
     justifyContent: 'center',
     overflow: 'hidden',
     opacity: pressed || isDisabled ? 0.7 : 1,
    })}
   >
    {uri ? (
     <Image
      source={{ uri }}
      style={{
       width: AVATAR_SIZE,
       height: AVATAR_SIZE,
       borderRadius: borderRadius.full,
      }}
      contentFit="cover"
     />
    ) : (
     <FontAwesome5 name="user" size={36} color={colors.text.disabled} />
    )}
   </Pressable>

   {buttonLabel ? (
    <Text
     style={{
      color: colors.primary.DEFAULT,
      fontSize: typography.size.sm,
      fontFamily: typography.font.medium,
     }}
    >
     {buttonLabel}
    </Text>
   ) : null}
  </View>
 );
}
