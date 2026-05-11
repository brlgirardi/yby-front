import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Icon from '@/components/atoms/Icon'

const meta: Meta = {
  title: 'Design System/Organisms/Layout/Sidebar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'canvas' },
    docs: {
      description: {
        component: `
Sidebar de navegação lateral colapsável.

- **Expanded**: 207px de largura, exibe ícone + label + chevron para sub-menus
- **Collapsed**: 48px de largura, exibe apenas ícones (tooltip no hover)
- **Item ativo**: bg \`rgba(24,144,255,0.08)\` + border-right \`3px solid #1890FF\`
- **Hover**: bg \`rgba(24,144,255,0.08)\` + text/icon \`#1890FF\` + border-right \`3px solid #1890FF\`
- **Sub-items**: 36px de altura, paddingLeft 42px
- Transição: \`width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

const NAV = [
  { key: 'dashboard',     icon: 'dashboard',  label: 'Dashboard' },
  { key: 'merchants',     icon: 'users',      label: 'Merchants',      sub: ['Lista de merchants', 'Novo merchant'] },
  { key: 'charges',       icon: 'receipt',    label: 'Cobranças' },
  { key: 'agenda',        icon: 'calendar',   label: 'Agenda',         sub: ['Recebíveis', 'Por parcela', 'Por lote'] },
  { key: 'financial',     icon: 'landmark',   label: 'Financeiro',     sub: ['Extrato', 'Liquidações', 'Antecipações'] },
  { key: 'reconciliation',icon: 'reconcile',  label: 'Conciliação' },
  { key: 'pricing',       icon: 'creditCard', label: 'Custos & Pricing' },
  { key: 'users',         icon: 'userPlus',   label: 'Usuários' },
  { key: 'settings',      icon: 'settings',   label: 'Configurações' },
]

function SidebarVisual({
  collapsed = false,
  activeKey = 'dashboard',
  expandedKey,
  forceHoverKey,
  forceHoverSubKey,
}: {
  collapsed?: boolean
  activeKey?: string
  expandedKey?: string
  forceHoverKey?: string
  forceHoverSubKey?: string
}) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [hoveredSubKey, setHoveredSubKey] = useState<string | null>(null)
  const [hoveredLogout, setHoveredLogout] = useState(false)
  const width = collapsed ? 48 : 207
  return (
    <div
      style={{
        width, minHeight: '100vh', background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
        overflow: 'hidden', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.645,0.045,0.355,1)',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8 }}>
        {NAV.map((item) => {
          const isActive = activeKey === item.key
          const isHovered = (forceHoverKey ?? hoveredKey) === item.key
          const isExp = expandedKey === item.key
          const parentColor = isActive || isHovered ? '#1890FF' : 'rgba(0,0,0,0.65)'
          const parentBg = isActive && !item.sub ? 'rgba(24,144,255,0.08)' : isHovered ? 'rgba(24,144,255,0.08)' : 'transparent'
          const parentBorder = isActive && !item.sub ? '3px solid #1890FF' : isHovered ? '3px solid #1890FF' : '3px solid transparent'

          return (
            <div key={item.key}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '0 14px' : '0 16px',
                  height: 40, cursor: 'pointer',
                  background: parentBg,
                  borderRight: parentBorder,
                  color: parentColor,
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div style={{ flexShrink: 0, color: isActive || isHovered ? '#1890FF' : 'rgba(0,0,0,0.45)' }}>
                  <Icon name={item.icon} size={16} />
                </div>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: isActive || isHovered ? 500 : 400 }}>
                      {item.label}
                    </span>
                    {item.sub && (
                      <Icon name={isExp ? 'chevronUp' : 'chevronDown'} size={12} color="rgba(0,0,0,0.35)" />
                    )}
                  </>
                )}
              </div>

              {!collapsed && item.sub && isExp && item.sub.map((sub, i) => {
                const subKey = `${item.key}-${i}`
                const isSubHovered = (forceHoverSubKey ?? hoveredSubKey) === subKey
                return (
                  <div
                    key={i}
                    style={{
                      paddingLeft: 42, height: 36, display: 'flex', alignItems: 'center',
                      fontSize: 13, color: isSubHovered ? '#1890FF' : 'rgba(0,0,0,0.65)',
                      cursor: 'pointer', background: isSubHovered ? 'rgba(24,144,255,0.08)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredSubKey(subKey)}
                    onMouseLeave={() => setHoveredSubKey(null)}
                  >
                    {sub}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px 0', borderTop: '1px solid #f0f0f0' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '0 14px' : '0 16px',
            height: 40, cursor: 'pointer',
            color: hoveredLogout ? '#1890FF' : 'rgba(0,0,0,0.45)',
            background: hoveredLogout ? 'rgba(24,144,255,0.08)' : 'transparent',
            borderRight: hoveredLogout ? '3px solid #1890FF' : '3px solid transparent',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}
          onMouseEnter={() => setHoveredLogout(true)}
          onMouseLeave={() => setHoveredLogout(false)}
        >
          <Icon name="logOut" size={16} />
          {!collapsed && <span style={{ fontSize: 13 }}>Sair</span>}
        </div>
      </div>
    </div>
  )
}

export const Expanded: Story = {
  name: 'Expanded (207px) — Dashboard ativo',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: '#F2F4F8' }}>
      <SidebarVisual collapsed={false} activeKey="dashboard" />
    </div>
  ),
}

export const ExpandedComSubmenu: Story = {
  name: 'Expanded — Merchants expandido',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: '#F2F4F8' }}>
      <SidebarVisual collapsed={false} activeKey="merchants" expandedKey="merchants" />
    </div>
  ),
}

export const ExpandedAgenda: Story = {
  name: 'Expanded — Agenda expandida',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: '#F2F4F8' }}>
      <SidebarVisual collapsed={false} activeKey="agenda" expandedKey="agenda" />
    </div>
  ),
}

export const Collapsed: Story = {
  name: 'Collapsed (48px) — apenas ícones',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: '#F2F4F8' }}>
      <SidebarVisual collapsed activeKey="dashboard" />
    </div>
  ),
}

export const CollapsedComAtivo: Story = {
  name: 'Collapsed — Financeiro ativo',
  render: () => (
    <div style={{ display: 'flex', height: '100vh', background: '#F2F4F8' }}>
      <SidebarVisual collapsed activeKey="financial" />
    </div>
  ),
}

export const TransicaoLado: Story = {
  name: 'Comparação lado a lado',
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: '#F2F4F8', height: '100vh' }}>
      <div>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8, fontFamily: 'Roboto' }}>Expanded — 207px</p>
        <SidebarVisual collapsed={false} activeKey="merchants" expandedKey="merchants" />
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8, fontFamily: 'Roboto' }}>Collapsed — 48px</p>
        <SidebarVisual collapsed activeKey="merchants" />
      </div>
    </div>
  ),
}

export const HoverSimulado: Story = {
  name: 'Hover simulado — visual estático',
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: '#F2F4F8', height: '100vh' }}>
      <div>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8, fontFamily: 'Roboto' }}>Item pai em hover (Cobranças)</p>
        <SidebarVisual collapsed={false} activeKey="dashboard" forceHoverKey="charges" />
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8, fontFamily: 'Roboto' }}>Sub-item em hover (Agenda — Por parcela)</p>
        <SidebarVisual collapsed={false} activeKey="dashboard" expandedKey="agenda" forceHoverSubKey="agenda-1" />
      </div>
    </div>
  ),
}
