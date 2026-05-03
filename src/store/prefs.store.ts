import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'lote' | 'parcela'

interface PrefsState {
  liqViewMode: ViewMode
  repViewMode: ViewMode
  setLiqViewMode: (m: ViewMode) => void
  setRepViewMode: (m: ViewMode) => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      liqViewMode: 'lote',
      repViewMode: 'lote',
      setLiqViewMode: (m) => set({ liqViewMode: m }),
      setRepViewMode: (m) => set({ repViewMode: m }),
    }),
    { name: 'sub_prefs' }
  )
)
