import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Design System/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Variante visual do botão',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho: sm=24px, md=32px, lg=40px de altura',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento (spinner + disabled)',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
    },
    icon: {
      control: 'select',
      options: [
        undefined, 'plus', 'download', 'search', 'filter', 'settings',
        'chevronDown', 'x', 'arrowLeft', 'logOut', 'userPlus',
      ],
      description: 'Nome do ícone (Icon.tsx)',
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Posição do ícone',
    },
    children: {
      control: 'text',
    },
  },
  args: { onClick: fn() },
  parameters: {
    backgrounds: { default: 'white' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// --- Default controlável ---
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Novo Merchant',
    icon: 'plus',
  },
}

// --- Variantes ---
export const Primary: Story = {
  args: { variant: 'primary', children: 'Confirmar' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ver detalhes' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Excluir merchant' },
}

// --- Tamanhos ---
export const Tamanhos: Story = {
  name: 'Todos os tamanhos',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#fff' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
}

// --- Com ícone ---
export const ComIconeEsquerda: Story = {
  name: 'Com ícone — esquerda',
  args: { variant: 'primary', icon: 'plus', iconPosition: 'left', children: 'Novo Merchant' },
}

export const ComIconeDireita: Story = {
  name: 'Com ícone — direita',
  args: { variant: 'secondary', icon: 'download', iconPosition: 'right', children: 'Exportar CSV' },
}

export const SomenteIcone: Story = {
  name: 'Somente ícone',
  args: { variant: 'secondary', icon: 'filter', 'aria-label': 'Filtrar' },
}

// --- Estados ---
export const Loading: Story = {
  name: 'Estado loading',
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 16, background: '#fff' }}>
      <Button variant="primary"   loading>Salvando...</Button>
      <Button variant="secondary" loading>Carregando</Button>
      <Button variant="danger"    loading>Excluindo</Button>
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Estado disabled',
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 16, background: '#fff' }}>
      <Button variant="primary"   disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost"     disabled>Ghost</Button>
      <Button variant="danger"    disabled>Danger</Button>
    </div>
  ),
}

// --- Todas as variantes juntas ---
export const TodasVariantes: Story = {
  name: 'Todas as variantes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: '#fff' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="primary"   icon="plus">Novo Merchant</Button>
        <Button variant="secondary" icon="download">Exportar</Button>
        <Button variant="ghost">Ver todos</Button>
        <Button variant="danger">Excluir</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="primary"   loading>Salvando...</Button>
        <Button variant="secondary" loading>Carregando</Button>
        <Button variant="primary"   disabled>Indisponível</Button>
        <Button variant="secondary" disabled>Indisponível</Button>
      </div>
    </div>
  ),
}

// --- Uso real — header de página ---
export const UsoRealPageHeader: Story = {
  name: 'Uso real — ações de cabeçalho',
  render: () => (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0',
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(0,0,0,0.85)', fontFamily: 'Roboto' }}>
        Merchants
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" icon="filter" size="md">Filtrar</Button>
        <Button variant="secondary" icon="download" size="md">Exportar</Button>
        <Button variant="primary"   icon="plus"     size="md">Novo Merchant</Button>
      </div>
    </div>
  ),
  decorators: [(Story) => <div style={{ background: '#F2F4F8' }}><Story /></div>],
}
