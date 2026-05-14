// Manifest do sub-adquirente alinhado ao Sidebar atual.

import type { PersonaManifest } from '@/features/manifests/types'

const v0 = {
  label: 'Sub-adquirente · v0',
  persona: 'subadquirente',
  version: 'v0',
  modules: [
    'dashboard',
    'merchants',
    'transactions',
    'agenda',
    'financeiro',
    'reconciliation',
    'pricing',
    'usuarios',
    'settings',
  ],
  submenus: {
    financeiro: ['liquidacoes', 'repasses', 'arquivos', 'antecipacoes', 'dre'],
    pricing: ['costs', 'prices', 'interchange'],
  },
  defaultExpanded: 'dashboard',
  badges: {
    dev: 'SA v0',
  },
} satisfies PersonaManifest

// V1 SUB — espelha as jornadas do FigJam V1++ SUB:
// - 140:279 Configurando produto avançado (regras granulares)
// - 140:402 Aprovando manualmente (workflow de approval)
// - 140:491 Monitorando operação avançada (alertas, drill-down, intervenções)
const v1 = {
  label: 'Sub-adquirente · v1',
  persona: 'subadquirente',
  version: 'v1',
  modules: [
    'dashboard',
    'merchants',
    'transactions',
    'agenda',
    'financeiro',
    'reconciliation',
    'pricing',
    'integrations',
    'usuarios',
  ],
  submenus: {
    financeiro:   ['liquidacoes', 'repasses', 'arquivos', 'antecipacoes', 'dre'],
    pricing:      ['costs', 'prices', 'interchange', 'antecipacao'],
  },
  defaultExpanded: 'dashboard',
  badges: { dev: 'SA v1' },
} satisfies PersonaManifest

export const subadquirente = {
  v0,
  v1,
}
