import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from 'antd'
import InterchangeDetailModal from './InterchangeDetailModal'
import type { InterchangeRecord } from '@/services/types/brandDetail.types'

const meta: Meta<typeof InterchangeDetailModal> = {
  title: 'Conciliation/InterchangeDetailModal',
  component: InterchangeDetailModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Drawer lateral com o detalhe transação-a-transação de um IRD/group_code.',
          '',
          'Carrega via `useInterchangeDetail(consolidationId)` quando aberto. Estrutura:',
          '- Card de sumário (TPV, ITC, transações; capture × outgoing) com cor de fundo verde (conciliado) ou amarelo (divergente)',
          '- Collapse "Transações divergentes" (se houver)',
          '- Collapse "Transações conciliadas"',
          '',
          'Espelha `InterchangeDetailModal` do branch LGR-264-recon-acquirer.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof InterchangeDetailModal>

const divergentRecord: InterchangeRecord = {
  consolidationId: 'cons_002_g1', interchangeCode: 'A', conciliationRate: 99.34,
  transactions: { sourceA: 612, sourceB: 608 },
  tpv: { sourceA: 138420.00, sourceB: 137950.00 },
  discounts: { sourceA: 3183.66, sourceB: 3172.85 },
}

const Wrapper = ({ record }: { record: InterchangeRecord }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setOpen(true)}>Abrir drawer</Button>
      <InterchangeDetailModal open={open} record={record} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Divergente: Story = {
  render: () => <Wrapper record={divergentRecord} />,
}
