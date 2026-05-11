import type { Meta, StoryObj } from '@storybook/react'
import Icon from '@/components/atoms/Icon'

const meta: Meta = {
  title: 'Design System/Organisms/Layout/GlobalHeader',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'canvas' },
    docs: {
      description: {
        component: 'GlobalHeader de 48px. Badge Sub-adquirente usa #1890FF, avatar SA usa #722ED1, sino com badge vermelho #FF4D4F.',
      },
    },
  },
}

export default meta
type Story = StoryObj

function HeaderVisual({ notifCount = 5 }: { notifCount?: number }) {
  return (
    <div
      style={{
        width: '100%', height: 48, background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center' }}>
          <Icon name="menu" size={18} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(0,0,0,0.85)', fontFamily: 'Roboto', letterSpacing: 1 }}>TUPI</span>
        <span style={{ fontSize: 12, background: '#E6F7FF', color: '#1890FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '1px 8px', fontWeight: 500 }}>
          Sub-adquirente
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}>
            <Icon name="search" size={14} color="rgba(0,0,0,0.35)" />
          </div>
          <input placeholder="Buscar..." style={{ border: '1px solid #D9D9D9', borderRadius: 2, padding: '4px 12px 4px 32px', fontSize: 13, outline: 'none', width: 200, fontFamily: 'Roboto' }} />
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Icon name="bell" size={18} />
          {notifCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#FF4D4F', borderRadius: 99, width: 16, height: 16, fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxSizing: 'border-box' }}>
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#722ED1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>SA</div>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Sub Adquirente</span>
          <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" />
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  name: 'Estado normal (5 notificações)',
  render: () => (
    <div style={{ background: '#F2F4F8', height: '100vh' }}>
      <HeaderVisual notifCount={5} />
    </div>
  ),
}

export const SemNotificacoes: Story = {
  name: 'Sem notificações (badge oculto)',
  render: () => (
    <div style={{ background: '#F2F4F8', height: '100vh' }}>
      <HeaderVisual notifCount={0} />
    </div>
  ),
}

export const MuitasNotificacoes: Story = {
  name: 'Muitas notificações (>9)',
  render: () => (
    <div style={{ background: '#F2F4F8', height: '100vh' }}>
      <HeaderVisual notifCount={12} />
    </div>
  ),
}

export const AnatomiaBadge: Story = {
  name: 'Anatomia — badge Sub-adquirente',
  render: () => (
    <div style={{ padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0 }}>Badge de role do operador logado:</p>
      <span style={{ display: 'inline-block', fontSize: 12, background: '#E6F7FF', color: '#1890FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '1px 8px', fontWeight: 500 }}>
        Sub-adquirente
      </span>
      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0 }}>bg: #E6F7FF · color: #1890FF · border: #91D5FF · radius: 2px</p>
    </div>
  ),
}

export const AnatomiaAvatar: Story = {
  name: 'Anatomia — avatar SA',
  render: () => (
    <div style={{ padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0 }}>Avatar do usuário logado:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#722ED1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>SA</div>
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Sub Adquirente</span>
        <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" />
      </div>
      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0 }}>bg: #722ED1 · size: 28px · iniciais: 2 chars</p>
    </div>
  ),
}
