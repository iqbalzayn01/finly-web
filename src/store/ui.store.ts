import { create } from 'zustand'

export interface UiState {
  quickEntryOpen: boolean
  setQuickEntryOpen: (open: boolean) => void
  toggleQuickEntry: () => void
  aiChatOpen: boolean
  setAiChatOpen: (open: boolean) => void
  toggleAiChat: () => void
}

export const useUiStore = create<UiState>((set) => ({
  quickEntryOpen: false,
  setQuickEntryOpen: (open) => set({ quickEntryOpen: open }),
  toggleQuickEntry: () =>
    set((state) => ({ quickEntryOpen: !state.quickEntryOpen })),
  aiChatOpen: false,
  setAiChatOpen: (open) => set({ aiChatOpen: open }),
  toggleAiChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),
}))
