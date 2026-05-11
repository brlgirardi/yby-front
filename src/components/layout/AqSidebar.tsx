'use client'
// Sidebar do Adquirente — V0 (demo cliente).
// Lê do manifest `manifests.adquirente.v0`. IA enxuta (Pixel/Hick): 2 itens raiz.
// Cores derivam do themeStore (Tupi/Vero) — accent reage ao tema selecionado.

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Icon from '@/components/shared/Icon'
import { manifests } from '@/features/manifests'
import { getModuleRoute, getSubmenuRoute } from '@/features/manifests/routes'
import type { ModuleKey, PersonaManifest, Version } from '@/features/manifests/types'
import { useNavStore } from '@/store/nav.store'
import { useAuthStore } from '@/store/auth.store'
import { logout as apiLogout } from '@/services/authService'
import { useTheme } from '@/stores/themeStore'

const moduleIconMap: Partial<Record<ModuleKey, string>> = {
  dashboard: 'dashboard',
  vendas:    'trendingUp',
}

const moduleLabel: Partial<Record<ModuleKey, string>> = {
  dashboard: 'Dashboard Financeiro',
  vendas:    'Ferramentas de Vendas',
}

const submenuLabels: Record<string, string> = {
  pricing:      'IA de Precificação',
  platinizacao: 'Análise de Platinização',
}

export default function AqSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const sidebarOpen = useNavStore((s) => s.sidebarOpen)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const theme = useTheme()
  const softBg = theme.primaryBg
  const softerBg = theme.primaryBg.replace(/0\.\d+\)$/, '0.04)')

  const aqManifests = manifests.adquirente as Partial<Record<Version, PersonaManifest>>
  const manifest = aqManifests.v0

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    if (manifest?.defaultExpanded) init[manifest.defaultExpanded] = true
    const subMap = manifest?.submenus as Partial<Record<ModuleKey, string[]>> | undefined
    if (subMap) {
      manifest?.modules.forEach((m) => {
        const route = getModuleRoute('adquirente', m)
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
    route:    getModuleRoute('adquirente', m),
    submenus: (submenusMap[m] ?? []).map((sub: string) => ({
      key:   sub,
      label: submenuLabels[sub] ?? sub,
      route: getSubmenuRoute('adquirente', m, sub),
    })),
  }))

  const isActiveRoute = (route: string | null) => !!route && pathname === route

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
          const isOwnRouteActive = !hasSubs && isActiveRoute(item.route)
          const accent = isOwnRouteActive || isHovered

          const parentColor = accent ? theme.primary : 'rgba(0,0,0,0.65)'
          const parentBg = accent ? softBg : 'transparent'
          const parentBorder = accent ? `3px solid ${theme.primary}` : '3px solid transparent'

          return (
            <div key={item.key}>
              <div
                onClick={() => {
                  if (hasSubs) {
                    const firstSub = item.submenus[0]
                    const childActive = item.submenus.some((s) => isActiveRoute(s.route))
                    if (childActive && isExp) {
                      toggle(item.key)
                    } else {
                      if (!isExp) toggle(item.key)
                      if (firstSub?.route) router.push(firstSub.route)
                    }
                  } else if (item.route) {
                    router.push(item.route)
                  }
                }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingLeft: sidebarOpen ? 16 : 0,
                  paddingRight: sidebarOpen ? 16 : 0,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  height: 40,
                  cursor: 'pointer',
                  background: parentBg,
                  borderRight: parentBorder,
                  color: parentColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', color: accent ? theme.primary : 'rgba(0,0,0,0.45)' }}>
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
                      color: subActive || subHovered ? theme.primary : 'rgba(0,0,0,0.65)',
                      background: subActive ? softBg : subHovered ? softerBg : 'transparent',
                      borderRight: subActive ? `3px solid ${theme.primary}` : '3px solid transparent',
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
            paddingLeft: sidebarOpen ? 16 : 0,
            paddingRight: sidebarOpen ? 16 : 0,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            height: 40,
            cursor: 'pointer',
            color: hoveredLogout ? theme.primary : 'rgba(0,0,0,0.45)',
            background: hoveredLogout ? softBg : 'transparent',
            borderRight: hoveredLogout ? `3px solid ${theme.primary}` : '3px solid transparent',
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
