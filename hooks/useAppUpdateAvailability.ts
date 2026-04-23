import * as Linking from 'expo-linking';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
 type AppUpdateManifest,
 getCurrentAppVersion,
 getStoreUrlForCurrentPlatform,
 getUpdateManifestUrl,
 resolveStoreUrlFromManifest,
} from '@/shared/config/appUpdate';
import { compareSemanticVersions } from '@/shared/utils/versioning';

type UpdateState = {
 isChecking: boolean;
 isUpdateAvailable: boolean;
 latestVersion: string | null;
 storeUrl: string | null;
};

function isAppUpdateManifest(value: unknown): value is AppUpdateManifest {
 if (!value || typeof value !== 'object') return false;
 return typeof Reflect.get(value, 'latestVersion') === 'string';
}

export function useAppUpdateAvailability() {
 return useAppUpdateAvailabilityWithOptions();
}

export function useAppUpdateAvailabilityWithOptions(enabled = true) {
 const currentVersion = useMemo(() => getCurrentAppVersion(), []);
 const [state, setState] = useState<UpdateState>({
  isChecking: enabled,
  isUpdateAvailable: false,
  latestVersion: null,
  storeUrl: getStoreUrlForCurrentPlatform(),
 });

 useEffect(() => {
  if (!enabled) {
   setState((current) => ({ ...current, isChecking: false }));
   return;
  }

  const manifestUrl = getUpdateManifestUrl();

  if (!manifestUrl) {
   setState((current) => ({ ...current, isChecking: false }));
   return;
  }

  let isMounted = true;

  async function checkForUpdates() {
   try {
    const response = await fetch(manifestUrl, {
     headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
     },
    });

    if (!response.ok) {
      throw new Error(`Unable to load update manifest: ${response.status}`);
    }

    const json = (await response.json()) as unknown;

    if (!isMounted || !isAppUpdateManifest(json)) {
     return;
    }

    const latestVersion = json.latestVersion.trim();
    const isUpdateAvailable = compareSemanticVersions(currentVersion, latestVersion) < 0;

    setState({
     isChecking: false,
     isUpdateAvailable,
     latestVersion,
     storeUrl: resolveStoreUrlFromManifest(json),
    });
   } catch {
    if (!isMounted) return;
    setState((current) => ({ ...current, isChecking: false }));
   }
  }

  void checkForUpdates();

  return () => {
   isMounted = false;
  };
 }, [currentVersion, enabled]);

 const openStore = useCallback(async () => {
  if (!state.storeUrl) return false;
  await Linking.openURL(state.storeUrl);
  return true;
 }, [state.storeUrl]);

 return {
  currentVersion,
  ...state,
  canOpenStore: Boolean(state.storeUrl),
  openStore,
 } as const;
}
