import type { Meta, StoryObj } from '@storybook/react'
import { CreditCard, Inbox, Search } from 'lucide-react'
import EmptyState from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Empty state padrão Yby Front: ícone + título + descrição + CTA opcional, centralizado.',
          '',
          '**Quando usar:**',
          '- Lista/tabela vazia ("Nenhum X cadastrado")',
          '- Resultado de filtro vazio ("Nenhum X encontrado")',
          '- Pré-requisito não atendido ("Configure Y antes de Z")',
          '',
          '**Heurística Nielsen #6 (recognition over recall):** explica o estado e oferece ação.',
          '',
          '**a11y:** `role="status"` para leitor de tela; ícone é decorativo (`aria-hidden`).',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

const Wrapper = (props: React.ComponentProps<typeof EmptyState>) => (
  <div style={{ background: '#F2F4F8', minHeight: '60vh', padding: 24 }}>
    <EmptyState {...props} />
  </div>
)

export const Default: Story = {
  render: () => <Wrapper title="Nenhum dado por aqui ainda" />,
}

export const ComDescricao: Story = {
  name: 'Com descrição',
  render: () => (
    <Wrapper
      title="Nenhuma transação encontrada"
      description="Tente ajustar os filtros de data ou bandeira para ver mais resultados."
    />
  ),
}

export const ComCTA: Story = {
  name: 'Com CTA',
  render: () => (
    <Wrapper
      title="Nenhuma tabela de custos cadastrada"
      description="Cadastre os custos cobrados pelos adquirentes para que a Conciliação possa comparar com os valores liquidados pelas registradoras."
      action={{ label: 'Configurar custos', onClick: () => alert('CTA clicked') }}
    />
  ),
}

export const IconeCustom: Story = {
  name: 'Ícone customizado',
  render: () => (
    <Wrapper
      icon={<CreditCard size={48} />}
      title="Nenhum cartão de crédito vinculado"
      description="Adicione um cartão para realizar pagamentos automáticos."
      action={{ label: 'Adicionar cartão', onClick: () => undefined }}
    />
  ),
}

export const ResultadoBusca: Story = {
  name: 'Resultado de busca vazio',
  render: () => (
    <Wrapper
      icon={<Search size={48} />}
      title='Nenhum merchant encontrado para "Magazine"'
      description="Tente outros termos ou limpe os filtros."
      action={{ label: 'Limpar filtros', type: 'default', onClick: () => undefined }}
    />
  ),
}

export const InboxDefault: Story = {
  name: 'Ícone default (Inbox)',
  render: () => (
    <Wrapper
      icon={<Inbox size={48} />}
      title="Caixa de entrada vazia"
    />
  ),
}
