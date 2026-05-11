import type { Meta, StoryObj } from '@storybook/react'
import CardSection from './CardSection'

const meta: Meta<typeof CardSection> = {
  title: 'Design System/Molecules/CardSection',
  component: CardSection,
  parameters: {
    docs: {
      description: {
        component:
          'Bloco padrão para conteúdo de tela (dashboards, drawers, detalhe). Header com ícone + título + linha divisória, body com padding consistente. Reage ao tema Tupi/Vero (cor do ícone). Substitui o pattern `<div border-bottom>` espalhado pelo app.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof CardSection>

export const Default: Story = {
  args: {
    title: 'Volume mensal por bandeira',
    icon: 'barChart',
    children: (
      <div style={{ height: 220, display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,0.35)', fontSize: 13 }}>
        [conteúdo / chart]
      </div>
    ),
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Cobertura analítica',
    subtitle: 'Distribuição da elegibilidade ao longo do funil de conciliação',
    icon: 'filter',
    children: (
      <div style={{ height: 180, display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,0.35)' }}>
        [waterfall]
      </div>
    ),
  },
}

export const WithExtra: Story = {
  args: {
    title: 'Formas de pagamento',
    icon: 'creditCard',
    extra: (
      <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Valor em R$ <input type="checkbox" />
      </span>
    ),
    children: (
      <div style={{ height: 200, display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,0.35)' }}>
        [bar list]
      </div>
    ),
  },
}

export const NoBodyPadding: Story = {
  args: {
    title: 'Top 10 cartões',
    icon: 'trendingUp',
    noBodyPadding: true,
    children: (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#FAFAFA' }}>
            <th style={{ padding: '10px 16px', textAlign: 'left' }}>Cartão</th>
            <th style={{ padding: '10px 16px', textAlign: 'right' }}>Volume</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((n) => (
            <tr key={n}>
              <td style={{ padding: '10px 16px', borderTop: '1px solid #f5f5f5' }}>Mastercard Gold #{n}</td>
              <td style={{ padding: '10px 16px', borderTop: '1px solid #f5f5f5', textAlign: 'right' }}>
                {(n * 1234).toLocaleString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
}

export const ManyInGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16, background: '#F5F5F5' }}>
      <CardSection title="KPI · TPV" icon="trendingUp">
        <div style={{ height: 100, display: 'grid', placeItems: 'center' }}>R$ 1,2M</div>
      </CardSection>
      <CardSection title="KPI · Conversão" icon="checkCircle">
        <div style={{ height: 100, display: 'grid', placeItems: 'center' }}>93,4%</div>
      </CardSection>
      <CardSection title="Volume por bandeira" icon="barChart" subtitle="Últimos 30 dias">
        <div style={{ height: 200, display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,0.35)' }}>[chart]</div>
      </CardSection>
      <CardSection title="Top ECs" icon="users">
        <div style={{ height: 200, display: 'grid', placeItems: 'center', color: 'rgba(0,0,0,0.35)' }}>[lista]</div>
      </CardSection>
    </div>
  ),
}
