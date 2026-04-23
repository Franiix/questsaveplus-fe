import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_ACTION_LOCK_MS = 900;

type UseSingleActionOptions = {
 cooldownMs?: number;
};

export function useSingleAction<TArgs extends unknown[]>(
 action?: ((...args: TArgs) => void) | null,
 { cooldownMs = DEFAULT_ACTION_LOCK_MS }: UseSingleActionOptions = {},
) {
 const [isLocked, setIsLocked] = useState(false);
 const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 useEffect(() => {
  return () => {
   if (unlockTimerRef.current) {
    clearTimeout(unlockTimerRef.current);
   }
  };
 }, []);

 const run = useCallback(
  (...args: TArgs) => {
   if (isLocked || !action) return;

   setIsLocked(true);
   action(...args);

   if (unlockTimerRef.current) {
    clearTimeout(unlockTimerRef.current);
   }

   unlockTimerRef.current = setTimeout(() => {
    setIsLocked(false);
    unlockTimerRef.current = null;
   }, cooldownMs);
  },
  [action, cooldownMs, isLocked],
 );

 return {
  isLocked,
  run,
 } as const;
}
