import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import DateScroller from './DateScroller'

const meta: Meta<typeof DateScroller> = {
  title: 'Conciliation/DateScroller',
  component: DateScroller,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Seletor horizontal de data para o módulo de Conciliação. 7 cards (3 antes + selecionado + 3 depois) com label "HOJE" para o dia atual. Setas laterais andam de 7 em 7 dias. Espelha `DateCard` + `DateRangePicker` do branch LGR-264-recon-acquirer.',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof DateScroller>

const Wrapper = () => {
  const today = new Date().toISOString().slice(0, 10)
  const [v, setV] = useState(today)
  return (
    <div style={{ width: 720, padding: 24, background: '#F2F4F8' }}>
      <DateScroller value={v} onChange={setV} />
      <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Selecionado: {v}</div>
    </div>
  )
}

export const Default: Story = { render: () => <Wrapper /> }
