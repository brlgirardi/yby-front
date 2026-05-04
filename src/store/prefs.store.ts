import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'lote' | 'parcela'

/**
 * Preferências do usuário persistidas (localStorage 'sub_prefs').
 * Respeita o viés de Status quo (Enviesados, cap. 5): power user que
 * configurou um filtro espera encontrá-lo na próxima sessão.
 */
interface PrefsState {
  // Toggles "Por lote / Por parcela" do Financeiro
  liqViewMode: ViewMode
  repViewMode: ViewMode
  setLiqViewMode: (m: ViewMode) => void
  setRepViewMode: (m: ViewMode) => void

  // Filtros da Conciliação
  reconStatusFilter: string  // 'Todos' | 'reconciled' | 'partially_reconciled' | 'mismatch' | 'not_reconciled'
  reconBrandFilter: string   // 'Todas' | 'visa' | 'mastercard' | ...
  setReconStatusFilter: (s: string) => void
  setReconBrandFilter: (b: string) => void

  // Último e-mail usado no login (privacidade: só email, nunca senha)
  lastLoginEmail: string
  setLastLoginEmail: (e: string) => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      liqViewMode: 'lote',
      repViewMode: 'lote',
      setLiqViewMode: (m) => set({ liqViewMode: m }),
      setRepViewMode: (m) => set({ repViewMode: m }),

      reconStatusFilter: 'Todos',
      reconBrandFilter: 'Todas',
      setReconStatusFilter: (s) => set({ reconStatusFilter: s }),
      setReconBrandFilter: (b) => set({ reconBrandFilter: b }),

      lastLoginEmail: '',
      setLastLoginEmail: (e) => set({ lastLoginEmail: e }),
    }),
    { name: 'sub_prefs' }
  )
)
