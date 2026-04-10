import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
 id: string;
 message: string;
 variant: ToastVariant;
 duration: number;
};

type ToastState = {
 toasts: Toast[];
 showToast: (message: string, variant: ToastVariant, duration?: number) => void;
 dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
 toasts: [],

 showToast: (message, variant, duration = 3000) => {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  set((state) => ({
   toasts: [...state.toasts, { id, message, variant, duration }],
  }));
 },

 dismissToast: (id) => {
  set((state) => ({
   toasts: state.toasts.filter((t) => t.id !== id),
  }));
 },
}));
