import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import AppSelect from './AppSelect'

const meta: Meta<typeof AppSelect> = {
  title: 'Design System/Molecules/AppSelect',
  component: AppSelect,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Label acima do select' },
    placeholder: { control: 'text', description: 'Placeholder quando vazio' },
    hint: { control: 'text', description: 'Texto de ajuda abaixo' },
    error: { control: 'text', description: 'Mensagem de erro (ativa estado de erro)' },
    disabled: { control: 'boolean', description: 'Campo desabilitado' },
    mode: {
      control: 'select',
      options: [undefined, 'multiple', 'tags'],
      description: 'Modo de seleção',
    },
    showSearch: { control: 'boolean', description: 'Busca dentro do dropdown' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#F2F4F8', maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AppSelect>

const OPTIONS = [
  { label: 'Visa',       value: 'visa'       },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Elo',        value: 'elo'        },
  { label: 'Amex',       value: 'amex'       },
  { label: 'PIX',        value: 'pix'        },
  { label: 'Boleto',     value: 'boleto'     },
]

const STATUS_OPTIONS = [
  { label: 'Ativo',    value: 'ativo'    },
  { label: 'Suspenso', value: 'suspenso' },
  { label: 'Inativo',  value: 'inativo'  },
]

const LONG_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  label: `Item ${String(i + 1).padStart(2, '0')}`,
  value: `item-${i + 1}`,
}))

// ─── Default controlável ──────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Bandeira',
    placeholder: 'Selecionar bandeira',
    options: OPTIONS,
  },
}

// ─── Single select ────────────────────────────────────────────────────────────

export const SingleSelect: Story = {
  name: 'Single select — com label',
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <AppSelect
        label="Status do merchant"
        placeholder="Selecionar status"
        options={STATUS_OPTIONS}
        value={val}
        onChange={setVal}
      />
    )
  },
}

// ─── Com busca ────────────────────────────────────────────────────────────────

export const ComBusca: Story = {
  name: 'Searchable — busca dentro do dropdown',
  render: () => {
    const [val, setVal] = useState<string | undefined>(undefined)
    return (
      <AppSelect
        label="Bandeira"
        placeholder="Pesquisar..."
        options={OPTIONS}
        value={val}
        onChange={setVal}
        showSearch
        filterOption={(input, option) =>
          (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    )
  },
}

// ─── Multi-select ─────────────────────────────────────────────────────────────

export const MultiSelect: Story = {
  name: 'Multi-select — tags com X',
  render: () => {
    const [val, setVal] = useState<string[]>(['visa', 'mastercard'])
    return (
      <AppSelect<string[]>
        label="Bandeiras aceitas"
        placeholder="Selecionar bandeiras"
        mode="multiple"
        options={OPTIONS}
        value={val}
        onChange={setVal}
      />
    )
  },
}

// ─── Multi-select com busca ───────────────────────────────────────────────────

export const MultiComBusca: Story = {
  name: 'Multi-select + busca — lista longa com scroll',
  render: () => {
    const [val, setVal] = useState<string[]>(['item-1', 'item-2'])
    return (
      <AppSelect<string[]>
        label="Selecionar itens"
        placeholder="Pesquisar e selecionar..."
        mode="multiple"
        showSearch
        options={LONG_OPTIONS}
        value={val}
        onChange={setVal}
        filterOption={(input, option) =>
          (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
        }
        listHeight={200}
      />
    )
  },
}

// ─── Estado de erro ───────────────────────────────────────────────────────────

export const ComErro: Story = {
  name: 'Estado de erro',
  render: () => (
    <AppSelect
      label="MCC"
      placeholder="Selecionar MCC"
      options={OPTIONS}
      error="Campo obrigatório. Selecione um MCC válido."
    />
  ),
}

// ─── Com hint ─────────────────────────────────────────────────────────────────

export const ComHint: Story = {
  name: 'Com texto de ajuda (hint)',
  render: () => (
    <AppSelect
      label="Adquirente padrão"
      placeholder="Selecionar adquirente"
      options={[
        { label: 'Cielo',  value: 'cielo'  },
        { label: 'Rede',   value: 'rede'   },
        { label: 'Getnet', value: 'getnet' },
        { label: 'Adiq',   value: 'adiq'   },
      ]}
      hint="O adquirente padrão será usado para novas transações sem configuração específica."
    />
  ),
}

// ─── Desabilitado ─────────────────────────────────────────────────────────────

export const Desabilitado: Story = {
  name: 'Estado disabled',
  render: () => (
    <AppSelect
      label="Tipo de conta"
      value="visa"
      options={OPTIONS}
      disabled
      hint="Este campo não pode ser alterado."
    />
  ),
}

// ─── Todos os estados juntos ──────────────────────────────────────────────────

export const TodosOsEstados: Story = {
  name: 'Todos os estados — galeria',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AppSelect label="Single"         placeholder="Selecionar" options={OPTIONS} />
      <AppSelect label="Com valor"      options={OPTIONS} value="visa" />
      <AppSelect label="Searchable"     placeholder="Pesquisar..." options={OPTIONS} showSearch />
      <AppSelect label="Multi-select"   mode="multiple" placeholder="Selecionar" options={OPTIONS} />
      <AppSelect label="Com erro"       options={OPTIONS} error="Campo obrigatório" />
      <AppSelect label="Com hint"       options={OPTIONS} hint="Selecione ao menos uma opção" />
      <AppSelect label="Disabled"       options={OPTIONS} value="elo" disabled />
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#F2F4F8', maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
}

// ─── Uso real — filtro de tabela inline ──────────────────────────────────────

export const FiltroInline: Story = {
  name: 'Uso real — filtro inline em toolbar',
  render: () => {
    const [bandeira, setBandeira] = useState<string[]>([])
    const [status, setStatus] = useState<string | undefined>(undefined)
    return (
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <AppSelect<string[]>
          placeholder="Bandeira"
          mode="multiple"
          options={OPTIONS}
          value={bandeira}
          onChange={setBandeira}
          style={{ width: 160 }}
        />
        <AppSelect
          placeholder="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          allowClear
          style={{ width: 140 }}
        />
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginLeft: 'auto' }}>
          {bandeira.length || '—'} bandeiras · Status: {status ?? 'todos'}
        </span>
      </div>
    )
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#F2F4F8' }}>
        <Story />
      </div>
    ),
  ],
}
