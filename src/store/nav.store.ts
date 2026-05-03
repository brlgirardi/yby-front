import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Screen =
  | 'dashboard'
  | 'merchants'
  | 'transactions'
  | 'agenda'
  | 'financial'
  | 'pricing'
  | 'reconciliation'
  | 'users'
  | 'settings'

export type AgendaTab = 'calendario'
export type FinancialTab = 'liquidacoes' | 'repasses' | 'arquivos' | 'antecipacoes' | 'dre'

interface NavState {
  screen: Screen
  activeNav: string
  activeSubTab: string
  agendaTab: AgendaTab
  financialTab: FinancialTab
  sidebarOpen: boolean
  setScreen: (screen: Screen) => void
  setActiveNav: (nav: string) => void
  setActiveSubTab: (tab: string) => void
  setAgendaTab: (tab: AgendaTab) => void
  setFinancialTab: (tab: FinancialTab) => void
  toggleSidebar: () => void
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      screen: 'dashboard',
      activeNav: 'dashboard',
      activeSubTab: '',
      agendaTab: 'calendario',
      financialTab: 'liquidacoes',
      sidebarOpen: true,
      setScreen: (screen) => set({ screen }),
      setActiveNav: (activeNav) => set({ activeNav }),
      setActiveSubTab: (activeSubTab) => set({ activeSubTab }),
      setAgendaTab: (agendaTab) => set({ agendaTab }),
      setFinancialTab: (financialTab) => set({ financialTab }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'sub_nav',
      partialize: (s) => ({
        screen: s.screen,
        activeNav: s.activeNav,
        activeSubTab: s.activeSubTab,
        agendaTab: s.agendaTab,
        financialTab: s.financialTab,
        sidebarOpen: s.sidebarOpen,
      }),
    }
  )
)
