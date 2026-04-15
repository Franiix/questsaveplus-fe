import { create } from 'zustand';

type LoadingOverlayState = {
 visible: boolean;
 message: string;
 show: (message?: string) => void;
 hide: () => void;
};

export const useLoadingOverlayStore = create<LoadingOverlayState>((set) => ({
 visible: false,
 message: 'Caricamento...',
 show: (message = 'Caricamento...') => set({ visible: true, message }),
 hide: () => set({ visible: false }),
}));
