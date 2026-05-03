import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import ConciliationOverview from './ConciliationOverview'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof ConciliationOverview> = {
  title: 'Conciliation/ConciliationOverview',
  component: ConciliationOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Tela de visão geral da conciliação. Mostra um sumário (KPIs), DateScroller com botão Exportar CSV, filtros (busca + status + bandeira) e a lista de AcquirerSummaryCards.',
          '',
          'Click num card leva ao BrandDetail (drill-down). Espelha `ConciliationOverview` do branch LGR-264-recon-acquirer.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConciliationOverview>

const Wrapper = () => {
  const [date, setDate] = useState('2026-04-24')
  return (
    <div style={{ background: '#F2F4F8', minHeight: '100vh' }}>
      <ConciliationOverview
        date={date}
        onDateChange={setDate}
        onBrandClick={(b: BrandData) => alert(`Drill-down: ${b.name}`)}
      />
    </div>
  )
}

export const Default: Story = { render: () => <Wrapper /> }
