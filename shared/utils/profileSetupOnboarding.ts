import * as SecureStore from 'expo-secure-store';

const PROFILE_SETUP_ONBOARDING_KEY_PREFIX = 'profile_setup_onboarding_seen:v1:';

function buildProfileSetupOnboardingKey(userId: string) {
 return `${PROFILE_SETUP_ONBOARDING_KEY_PREFIX}${userId}`;
}

export async function markProfileSetupOnboardingPending(userId: string) {
 try {
  await SecureStore.deleteItemAsync(buildProfileSetupOnboardingKey(userId));
 } catch {
  // Don't block the setup flow; at worst the carousel reappears once.
 }
}

export async function getProfileSetupOnboardingPending(userId: string) {
 try {
  const value = await SecureStore.getItemAsync(buildProfileSetupOnboardingKey(userId));
  return value !== '1';
 } catch {
  return true;
 }
}

export async function consumeProfileSetupOnboarding(userId: string) {
 try {
  await SecureStore.setItemAsync(buildProfileSetupOnboardingKey(userId), '1');
 } catch {
  // If SecureStore fails, we simply don't persist the dismiss — no crash.
 }
}
