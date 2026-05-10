// Mapeamento canônico de (persona, ModuleKey, sub-key) → URL.
// Usado pelo Sidebar pluggável e pelo PersonaSwitcher pra escolher pra
// onde navegar quando o usuário troca de persona ou clica num item de menu.

import type { ModuleKey, Persona } from '@/features/manifests/types'

type RouteMap = Partial<Record<ModuleKey, string | { root: string; subs?: Record<string, string> }>>

const ec: RouteMap = {
  dashboard:     '/estabelecimento/dashboard',
  cobrancas:     {
    root: '/estabelecimento/cobrancas',
    subs: {
      cobrancas:    '/estabelecimento/cobrancas',
      links:        '/estabelecimento/cobrancas/links',
      maquininhas:  '/estabelecimento/cobrancas/maquininhas',
    },
  },
  agenda: '/estabelecimento/agenda',
  financeiro: {
    root: '/estabelecimento/financeiro/extrato',
    subs: {
      extrato:                  '/estabelecimento/financeiro/extrato',
      antecipacoes:             '/estabelecimento/financeiro/antecipacoes',
      'antecipacao-programada': '/estabelecimento/financeiro/antecipacao-programada',
      liquidacoes:              '/estabelecimento/financeiro/liquidacoes',
      'taxas-simulacoes':       '/estabelecimento/financeiro/taxas-simulacoes',
    },
  },
  configuracoes: {
    root: '/estabelecimento/configuracoes/usuarios',
    subs: {
      usuarios:    '/estabelecimento/configuracoes/usuarios',
      empresas:    '/estabelecimento/configuracoes/empresas',
      preferencias:'/estabelecimento/configuracoes/preferencias',
    },
  },
}

const sub: RouteMap = {
  dashboard:      '/dashboard',
  merchants:      '/merchants',
  transactions:   '/transactions',
  agenda:         '/agenda',
  financeiro: {
    root: '/financial?tab=liquidacoes',
    subs: {
      liquidacoes:  '/financial?tab=liquidacoes',
      repasses:     '/financial?tab=repasses',
      arquivos:     '/financial?tab=arquivos',
      antecipacoes: '/financial?tab=antecipacoes',
      dre:          '/financial?tab=dre',
    },
  },
  reconciliation: '/reconciliation',
  pricing:        {
    root: '/pricing',
    subs: {
      costs:        '/pricing/costs',
      prices:       '/pricing/prices',
      interchange:  '/pricing/interchange',
      antecipacao:  '/pricing/antecipacao',
    },
  },
  usuarios: '/users',
  settings: '/settings',
}

const aq: RouteMap = {
  dashboard: '/adquirente/dashboard',
  vendas: {
    root: '/adquirente/vendas/pricing',
    subs: {
      pricing:      '/adquirente/vendas/pricing',
      platinizacao: '/adquirente/vendas/platinizacao',
    },
  },
}

const routesByPersona: Record<Persona, RouteMap> = {
  estabelecimento: ec,
  subadquirente:   sub,
  adquirente:      aq,
}

export function getModuleRoute(persona: Persona, moduleKey: ModuleKey): string | null {
  const map = routesByPersona[persona]?.[moduleKey]
  if (!map) return null
  if (typeof map === 'string') return map
  return map.root
}

export function getSubmenuRoute(persona: Persona, moduleKey: ModuleKey, subKey: string): string | null {
  const map = routesByPersona[persona]?.[moduleKey]
  if (!map || typeof map === 'string') return null
  return map.subs?.[subKey] ?? null
}

export function getDefaultRouteForPersona(persona: Persona): string {
  const dashboard = getModuleRoute(persona, 'dashboard')
  return dashboard ?? '/dashboard'
}
