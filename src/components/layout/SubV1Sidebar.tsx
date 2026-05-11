'use client'
// Sidebar do Sub-adquirente V1 — pluggável, lê do manifest SUB v1.
// Mesma estrutura visual do Sidebar legacy (V0) — usa border-right azul como
// accent, header branco, footer "Sair", responsivo (sidebarOpen).
//
// Diferença pro Sidebar legacy: este lê módulos do `manifests.subadquirente.v1`
// (inclui novos V1 como Aprovações, Config Avançada, Monitor Avançado) e
// navega via router.push pras rotas reais.

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Icon from '@/components/atoms/Icon'
import { manifests } from '@/features/manifests'
import { getModuleRoute, getSubmenuRoute } from '@/features/manifests/routes'
import type { ModuleKey, PersonaManifest, Version } from '@/features/manifests/types'
import { usePersonaStore } from '@/stores/personaStore'
import { useNavStore } from '@/store/nav.store'
import { useAuthStore } from '@/store/auth.store'
import { logout as apiLogout } from '@/services/authService'

const moduleIconMap: Partial<Record<ModuleKey, string>> = {
  dashboard:      'dashboard',
  merchants:      'users',
  transactions:   'receipt',
  agenda:         'calendar',
  financeiro:     'landmark',
  reconciliation: 'reconcile',
  pricing:        'landmark',
  usuarios:       'users',
  settings:       'settings',
}

const moduleLabel: Partial<Record<ModuleKey, string>> = {
  dashboard:      'Dashboard',
  merchants:      'Merchants',
  transactions:   'Transações',
  agenda:         'Agenda',
  financeiro:     'Financeiro',
  reconciliation: 'Conciliação',
  pricing:        'Custos & Precificação',
  usuarios:       'Usuários',
  settings:       'Configurações',
}

const submenuLabels: Record<string, string> = {
  liquidacoes:  'Liquidações',
  repasses:     'Repasses para ECs',
  arquivos:     'Arquivos',
  antecipacoes: 'Antecipações',
  dre:          'DRE Operacional',
  costs:        'Custos',
  prices:       'Preços',
  interchange:  'Matriz de Intercâmbio',
  antecipacao:  'Antecipação',
}

export default function SubV1Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sidebarOpen = useNavStore((s) => s.sidebarOpen)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const subManifests = manifests.subadquirente as Partial<Record<Version, PersonaManifest>>
  const manifest = subManifests.v1 ?? subManifests.v0

  const initialExpanded = manifest?.defaultExpanded ?? null
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    if (initialExpanded) init[initialExpanded] = true
    // Expande o módulo pai cuja rota base está no pathname atual
    const subMap = manifest?.submenus as Partial<Record<ModuleKey, string[]>> | undefined
    if (subMap) {
      manifest?.modules.forEach((m) => {
        const route = getModuleRoute('subadquirente', m)
        if (route && pathname.startsWith(route.split('?')[0])) init[m] = true
      })
    }
    return init
  })
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [hoveredSubKey, setHoveredSubKey] = useState<string | null>(null)
  const [hoveredLogout, setHoveredLogout] = useState(false)

  if (!manifest) return null

  const submenusMap = manifest.submenus as Partial<Record<ModuleKey, string[]>>

  const items = manifest.modules.map((m) => ({
    key:      m,
    label:    moduleLabel[m] ?? m,
    icon:     moduleIconMap[m] ?? 'dashboard',
    route:    getModuleRoute('subadquirente', m),
    submenus: (submenusMap[m] ?? []).map((sub: string) => ({
      key:   sub,
      label: submenuLabels[sub] ?? sub,
      route: getSubmenuRoute('subadquirente', m, sub),
    })),
  }))

  const isActiveRoute = (route: string | null) => {
    if (!route) return false
    const [routePath, routeQuery] = route.split('?')
    if (!routeQuery) return pathname === routePath
    const routeParams = new URLSearchParams(routeQuery)
    if (pathname !== routePath) return false
    for (const [k, v] of routeParams.entries()) {
      if (searchParams.get(k) !== v) return false
    }
    return true
  }
  const isModuleActive = (route: string | null, submenus: { route: string | null }[]) =>
    isActiveRoute(route) || submenus.some((s) => isActiveRoute(s.route))

  const toggle = (k: string) => setExpanded((p) => ({ ...p, [k]: !p[k] }))

  const handleLogout = async () => {
    try { await apiLogout() } catch { /* ignore */ }
    clearAuth()
    router.replace('/login')
  }

  return (
    <div
      style={{
        width: sidebarOpen ? 207 : 48,
        minHeight: '100%',
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
        transition: 'width 0.2s cubic-bezier(0.645,0.045,0.355,1)',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8 }}>
        {items.map((item) => {
          const hasSubs = item.submenus.length > 0
          const isExp = expanded[item.key] ?? false
          const isHovered = hoveredKey === item.key
          const active = isModuleActive(item.route, item.submenus)
          const accent = active || isHovered

          const parentColor = accent ? '#1890FF' : 'rgba(0,0,0,0.65)'
          const parentBg =
            active || isHovered ? 'rgba(24,144,255,0.08)' : 'transparent'
          const parentBorder =
            active || isHovered ? '3px solid #1890FF' : '3px solid transparent'

          return (
            <div key={item.key}>
              <div
                onClick={() => {
                  if (hasSubs) toggle(item.key)
                  else if (item.route) router.push(item.route)
                }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: sidebarOpen ? '0 16px' : '0 14px',
                  height: 40,
                  cursor: 'pointer',
                  background: parentBg,
                  borderRight: parentBorder,
                  color: parentColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: accent ? '#1890FF' : 'rgba(0,0,0,0.45)' }}>
                  <Icon name={item.icon} size={16} />
                </div>
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: accent ? 500 : 400 }}>{item.label}</span>
                    {hasSubs && <Icon name={isExp ? 'chevronUp' : 'chevronDown'} size={12} color="rgba(0,0,0,0.35)" />}
                  </>
                )}
              </div>

              {sidebarOpen && hasSubs && isExp && item.submenus.map((sub) => {
                const subKey = `${item.key}-${sub.key}`
                const subActive = isActiveRoute(sub.route)
                const subHovered = hoveredSubKey === subKey
                return (
                  <div
                    key={subKey}
                    onClick={() => sub.route && router.push(sub.route)}
                    onMouseEnter={() => setHoveredSubKey(subKey)}
                    onMouseLeave={() => setHoveredSubKey(null)}
                    style={{
                      paddingLeft: 42,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: subActive ? '#1890FF' : subHovered ? '#1890FF' : 'rgba(0,0,0,0.65)',
                      background: subActive ? 'rgba(24,144,255,0.08)' : subHovered ? 'rgba(24,144,255,0.04)' : 'transparent',
                      borderRight: subActive ? '3px solid #1890FF' : '3px solid transparent',
                      fontWeight: subActive ? 500 : 400,
                    }}
                  >
                    <span style={{ flex: 1 }}>{sub.label}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px 0', borderTop: '1px solid #f0f0f0' }}>
        <div
          onClick={handleLogout}
          onMouseEnter={() => setHoveredLogout(true)}
          onMouseLeave={() => setHoveredLogout(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: sidebarOpen ? '0 16px' : '0 14px',
            height: 40,
            cursor: 'pointer',
            color: hoveredLogout ? '#1890FF' : 'rgba(0,0,0,0.45)',
            background: hoveredLogout ? 'rgba(24,144,255,0.08)' : 'transparent',
            borderRight: hoveredLogout ? '3px solid #1890FF' : '3px solid transparent',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon name="logOut" size={16} />
          </div>
          {sidebarOpen && <span style={{ fontSize: 13 }}>Sair</span>}
        </div>
      </div>
    </div>
  )
}
