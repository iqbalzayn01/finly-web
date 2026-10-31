import { create } from 'zustand'

export interface UiState {
  quickEntryOpen: boolean
  setQuickEntryOpen: (open: boolean) => void
  toggleQuickEntry: () => void
}

export const useUiStore = create<UiState>((set) => ({
  quickEntryOpen: false,
  setQuickEntryOpen: (open) => set({ quickEntryOpen: open }),
  toggleQuickEntry: () =>
    set((state) => ({ quickEntryOpen: !state.quickEntryOpen })),
}))
