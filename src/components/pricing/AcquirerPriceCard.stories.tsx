import type { Meta, StoryObj } from '@storybook/react'
import AcquirerPriceCard from './AcquirerPriceCard'
import type { CostItem, Installment, PriceItem } from '@/services/types/pricing.types'

const meta: Meta<typeof AcquirerPriceCard> = {
  title: 'Pricing/AcquirerPriceCard',
  component: AcquirerPriceCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Card colapsável de **Preços** (Price Blueprint) por adquirente — taxa que o sub-adquirente cobra dos ECs.',
          '',
          '**Fórmula Tupi:** `preço final = custo + margem (em pontos percentuais)`',
          '',
          '- *Custo* (cinza): vem do Cost Item (taxa cobrada pelo adquirente)',
          '- *Margem* (roxo): pp adicionados pelo sub — sua receita',
          '- *Preço final* (verde): o que o EC paga',
          '',
          'A margem é em **pontos percentuais (pp)**, não percentual sobre o custo. Ex: custo 1,45% + margem 1,00pp = preço 2,45% (não 2,90%).',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof AcquirerPriceCard>

const NOW = '2026-04-24T12:00:00Z'

const installments: Installment[] = [
  { id: 'i1',     from: 1,  to: 1,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i2_6',   from: 2,  to: 6,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i7_12',  from: 7,  to: 12, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
]

const cost = (id: string, brand: CostItem['card_brand'], product: CostItem['product_type'], inst: string, rate: number): CostItem => ({
  id, acquirer_id: 'adiq', card_brand: brand, product_type: product, installment_id: inst, rate, fee: 0.10,
  types: 'mdr', merchant_id: 'm1', created_at: NOW, updated_at: NOW,
})

const costItems: CostItem[] = [
  cost('c1', 'MASTERCARD', 'debit',  'i1',   0.85),
  cost('c2', 'MASTERCARD', 'credit', 'i1',   1.45),
  cost('c3', 'MASTERCARD', 'credit', 'i2_6', 2.10),
  cost('c4', 'VISA',       'debit',  'i1',   0.85),
  cost('c5', 'VISA',       'credit', 'i1',   1.40),
  cost('c6', 'VISA',       'credit', 'i7_12',2.80),
]

const priceItems: PriceItem[] = costItems.map((c, i) => {
  const margin = c.product_type === 'debit' ? 0.50 : 1.00
  return {
    id: `p${i}`, cost_items_id: c.id, margin, rate: c.rate + margin,
    fee: c.fee, created_at: NOW, updated_at: NOW,
  }
})

export const AdiqCP: Story = {
  name: 'Adiq — Cartão Presente',
  args: { acquirerId: 'adiq', acquirerName: 'Adiq', channel: 'cp', isActive: true, costItems, priceItems, installments },
}

export const Inativo: Story = {
  args: { acquirerId: 'adiq', acquirerName: 'Adiq', channel: 'cnp', isActive: false, costItems, priceItems, installments },
}
