import type { Meta, StoryObj } from '@storybook/react'
import BoxPrice from './BoxPrice'
import type { CostRow } from './MethodTable'

const meta: Meta<typeof BoxPrice> = {
  title: 'Pricing/BoxPrice',
  component: BoxPrice,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Tabela editável de preços vendidos aos ECs. Cada linha herda o custo do `CostRow` correspondente e permite editar a margem (Sua taxa %) e tarifa fixa (Seu fee R$).',
          '',
          '**Coluna preço final:** texto azul "ITC + N% [+ R$ M]" derivado dos campos editáveis.',
          '',
          'Inputs editáveis usam o **ShiftInput** Tupi (digite só dígitos, vírgula desloca: 1 → 0,01 → 0,10 → 1,00).',
          '',
          'Espelha `BoxPrice` do branch feat/pricing do yby-ui Tupi.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof BoxPrice>

const costRows: CostRow[] = [
  { key: 'r1', methodKey: 'pre_paid',  label: 'Pré-pago',         product_type: 'pre_paid', installments: 1, installment_id: 'i1', rate: 0.85, fee: 0.10 },
  { key: 'r2', methodKey: 'debit',     label: 'Débito à vista',   product_type: 'debit',    installments: 1, installment_id: 'i1', rate: 0.85, fee: 0.10 },
  { key: 'r3', methodKey: 'credit_1',  label: 'Crédito à vista',  product_type: 'credit',   installments: 1, installment_id: 'i1', rate: 1.45, fee: 0.10 },
  { key: 'r4', methodKey: 'credit_2_6', label: 'Crédito 2 a 6x',  product_type: 'credit',   installments: 2, installment_id: 'i2', rate: 2.10, fee: 0.10 },
  { key: 'r5', methodKey: 'credit_7_12', label: 'Crédito 7 a 12x', product_type: 'credit',   installments: 7, installment_id: 'i3', rate: 2.85, fee: 0.10 },
]

const Wrapper = () => (
  <div style={{ width: 800, padding: 16, background: '#fff' }}>
    <BoxPrice costRows={costRows} />
  </div>
)

export const Default: Story = { render: () => <Wrapper /> }

export const SoCredito: Story = {
  name: 'Apenas crédito',
  render: () => (
    <div style={{ width: 800, padding: 16, background: '#fff' }}>
      <BoxPrice costRows={costRows.filter(r => r.product_type === 'credit')} />
    </div>
  ),
}
