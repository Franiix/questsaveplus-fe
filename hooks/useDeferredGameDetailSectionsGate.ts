import { useDeferredInteractionGate } from '@/hooks/useDeferredInteractionGate';

export function useDeferredGameDetailSectionsGate(enabled: boolean) {
 return useDeferredInteractionGate({ enabled });
}
