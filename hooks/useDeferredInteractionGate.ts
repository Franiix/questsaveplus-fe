import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

type UseDeferredInteractionGateParams = {
 delayMs?: number;
 enabled?: boolean;
};

const DEFAULT_DELAY_MS = 800;

export function useDeferredInteractionGate({
 delayMs = DEFAULT_DELAY_MS,
 enabled = true,
}: UseDeferredInteractionGateParams = {}) {
 const [isEnabled, setIsEnabled] = useState(false);

 useEffect(() => {
  if (!enabled) {
   setIsEnabled(false);
   return;
  }

  let isMounted = true;
  const interactionTask = InteractionManager.runAfterInteractions(() => {
   if (isMounted) {
    setIsEnabled(true);
   }
  });
  const fallbackTimeout = setTimeout(() => {
   if (isMounted) {
    setIsEnabled(true);
   }
  }, delayMs);

  return () => {
   isMounted = false;
   interactionTask.cancel();
   clearTimeout(fallbackTimeout);
  };
 }, [delayMs, enabled]);

 return isEnabled;
}
