import type { Meta, StoryObj } from '@storybook/react'
import ConciliationSkeleton from './ConciliationSkeleton'

const meta: Meta<typeof ConciliationSkeleton> = {
  title: 'Conciliation/ConciliationSkeleton',
  component: ConciliationSkeleton,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Skeleton estruturado para o módulo de Conciliação. Replica a forma das telas Overview e Detail com shimmer animado.',
          '',
          '**Heurística:** Nielsen #1 (visibilidade do status do sistema). Mostra a "forma" da página antes do conteúdo carregar — reduz ansiedade em conexões lentas.',
          '',
          '**a11y:** wrapper tem `aria-busy="true"` e `aria-label` descritivo. Bloquinhos shimmer são `aria-hidden="true"` para leitor de tela.',
          '',
          'Usado em `ConciliationOverview` e `BrandDetail` quando `loading=true`.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConciliationSkeleton>

const Wrapper = ({ variant }: { variant: 'overview' | 'detail' }) => (
  <div style={{ background: '#F2F4F8', minHeight: '100vh' }}>
    <ConciliationSkeleton variant={variant} />
  </div>
)

export const Overview: Story = {
  name: 'Overview (lista de bandeiras)',
  render: () => <Wrapper variant="overview" />,
}

export const Detail: Story = {
  name: 'Detail (drill-down de IRDs)',
  render: () => <Wrapper variant="detail" />,
}
