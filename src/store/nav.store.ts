import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Screen =
  | 'dashboard'
  | 'merchants'
  | 'charges'
  | 'agenda'
  | 'financial'
  | 'pricing'
  | 'reconciliation'
  | 'users'
  | 'settings'

export type AgendaTab = 'calendario' | 'detalhada' | 'lote'
export type FinancialTab = 'extrato' | 'liquidacoes' | 'antecipacoes' | 'dre'

interface NavState {
  screen: Screen
  activeNav: string
  agendaTab: AgendaTab
  financialTab: FinancialTab
  sidebarOpen: boolean
  setScreen: (screen: Screen) => void
  setActiveNav: (nav: string) => void
  setAgendaTab: (tab: AgendaTab) => void
  setFinancialTab: (tab: FinancialTab) => void
  toggleSidebar: () => void
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      screen: 'dashboard',
      activeNav: 'dashboard',
      agendaTab: 'calendario',
      financialTab: 'liquidacoes',
      sidebarOpen: true,
      setScreen: (screen) => set({ screen }),
      setActiveNav: (activeNav) => set({ activeNav }),
      setAgendaTab: (agendaTab) => set({ agendaTab }),
      setFinancialTab: (financialTab) => set({ financialTab }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'sub_nav',
      partialize: (s) => ({
        screen: s.screen,
        activeNav: s.activeNav,
        agendaTab: s.agendaTab,
        financialTab: s.financialTab,
        sidebarOpen: s.sidebarOpen,
      }),
    }
  )
)
