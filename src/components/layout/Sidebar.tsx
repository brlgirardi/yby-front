'use client'

import { useState } from 'react'
import Icon from '@/components/shared/Icon'
import Badge from '@/components/shared/Badge'
import { useNavStore, type Screen, type AgendaTab, type FinancialTab } from '@/store/nav.store'
import { useRouter } from 'next/navigation'

const NAV = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', screen: 'dashboard' },
  { key: 'merchants', icon: 'users', label: 'Merchants', screen: 'merchants' },
  { key: 'transactions', icon: 'receipt', label: 'Transações', screen: 'transactions' },
  { key: 'agenda', icon: 'calendar', label: 'Agenda', screen: 'agenda' },
  { key: 'financial', icon: 'landmark', label: 'Financeiro', screen: 'financial', badge: { count: 1, tone: 'error' as const },
    sub: [
      { label: 'Liquidações',       screen: 'financial', tab: 'liquidacoes'  },
      { label: 'Repasses para ECs', screen: 'financial', tab: 'repasses'     },
      { label: 'Arquivos',          screen: 'financial', tab: 'arquivos', badge: { count: 1, tone: 'error' as const } },
      { label: 'Antecipações',      screen: 'financial', tab: 'antecipacoes' },
      { label: 'DRE Operacional',   screen: 'financial', tab: 'dre'          },
    ] },
  { key: 'reconciliation', icon: 'reconcile', label: 'Conciliação', screen: 'reconciliation' },
  { key: 'pricing', icon: 'creditCard', label: 'Custos & Pricing', screen: 'pricing' },
  { key: 'users', icon: 'userPlus', label: 'Usuários', screen: 'users' },
  { key: 'settings', icon: 'settings', label: 'Configurações', screen: 'settings' },
]

export default function Sidebar() {
  const { sidebarOpen, activeNav, activeSubTab, setScreen, setActiveNav, setActiveSubTab, setAgendaTab, setFinancialTab } = useNavStore()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({ [activeNav]: true }))
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [hoveredSubKey, setHoveredSubKey] = useState<string | null>(null)
  const [hoveredLogout, setHoveredLogout] = useState(false)
  const router = useRouter()

  const toggle = (k: string) => setExpanded(p => ({ ...p, [k]: !p[k] }))

  const onNavigate = (screen: string, navKey: string, tab?: string) => {
    setScreen(screen as Screen)
    setActiveNav(navKey)
    setActiveSubTab(tab ?? '')
    if (tab) {
      if (screen === 'agenda') setAgendaTab(tab as AgendaTab)
      if (screen === 'financial') setFinancialTab(tab as FinancialTab)
    }
    router.push(`/${screen}`)
  }

  return (
    <div style={{ width:sidebarOpen?207:48, minHeight:'100%', background:'#fff', boxShadow:'2px 0 8px rgba(0,0,0,0.08)', transition:'width 0.2s cubic-bezier(0.645,0.045,0.355,1)', overflow:'hidden', flexShrink:0, display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', paddingTop:8 }}>
        {NAV.map(item => {
          const isActive = activeNav === item.key
          const isHovered = hoveredKey === item.key
          const isExp = expanded[item.key]
          const parentColor = isActive || isHovered ? '#1890FF' : 'rgba(0,0,0,0.65)'
          const parentBg = isActive && !item.sub ? 'rgba(24,144,255,0.08)' : isHovered ? 'rgba(24,144,255,0.08)' : 'transparent'
          const parentBorder = isActive && !item.sub ? '3px solid #1890FF' : isHovered ? '3px solid #1890FF' : '3px solid transparent'
          return (
            <div key={item.key}>
              <div
                onClick={() => item.sub ? toggle(item.key) : onNavigate(item.screen, item.key)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:sidebarOpen?'0 16px':'0 14px', height:40, cursor:'pointer', background:parentBg, borderRight:parentBorder, color:parentColor, whiteSpace:'nowrap', overflow:'hidden' }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}>
                <div style={{ flexShrink:0, display:'flex', alignItems:'center', color:isActive||isHovered?'#1890FF':'rgba(0,0,0,0.45)' }}><Icon name={item.icon} size={16} /></div>
                {sidebarOpen && (
                  <>
                    <span style={{ flex:1, fontSize:13, fontWeight:isActive||isHovered?500:400 }}>{item.label}</span>
                    {(item as { badge?: { count: number; tone: 'error'|'warning' } }).badge && (() => {
                      const b = (item as { badge: { count: number; tone: 'error'|'warning' } }).badge
                      return (
                        <span style={{ marginRight:4, display:'inline-flex' }}>
                          <Badge count={b.count} color={b.tone === 'error' ? '#FF4D4F' : '#FA8C16'} />
                        </span>
                      )
                    })()}
                    {item.sub && <Icon name={isExp?'chevronUp':'chevronDown'} size={12} color="rgba(0,0,0,0.35)" />}
                  </>
                )}
              </div>
              {sidebarOpen && item.sub && isExp && item.sub.map((s, i) => {
                const subKey = `${item.key}-${i}`
                const tab = (s as { tab?: string }).tab
                const isSubActive = activeNav === item.key && activeSubTab === (tab ?? '')
                const isSubHovered = hoveredSubKey === subKey
                return (
                  <div key={i}
                    onClick={() => onNavigate(s.screen, item.key, tab)}
                    style={{
                      paddingLeft:42, height:36, display:'flex', alignItems:'center', fontSize:13, cursor:'pointer',
                      color: isSubActive ? '#1890FF' : isSubHovered ? '#1890FF' : 'rgba(0,0,0,0.65)',
                      background: isSubActive ? 'rgba(24,144,255,0.08)' : isSubHovered ? 'rgba(24,144,255,0.04)' : 'transparent',
                      borderRight: isSubActive ? '3px solid #1890FF' : '3px solid transparent',
                      fontWeight: isSubActive ? 500 : 400,
                    }}
                    onMouseEnter={() => setHoveredSubKey(subKey)}
                    onMouseLeave={() => setHoveredSubKey(null)}>
                    <span style={{ flex:1 }}>{s.label}</span>
                    {(s as { badge?: { count: number; tone: 'error'|'warning' } }).badge && (() => {
                      const b = (s as { badge: { count: number; tone: 'error'|'warning' } }).badge
                      return (
                        <span style={{ marginRight:12, display:'inline-flex' }}>
                          <Badge count={b.count} color={b.tone === 'error' ? '#FF4D4F' : '#FA8C16'} />
                        </span>
                      )
                    })()}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div style={{ padding:'12px 0', borderTop:'1px solid #f0f0f0' }}>
        <div
          style={{ display:'flex', alignItems:'center', gap:10, padding:sidebarOpen?'0 16px':'0 14px', height:40, cursor:'pointer', color:hoveredLogout?'#1890FF':'rgba(0,0,0,0.45)', background:hoveredLogout?'rgba(24,144,255,0.08)':'transparent', borderRight:hoveredLogout?'3px solid #1890FF':'3px solid transparent', whiteSpace:'nowrap', overflow:'hidden' }}
          onMouseEnter={() => setHoveredLogout(true)}
          onMouseLeave={() => setHoveredLogout(false)}>
          <div style={{ display:'flex', alignItems:'center' }}><Icon name="logOut" size={16} /></div>
          {sidebarOpen && <span style={{ fontSize:13 }}>Sair</span>}
        </div>
      </div>
    </div>
  )
}
