// Manifest do Adquirente — V0 (demo cliente sales enablement).
//
// IA enxuta (Pixel/Hick): 2 itens raiz.
// - Dashboard Financeiro (3 abas internas: Geral / Planitização / Conciliação ITC)
// - Ferramentas de Vendas (categoria expansível: IA Precificação + Análise Platinização)
// O Resultado IA é destino dos 2 fluxos — não aparece no menu (Hick: zero ruído).

import type { PersonaManifest } from '@/features/manifests/types'

const v0 = {
  label: 'Adquirente · v0',
  persona: 'adquirente',
  version: 'v0',
  modules: ['dashboard', 'vendas'],
  submenus: {
    vendas: ['pricing', 'platinizacao'],
  },
  defaultExpanded: 'vendas',
  badges: {
    dev: 'AQ v0',
  },
} satisfies PersonaManifest

export const adquirente = {
  v0,
}
