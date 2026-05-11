import type { Meta, StoryObj } from '@storybook/react'
import Icon from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Design System/Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'dashboard', 'users', 'receipt', 'calendar', 'landmark', 'creditCard',
        'settings', 'bell', 'search', 'chevronDown', 'chevronUp', 'chevronRight',
        'chevronLeft', 'menu', 'eye', 'eyeOff', 'info', 'filter', 'plus',
        'download', 'x', 'moreHorizontal', 'trendingUp', 'arrowLeft', 'logOut',
        'barChart', 'reconcile', 'userPlus',
      ],
      description: 'Nome do ícone',
    },
    size: {
      control: { type: 'number', min: 10, max: 48, step: 2 },
      description: 'Tamanho em px (width e height)',
    },
    color: {
      control: 'color',
      description: 'Cor do stroke',
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 4, step: 0.5 },
      description: 'Espessura do traço',
    },
  },
  parameters: {
    backgrounds: { default: 'white' },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'dashboard',
    size: 20,
    color: 'rgba(0,0,0,0.65)',
    strokeWidth: 2,
  },
}

export const Large: Story = {
  args: {
    name: 'bell',
    size: 32,
    color: '#1890FF',
    strokeWidth: 1.5,
  },
}

export const Small: Story = {
  args: {
    name: 'search',
    size: 12,
    color: 'rgba(0,0,0,0.35)',
    strokeWidth: 2,
  },
}

// Galeria com todos os ícones disponíveis
const ALL_ICONS = [
  'dashboard', 'users', 'receipt', 'calendar', 'landmark', 'creditCard',
  'settings', 'bell', 'search', 'chevronDown', 'chevronUp', 'chevronRight',
  'chevronLeft', 'menu', 'eye', 'eyeOff', 'info', 'filter', 'plus',
  'download', 'x', 'moreHorizontal', 'trendingUp', 'arrowLeft', 'logOut',
  'barChart', 'reconcile', 'userPlus',
]

export const Gallery: Story = {
  name: 'Galeria — todos os ícones',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 16, background: '#fff' }}>
      {ALL_ICONS.map((name) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 72 }}
        >
          <div
            style={{
              width: 44, height: 44, border: '1px solid #f0f0f0', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fafafa',
            }}
          >
            <Icon name={name} size={20} color="rgba(0,0,0,0.65)" />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', textAlign: 'center', lineHeight: '14px' }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
}

export const NavContexto: Story = {
  name: 'Uso real — nav sidebar',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#fff', padding: 16, width: 200 }}>
      {[
        { name: 'dashboard', label: 'Dashboard', active: true },
        { name: 'users', label: 'Merchants', active: false },
        { name: 'receipt', label: 'Cobranças', active: false },
        { name: 'calendar', label: 'Agenda', active: false },
        { name: 'landmark', label: 'Financeiro', active: false },
        { name: 'reconcile', label: 'Conciliação', active: false },
      ].map(({ name, label, active }) => (
        <div
          key={name}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 40,
            background: active ? 'rgba(24,144,255,0.08)' : 'transparent',
            borderRight: active ? '3px solid #1890FF' : '3px solid transparent',
            color: active ? '#1890FF' : 'rgba(0,0,0,0.65)',
            borderRadius: 0,
            cursor: 'pointer',
          }}
        >
          <Icon name={name} size={16} color={active ? '#1890FF' : 'rgba(0,0,0,0.45)'} />
          <span style={{ fontSize: 13, fontWeight: active ? 500 : 400 }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

export const CoresSemanticas: Story = {
  name: 'Cores semânticas',
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 16, background: '#fff', flexWrap: 'wrap' }}>
      {[
        { name: 'info',    color: '#1890FF', label: 'Primário' },
        { name: 'reconcile', color: '#52C41A', label: 'Sucesso' },
        { name: 'x',      color: '#FF4D4F', label: 'Erro' },
        { name: 'bell',   color: '#FAAD14', label: 'Warning' },
        { name: 'settings', color: 'rgba(0,0,0,0.45)', label: 'Neutro' },
      ].map(({ name, color, label }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon name={name} size={24} color={color} />
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}
