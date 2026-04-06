import { create } from 'zustand';

interface UIState {
  isModalOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  isLoading: boolean;
  openModal: () => void;
  closeModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  toast: null,
  isLoading: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));