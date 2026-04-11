import { getErrorMessage } from '@/lib/errors';
import { uploadAvatar } from '@/lib/storage';

type UploadSelectedAvatarParams = {
 userId: string;
 avatarUri: string | null;
 avatarBase64?: string | null;
 fallbackMessage: string;
};

export type UploadSelectedAvatarResult = {
 avatarUrl?: string;
 errorMessage: string | null;
};

export async function uploadSelectedAvatar({
 userId,
 avatarUri,
 avatarBase64,
 fallbackMessage,
}: UploadSelectedAvatarParams): Promise<UploadSelectedAvatarResult> {
 if (!avatarUri) {
  return { errorMessage: null };
 }

 try {
  return {
   avatarUrl: await uploadAvatar(userId, avatarUri, avatarBase64),
   errorMessage: null,
  };
 } catch (error) {
  return {
   errorMessage: getErrorMessage(error, fallbackMessage),
  };
 }
}
