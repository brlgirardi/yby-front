import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import TableTabsBar, { type TableTab } from './TableTabsBar'

const meta: Meta<typeof TableTabsBar> = {
  title: 'Pricing/TableTabsBar',
  component: TableTabsBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Barra de abas dinâmicas para múltiplas tabelas — usado em `/pricing/prices`.',
          '',
          'Espelha o padrão do branch feat/pricing do yby-ui Tupi (commit `a3326d8` "two-row header" + `f54d97a` "delete confirmation modal" + `5990a1b` "tabela padrão + edição inline").',
          '',
          '**Comportamento:**',
          '- Click no nome da aba → vira input editável (Enter confirma, Esc cancela)',
          '- Botão "+" no fim para adicionar (gera "Tabela N" sequencial)',
          '- "×" em cada aba (oculto se for a única) abre modal de confirmação',
          '',
          '**Acessibilidade:** `role="tablist"`/`role="tab"`/`aria-selected`, `aria-label` no input de edição e botões de ação.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof TableTabsBar>

const Wrapper = ({ initial }: { initial: TableTab[] }) => {
  const [tabs, setTabs] = useState(initial)
  const [activeId, setActiveId] = useState(initial[0]?.id ?? null)

  const addTab = () => {
    const numbers = tabs
      .map(t => /^Tabela (\d+)$/.exec(t.name)?.[1])
      .filter((n): n is string => Boolean(n))
      .map(Number)
    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : tabs.length + 1
    const novo: TableTab = { id: `tab-${Date.now()}`, name: `Tabela ${nextNumber}` }
    setTabs(prev => [...prev, novo])
    setActiveId(novo.id)
  }

  const renameTab = (id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t))
  }

  const deleteTab = (id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id)
      if (activeId === id && next.length > 0) setActiveId(next[0].id)
      return next
    })
  }

  return (
    <div style={{ width: 720, padding: 16, background: '#fff' }}>
      <TableTabsBar
        tabs={tabs}
        activeId={activeId}
        onChangeActive={setActiveId}
        onAdd={addTab}
        onRename={renameTab}
        onDelete={deleteTab}
      />
      <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(0,0,0,0.45)', fontFamily: 'Roboto Mono' }}>
        Ativa: {activeId} | Total: {tabs.length}
      </div>
    </div>
  )
}

export const TresTabelas: Story = {
  name: '3 tabelas (padrão)',
  render: () => <Wrapper initial={[
    { id: '1', name: 'Tabela Padrão' },
    { id: '2', name: 'Varejão Premium' },
    { id: '3', name: 'ECs Pequenos' },
  ]} />,
}

export const UmaTabela: Story = {
  name: 'Uma tabela (não pode excluir)',
  render: () => <Wrapper initial={[{ id: '1', name: 'Tabela 1' }]} />,
}

export const MuitasTabelas: Story = {
  name: 'Muitas tabelas (wrap)',
  render: () => <Wrapper initial={Array.from({ length: 8 }).map((_, i) => ({
    id: String(i + 1),
    name: `Tabela ${i + 1}`,
  }))} />,
}
