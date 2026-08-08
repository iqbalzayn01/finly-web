import { create } from 'zustand'

export type StyleMode = 'brutal' | 'professional'

export const useUIStore = create<{
  styleMode: StyleMode;
  setStyleMode: (mode: StyleMode) => void;
}>((set) => ({
  styleMode: (typeof window !== 'undefined' ? window.localStorage.getItem('ui-style') as StyleMode : 'brutal') || 'brutal',
  setStyleMode: (mode) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ui-style', mode);
      document.documentElement.classList.remove('professional');
      if (mode !== 'brutal') {
        document.documentElement.classList.add(mode);
      }
    }
    set({ styleMode: mode });
  },
}))

