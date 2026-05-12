'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboardingSidebar.tsx
// Sidebar interna da página de onboarding (240px). Item "Estabelecimentos"
// fixo como ativo nesta fase — demais itens são placeholders visuais
// representando seções futuras (Custos, Tabela de precificação, Reconciliação).

import Icon from '@/components/atoms/Icon'

interface SidebarItem {
  key: string
  label: string
  icon: string
  active?: boolean
}

const ITEMS: SidebarItem[] = [
  { key: 'estabelecimentos', label: 'Estabelecimentos',      icon: 'users',     active: true },
  { key: 'custos',           label: 'Custos',                icon: 'landmark' },
  { key: 'precificacao',     label: 'Tabela de precificação', icon: 'receipt'   },
  { key: 'reconciliacao',    label: 'Reconciliação',         icon: 'reconcile' },
]

export default function MerchantOnboardingSidebar() {
  return (
    <nav
      aria-label="Seções do estabelecimento"
      style={{
        width: 240,
        minWidth: 240,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexShrink: 0,
      }}
    >
      {ITEMS.map((item) => (
        <SidebarLink key={item.key} item={item} />
      ))}
    </nav>
  )
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const active = !!item.active

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={!active}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        minHeight: 44,
        border: 'none',
        borderLeft: active ? '2px solid #1890FF' : '2px solid transparent',
        borderRadius: 2,
        background: active ? '#E6F7FF' : 'transparent',
        color: active ? '#1890FF' : 'rgba(0,0,0,0.65)',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        textAlign: 'left',
        cursor: active ? 'default' : 'not-allowed',
        opacity: active ? 1 : 0.55,
        transition: 'background 0.15s, color 0.15s',
        width: '100%',
      }}
    >
      <Icon name={item.icon} size={18} />
      <span>{item.label}</span>
    </button>
  )
}