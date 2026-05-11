import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import PageHeader from './PageHeader'
import Button from '@/components/atoms/Button'

const meta: Meta<typeof PageHeader> = {
  title: 'Design System/Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título principal da página (H4 — 20px/500)',
    },
    breadcrumb: {
      control: 'text',
      description: 'Texto de breadcrumb acima do título (12px, cinza)',
    },
    onBack: {
      description: 'Quando definido, exibe seta de voltar à esquerda do título',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#F2F4F8', padding: 0 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PageHeader>

// --- Básico ---

export const Default: Story = {
  name: 'Somente título',
  args: {
    title: 'Dashboard',
  },
}

export const ComBreadcrumb: Story = {
  name: 'Com breadcrumb',
  args: {
    title: 'Detalhes do Merchant',
    breadcrumb: 'Merchants / Detalhes',
  },
}

export const ComBackArrow: Story = {
  name: 'Com seta de voltar',
  args: {
    title: 'Detalhes da Cobrança',
    breadcrumb: 'Cobranças / Detalhes',
    onBack: fn(),
  },
}

export const ComBotaoExtra: Story = {
  name: 'Com botão extra (ação primária)',
  args: {
    title: 'Merchants',
    breadcrumb: 'Merchants',
    extra: <Button variant="primary" icon="plus">Novo Merchant</Button>,
  },
}

export const ComMultiplosExtras: Story = {
  name: 'Com múltiplos botões',
  args: {
    title: 'Cobranças',
    breadcrumb: 'Cobranças',
    extra: (
      <>
        <Button variant="secondary" icon="download">Exportar</Button>
        <Button variant="primary" icon="plus">Nova Cobrança</Button>
      </>
    ),
  },
}

export const ComTabs: Story = {
  name: 'Com tabs de navegação',
  args: {
    title: 'Agenda',
    breadcrumb: 'Agenda',
    tabs: [
      { key: 'calendario', label: 'Recebíveis' },
      { key: 'detalhada', label: 'Por parcela' },
      { key: 'lote', label: 'Por lote' },
    ],
    activeTab: 'calendario',
    onTabChange: fn(),
  },
}

export const Completo: Story = {
  name: 'Completo — voltar + breadcrumb + extra',
  args: {
    title: 'Detalhes do Merchant',
    breadcrumb: 'Merchants / Loja Alpha LTDA',
    onBack: fn(),
    extra: (
      <>
        <Button variant="secondary">Suspender</Button>
        <Button variant="primary">Editar</Button>
      </>
    ),
  },
}
