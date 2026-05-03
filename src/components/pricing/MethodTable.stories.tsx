import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import MethodTable, { type CostRow, buildDefaultRows, buildPaymentMethodOptions } from './MethodTable'
import type { Installment, PricingModel } from '@/services/types/pricing.types'

const meta: Meta<typeof MethodTable> = {
  title: 'Pricing/MethodTable',
  component: MethodTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Tabela editável de métodos de pagamento × taxa de custo. **Centro do módulo Pricing**.',
          '',
          '**Vocabulário Tupi:**',
          '- *MDR*: Merchant Discount Rate (taxa única cobrada pelo adquirente)',
          '- *Interchange Plus*: custo de intercâmbio + spread do adquirente',
          '- *Fee*: tarifa fixa (R$) por transação, opcional',
          '',
          '**Toggles:**',
          '- *Agrupar parcelamentos* — agrupa 2-6x e 7-12x em ranges (vs cada parcela individual)',
          '- *Fee por método* — mostra/oculta coluna Fee R$',
          '- *Replicar custo anterior* — quando adiciona uma linha nova, reaproveita o último custo',
          '',
          'Espelha `MethodTable` do branch feat/pricing do yby-ui Tupi.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MethodTable>

const NOW = '2026-04-24T12:00:00Z'
const installments: Installment[] = [
  { id: 'i1',     from: 1,  to: 1,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i2_6',   from: 2,  to: 6,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i7_12',  from: 7,  to: 12, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i13',    from: 13, to: 24, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
]

const Wrapper = ({ initialFee = true, model = 'mdr' as PricingModel, initial }: { initialFee?: boolean; model?: PricingModel; initial?: CostRow[] }) => {
  const [pricing, setPricing] = useState<PricingModel>(model)
  const [feeEnabled, setFeeEnabled] = useState(initialFee)
  const [rows, setRows] = useState<CostRow[]>(initial ?? buildDefaultRows(buildPaymentMethodOptions(installments)))
  return (
    <div style={{ width: 720, padding: 16, background: '#fff' }}>
      <MethodTable
        pricingType={pricing}
        onPricingTypeChange={setPricing}
        feeEnabled={feeEnabled}
        onFeeEnabledChange={setFeeEnabled}
        rows={rows}
        onRowsChange={setRows}
        installments={installments}
      />
    </div>
  )
}

export const MDRComFee: Story = {
  name: 'MDR com Fee',
  render: () => <Wrapper />,
}

export const MDRSemFee: Story = {
  name: 'MDR sem Fee',
  render: () => <Wrapper initialFee={false} />,
}

export const InterchangePlus: Story = {
  name: 'Interchange Plus',
  render: () => <Wrapper model="interchange_plus" />,
}
