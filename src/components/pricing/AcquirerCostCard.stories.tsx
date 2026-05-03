import type { Meta, StoryObj } from '@storybook/react'
import AcquirerCostCard from './AcquirerCostCard'
import type { CostItem, Installment } from '@/services/types/pricing.types'

const meta: Meta<typeof AcquirerCostCard> = {
  title: 'Pricing/AcquirerCostCard',
  component: AcquirerCostCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Card colapsável de **Custos** (Cost Blueprint) por adquirente — taxa que o adquirente cobra do sub-adquirente.',
          '',
          '**Vocabulário Tupi:**',
          '- *Cost Blueprint Table*: tabela ativa por adquirente × canal (CP/CNP)',
          '- *Cost Item*: linha de taxa para combinação bandeira × produto × parcelamento',
          '- *Installment*: range de parcelamento (1x, 2-6x, 7-12x, 13+)',
          '- *PricingModel*: MDR (taxa única) | Interchange+ (custo + spread)',
          '- *Channel*: Cartão Presente (POS/TEF) ou Não Presente (Link/Gateway)',
          '',
          '**Read-only.** Em modo de edição os botões viriam habilitados; nesta versão exibe apenas para consulta.',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof AcquirerCostCard>

const NOW = '2026-04-24T12:00:00Z'

const installments: Installment[] = [
  { id: 'i1',     from: 1,  to: 1,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i2_6',   from: 2,  to: 6,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i7_12',  from: 7,  to: 12, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i13',    from: 13, to: 24, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
]

const ci = (id: string, brand: CostItem['card_brand'], product: CostItem['product_type'], inst: string, rate: number): CostItem => ({
  id, acquirer_id: 'adiq', card_brand: brand, product_type: product, installment_id: inst, rate, fee: 0.10,
  types: 'mdr', merchant_id: 'm1', created_at: NOW, updated_at: NOW,
})

const items: CostItem[] = [
  ci('1', 'MASTERCARD', 'debit',  'i1',     0.85),
  ci('2', 'MASTERCARD', 'credit', 'i1',     1.45),
  ci('3', 'MASTERCARD', 'credit', 'i2_6',   2.10),
  ci('4', 'MASTERCARD', 'credit', 'i7_12',  2.85),
  ci('5', 'VISA',       'debit',  'i1',     0.85),
  ci('6', 'VISA',       'credit', 'i1',     1.40),
  ci('7', 'ELO',        'credit', 'i1',     1.55),
  ci('8', 'AMEX',       'credit', 'i1',     2.95),
]

export const AdiqCP: Story = {
  name: 'Adiq — Cartão Presente',
  args: {
    acquirerId: 'adiq', acquirerName: 'Adiq', channel: 'cp', isActive: true,
    costItems: items, installments,
  },
}

export const Inativo: Story = {
  args: {
    acquirerId: 'adiq', acquirerName: 'Adiq', channel: 'cnp', isActive: false,
    costItems: items.slice(0, 4), installments,
  },
}

export const FlatTable: Story = {
  name: 'Tabela plana (sem agrupar por bandeira)',
  args: {
    acquirerId: 'adiq', acquirerName: 'Adiq', channel: 'cp', isActive: true,
    costItems: items, installments, groupByBrand: false,
  },
}
