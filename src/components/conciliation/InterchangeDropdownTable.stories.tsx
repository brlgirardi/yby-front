import type { Meta, StoryObj } from '@storybook/react'
import InterchangeDropdownTable from './InterchangeDropdownTable'
import type { InterchangeRecord } from '@/services/types/brandDetail.types'

const meta: Meta<typeof InterchangeDropdownTable> = {
  title: 'Conciliation/InterchangeDropdownTable',
  component: InterchangeDropdownTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Lista de IRDs (group codes) consolidados para uma combinação use_config_id × data.',
          '',
          '**Vocabulário Tupi:**',
          '- *IRD* = Interchange Reimbursement Data (código de classificação Visa/MC)',
          '- *Incoming* = capture (origem A — sub registrou)',
          '- *Outgoing* = registradora (origem B — Núclea/CIP/CERC liquidou)',
          '',
          'Cada linha com 5 colunas: [IRD] [vazio] [Incoming] [Outgoing] [chevron]. Click leva ao Drawer de detalhes (transações divergentes do IRD).',
          '',
          '**Variantes:** `divergent` (fundo amarelo + valores em vermelho) e `conciliated` (fundo verde + valores em verde).',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof InterchangeDropdownTable>

const divergent: InterchangeRecord[] = [
  {
    consolidationId: 'cons_002_g1', interchangeCode: 'A', conciliationRate: 99.34,
    transactions: { sourceA: 612, sourceB: 608 },
    tpv:          { sourceA: 138420.00, sourceB: 137950.00 },
    discounts:    { sourceA: 3183.66, sourceB: 3172.85 },
  },
  {
    consolidationId: 'cons_002_g3', interchangeCode: 'C', conciliationRate: 95.12,
    transactions: { sourceA: 82, sourceB: 78 },
    tpv:          { sourceA: 15080.00, sourceB: 15080.00 },
    discounts:    { sourceA: 346.84, sourceB: 344.84 },
  },
]

const conciliated: InterchangeRecord[] = [
  {
    consolidationId: 'cons_001_g1', interchangeCode: 'A', conciliationRate: 100,
    transactions: { sourceA: 680, sourceB: 680 },
    tpv:          { sourceA: 158420.10, sourceB: 158420.10 },
    discounts:    { sourceA: 3168.40, sourceB: 3168.40 },
  },
  {
    consolidationId: 'cons_001_g2', interchangeCode: 'B', conciliationRate: 100,
    transactions: { sourceA: 410, sourceB: 410 },
    tpv:          { sourceA: 102330.00, sourceB: 102330.00 },
    discounts:    { sourceA: 2046.60, sourceB: 2046.60 },
  },
]

export const Divergentes: Story = {
  args: { records: divergent, variant: 'divergent', onRowClick: r => alert(`Drill IRD ${r.interchangeCode}`) },
}

export const Conciliados: Story = {
  args: { records: conciliated, variant: 'conciliated', onRowClick: r => alert(`Drill IRD ${r.interchangeCode}`) },
}

export const Vazio: Story = {
  args: { records: [], variant: 'divergent' },
}
