import type { Meta, StoryObj } from '@storybook/react'
import PricingSkeleton from './PricingSkeleton'

const meta: Meta<typeof PricingSkeleton> = {
  title: 'Pricing/PricingSkeleton',
  component: PricingSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Skeleton estruturado para o módulo Pricing. Usa shimmer animado e replica a hierarquia Channel → Acquirer → Brand para que o usuário veja a "forma" da página antes do conteúdo carregar.',
          '',
          '**Heurística:** Nielsen #1 — visibilidade do status do sistema. Em conexões lentas, ver a estrutura reduz ansiedade e dá feedback de progresso.',
          '',
          '**a11y:** wrapper tem `aria-busy="true"` e `aria-label` específico (custos ou preços). Bloquinhos shimmer são `aria-hidden="true"` para leitor de tela.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof PricingSkeleton>

const Wrapper = ({ variant }: { variant: 'costs' | 'prices' }) => (
  <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
    <PricingSkeleton variant={variant} />
  </div>
)

export const Custos: Story = { render: () => <Wrapper variant="costs" /> }
export const Precos: Story = { name: 'Preços', render: () => <Wrapper variant="prices" /> }
