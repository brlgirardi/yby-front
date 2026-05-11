import type { Meta, StoryObj } from '@storybook/react'
import Badge from './Badge'
import Icon from './Icon'

const meta: Meta<typeof Badge> = {
  title: 'Design System/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'Número a exibir',
    },
    max: {
      control: { type: 'number', min: 9, max: 999 },
      description: 'Valor máximo antes de exibir "N+"',
    },
    color: {
      control: 'color',
      description: 'Cor de fundo do badge',
    },
    dot: {
      control: 'boolean',
      description: 'Exibe como ponto (sem número)',
    },
  },
  parameters: {
    backgrounds: { default: 'white' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#fff', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Badge>

// --- Default standalone ---
export const Default: Story = {
  args: { count: 5 },
}

// --- Valores variados ---
export const ContadorBaixo: Story = { name: 'Contador baixo (1–9)',   args: { count: 3 } }
export const ContadorMedio: Story = { name: 'Contador médio (10–99)', args: { count: 42 } }
export const ContadorMax: Story = {
  name: 'Contador acima do max (>99)',
  args: { count: 150, max: 99 },
}
export const MaxCustomizado: Story = {
  name: 'Max customizado (>9)',
  args: { count: 12, max: 9 },
}

// --- Dot ---
export const DotNotificacao: Story = {
  name: 'Dot — indicador sem contagem',
  args: { count: 1, dot: true },
}

// --- Zero (não exibe) ---
export const SemNotificacoes: Story = {
  name: 'Zero — oculto (count=0)',
  args: { count: 0 },
}

// --- Cores semânticas ---
export const CoresSemanticas: Story = {
  name: 'Cores semânticas',
  render: () => (
    <>
      <Badge count={5}  color="#FF4D4F" />  {/* Erro */}
      <Badge count={3}  color="#FAAD14" />  {/* Warning */}
      <Badge count={12} color="#52C41A" />  {/* Sucesso */}
      <Badge count={7}  color="#1890FF" />  {/* Info */}
    </>
  ),
}

// --- Wrapped (sobre ícone de sino) ---
export const WrappedSino: Story = {
  name: 'Sobre ícone de sino',
  render: () => (
    <Badge count={5} color="#FF4D4F">
      <div
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #D9D9D9', borderRadius: 2, cursor: 'pointer',
        }}
      >
        <Icon name="bell" size={18} color="rgba(0,0,0,0.45)" />
      </div>
    </Badge>
  ),
}

export const WrappedDot: Story = {
  name: 'Dot sobre ícone de sino',
  render: () => (
    <Badge count={1} dot color="#FF4D4F">
      <div
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid #D9D9D9', borderRadius: 2, cursor: 'pointer',
        }}
      >
        <Icon name="bell" size={18} color="rgba(0,0,0,0.45)" />
      </div>
    </Badge>
  ),
}

// --- Uso real — header global ---
export const UsoRealHeader: Story = {
  name: 'Uso real — header de notificações',
  render: () => (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px',
        height: 48, background: '#fff', borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', width: '100%',
      }}
    >
      <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', fontFamily: 'Roboto' }}>GlobalHeader</span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
        <Badge count={5} color="#FF4D4F">
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.45)' }}>
            <Icon name="bell" size={18} />
          </button>
        </Badge>
        <Badge count={0}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.45)' }}>
            <Icon name="settings" size={18} />
          </button>
        </Badge>
      </div>
    </div>
  ),
  decorators: [(Story) => <div style={{ background: '#F2F4F8', padding: 0 }}><Story /></div>],
}
