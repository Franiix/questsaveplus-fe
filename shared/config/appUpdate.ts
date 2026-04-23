import Constants from 'expo-constants';
import { Platform } from 'react-native';

type AppUpdateManifest = {
 latestVersion: string;
 iosUrl?: string | null;
 androidUrl?: string | null;
};

function normalizeUrl(value: string | undefined | null) {
 const trimmed = value?.trim();
 return trimmed ? trimmed : null;
}

const expoConfig = Constants.expoConfig;
const iosBundleIdentifier = expoConfig?.ios?.bundleIdentifier ?? null;
const androidPackageName = expoConfig?.android?.package ?? null;

const updateManifestUrl = normalizeUrl(process.env.EXPO_PUBLIC_UPDATE_MANIFEST_URL);
const iosStoreUrl =
 normalizeUrl(process.env.EXPO_PUBLIC_IOS_STORE_URL) ??
 normalizeUrl(process.env.EXPO_PUBLIC_APP_STORE_URL);
const androidStoreUrl =
 normalizeUrl(process.env.EXPO_PUBLIC_ANDROID_STORE_URL) ??
 (androidPackageName
  ? `https://play.google.com/store/apps/details?id=${androidPackageName}`
  : null);

export function getCurrentAppVersion() {
 return expoConfig?.version ?? '0.0.0';
}

export function getUpdateManifestUrl() {
 return updateManifestUrl;
}

export function getStoreUrlForCurrentPlatform() {
 if (Platform.OS === 'ios') return iosStoreUrl;
 if (Platform.OS === 'android') return androidStoreUrl;
 return null;
}

export function resolveStoreUrlFromManifest(manifest: AppUpdateManifest) {
 if (Platform.OS === 'ios') return normalizeUrl(manifest.iosUrl) ?? iosStoreUrl;
 if (Platform.OS === 'android') return normalizeUrl(manifest.androidUrl) ?? androidStoreUrl;
 return null;
}

export type { AppUpdateManifest };

export const APP_UPDATE_CONFIG = {
 updateManifestUrl,
 iosStoreUrl,
 androidStoreUrl,
 iosBundleIdentifier,
 androidPackageName,
} as const;
