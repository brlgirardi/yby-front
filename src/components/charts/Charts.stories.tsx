import type { Meta, StoryObj } from '@storybook/react'
import {
  LineKPI,
  MultiLineKPI,
  DonutBreakdown,
  BarList,
  WaterfallChart,
  HeatmapGrid,
} from './index'
import CardSection from '../shared/CardSection'

const meta: Meta = {
  title: 'Design System/Organisms/Charts/Recharts wrappers',
  parameters: {
    docs: {
      description: {
        component:
          'Wrappers tematáveis sobre Recharts. Cor primária reativa ao tema (Tupi/Vero). Tooltip, eixos, grid e fonte unificados. Use sempre em conjunto com `<CardSection>` no dashboard.',
      },
    },
  },
}
export default meta

const tpv = Array.from({ length: 12 }).map((_, i) => ({
  label: `${(i + 1).toString().padStart(2, '0')}/05`,
  value: 1_200_000 + Math.round(Math.random() * 800_000),
}))

const bandeiraTimeline = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'].map((mes, i) => ({
  mes,
  mastercard: 100 + i * 15 + Math.round(Math.random() * 20),
  visa:        80 + i * 12 + Math.round(Math.random() * 15),
  elo:         40 + i * 5  + Math.round(Math.random() * 10),
}))

const formas = [
  { label: 'Cartão de crédito', value: 99 },
  { label: 'Pix',                value: 41 },
  { label: 'Cartão de débito',   value: 22 },
  { label: 'Boleto',             value: 8 },
]

const waterfall = [
  { label: 'Total transações',           value: 100, tone: 'positive' as const },
  { label: 'Sem MCC',                    value: -12, tone: 'negative' as const },
  { label: 'Sem categoria de cartão',    value: -8,  tone: 'negative' as const },
  { label: 'Cobertura final',            value: 80,  tone: 'final'    as const },
]

const heatmap = [
  { row: 'Supermercado',  col: 'Entry',   value: 45 },
  { row: 'Supermercado',  col: 'Mid',     value: 30 },
  { row: 'Supermercado',  col: 'Premium', value: 18 },
  { row: 'Supermercado',  col: 'Ultra',   value: 7  },
  { row: 'Restaurante',   col: 'Entry',   value: 22 },
  { row: 'Restaurante',   col: 'Mid',     value: 38 },
  { row: 'Restaurante',   col: 'Premium', value: 28 },
  { row: 'Restaurante',   col: 'Ultra',   value: 12 },
  { row: 'Posto',         col: 'Entry',   value: 65 },
  { row: 'Posto',         col: 'Mid',     value: 25 },
  { row: 'Posto',         col: 'Premium', value: 8  },
  { row: 'Posto',         col: 'Ultra',   value: 2  },
]

export const Line: StoryObj = {
  render: () => (
    <CardSection title="TPV — últimos 12 dias" icon="trendingUp" subtitle="Volume total transacionado">
      <LineKPI data={tpv} formatValue={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
    </CardSection>
  ),
}

export const MultiLine: StoryObj = {
  render: () => (
    <CardSection title="Quantidade por bandeira" icon="barChart">
      <MultiLineKPI
        data={bandeiraTimeline}
        xKey="mes"
        series={[
          { key: 'mastercard', label: 'Mastercard' },
          { key: 'visa',       label: 'Visa' },
          { key: 'elo',        label: 'Elo' },
        ]}
      />
    </CardSection>
  ),
}

export const Donut: StoryObj = {
  render: () => (
    <CardSection title="Distribuição por bandeira" icon="filter">
      <DonutBreakdown
        data={[
          { label: 'Mastercard', value: 54.8 },
          { label: 'Visa',       value: 37.4 },
          { label: 'Elo',        value: 7.8  },
        ]}
      />
    </CardSection>
  ),
}

export const Bars: StoryObj = {
  render: () => (
    <CardSection title="Formas de pagamento mais utilizadas" icon="creditCard">
      <BarList data={formas} asPercent />
    </CardSection>
  ),
}

export const Waterfall: StoryObj = {
  render: () => (
    <CardSection title="Cobertura analítica" icon="filter" subtitle="Funil de elegibilidade ITC">
      <WaterfallChart data={waterfall} formatValue={(v) => `${v}%`} />
    </CardSection>
  ),
}

export const Heatmap: StoryObj = {
  render: () => (
    <CardSection title="Platinização por MCC × Tier" icon="grid" noBodyPadding>
      <HeatmapGrid data={heatmap} />
    </CardSection>
  ),
}

export const FullDashboardMock: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16, background: '#F5F5F5' }}>
      <CardSection title="TPV diário" icon="trendingUp">
        <LineKPI data={tpv} formatValue={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
      </CardSection>
      <CardSection title="Distribuição por bandeira" icon="filter">
        <DonutBreakdown data={[
          { label: 'Mastercard', value: 54.8 },
          { label: 'Visa',       value: 37.4 },
          { label: 'Elo',        value: 7.8  },
        ]} />
      </CardSection>
      <CardSection title="Formas de pagamento" icon="creditCard">
        <BarList data={formas} asPercent />
      </CardSection>
      <CardSection title="Cobertura ITC" icon="filter" subtitle="Funil de elegibilidade">
        <WaterfallChart data={waterfall} formatValue={(v) => `${v}%`} />
      </CardSection>
    </div>
  ),
}
