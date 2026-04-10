import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

const BASE64_ALPHABET =
 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function base64ToArrayBuffer(base64: string) {
 const sanitized = base64.replace(/\s/g, '');
 const padding = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;
 const outputLength = Math.floor((sanitized.length * 3) / 4) - padding;
 const bytes = new Uint8Array(outputLength);
 let byteIndex = 0;

 for (let index = 0; index < sanitized.length; index += 4) {
  const enc1 = BASE64_ALPHABET.indexOf(sanitized[index] ?? '=');
  const enc2 = BASE64_ALPHABET.indexOf(sanitized[index + 1] ?? '=');
  const enc3 = BASE64_ALPHABET.indexOf(sanitized[index + 2] ?? '=');
  const enc4 = BASE64_ALPHABET.indexOf(sanitized[index + 3] ?? '=');

  const triple = (enc1 << 18) | (enc2 << 12) | ((enc3 & 63) << 6) | (enc4 & 63);

  if (byteIndex < outputLength) bytes[byteIndex++] = (triple >> 16) & 255;
  if (byteIndex < outputLength && enc3 !== 64) bytes[byteIndex++] = (triple >> 8) & 255;
  if (byteIndex < outputLength && enc4 !== 64) bytes[byteIndex++] = triple & 255;
 }

 return bytes.buffer;
}

/**
 * Carica (o sovrascrive) l'avatar di un utente nel bucket 'avatars'.
 *
 * Usa un path fisso `{userId}/avatar.jpg` con upsert — ogni nuovo upload
 * sovrascrive il precedente senza accumulare file orfani.
 * L'URI in input deve essere già compressa (es. da expo-image-manipulator).
 */
export async function uploadAvatar(
 userId: string,
 localUri: string,
 base64Override?: string | null,
): Promise<string> {
 try {
  const version = Date.now();
  const folder = userId;
  const path = `${folder}/avatar-${version}.jpg`;
  const base64 =
   base64Override ??
   (await FileSystem.readAsStringAsync(localUri, {
    encoding: 'base64' as never,
   }));
  const arrayBuffer = base64ToArrayBuffer(base64);

  const { error } = await supabase.storage
   .from('avatars')
   .upload(path, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

  if (error) {
   throw new Error(error.message);
  }

  const { data: existingFiles, error: listError } = await supabase.storage
   .from('avatars')
   .list(folder);

  if (!listError && existingFiles?.length) {
   const filesToRemove = existingFiles
    .filter((file) => file.name !== `avatar-${version}.jpg`)
    .map((file) => `${folder}/${file.name}`);

   if (filesToRemove.length > 0) {
    const { error: removeError } = await supabase.storage.from('avatars').remove(filesToRemove);
    if (removeError) {
     console.error('Avatar cleanup failed', { userId, message: removeError.message });
    }
   }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
 } catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown avatar upload error';
  console.error('Avatar upload failed', { userId, localUri, message });
  throw new Error(message);
 }
}
