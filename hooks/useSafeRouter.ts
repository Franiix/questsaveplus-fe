import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

const NAVIGATION_LOCK_MS = 450;

let navigationLocked = false;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

function releaseNavigationLock() {
 if (unlockTimer) {
  clearTimeout(unlockTimer);
  unlockTimer = null;
 }

 navigationLocked = false;
}

function acquireNavigationLock() {
 navigationLocked = true;

 if (unlockTimer) {
  clearTimeout(unlockTimer);
 }

 unlockTimer = setTimeout(() => {
  navigationLocked = false;
  unlockTimer = null;
 }, NAVIGATION_LOCK_MS);
}

export function useSafeRouter() {
 const router = useRouter();
 const pathname = usePathname();

 useEffect(() => {
  releaseNavigationLock();
 }, [pathname]);

 return {
  ...router,
  navigate: (href: Parameters<typeof router.navigate>[0]) => {
   if (navigationLocked) return;
   acquireNavigationLock();
   router.navigate(href);
  },
  push: (href: Parameters<typeof router.push>[0]) => {
   if (navigationLocked) return;
   acquireNavigationLock();
   router.push(href);
  },
  replace: (href: Parameters<typeof router.replace>[0]) => {
   if (navigationLocked) return;
   acquireNavigationLock();
   router.replace(href);
  },
 };
}
