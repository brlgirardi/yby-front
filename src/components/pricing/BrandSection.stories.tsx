import type { Meta, StoryObj } from '@storybook/react'
import BrandSection from './BrandSection'
import type { Installment } from '@/services/types/pricing.types'

const meta: Meta<typeof BrandSection> = {
  title: 'Pricing/BrandSection',
  component: BrandSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Box-bandeira: header colapsável com logo + toggle "Custo único por bandeira".',
          '',
          'Quando o toggle está **ON**, mostra `MethodTable` direto. Quando **OFF**, exibe os 3 grupos MCC (Fuel / Retail / Travel) — cada um com seu próprio MethodTable e opção de visualizar por MCC individual.',
          '',
          'Espelha `BrandSection` do branch feat/pricing do yby-ui Tupi.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof BrandSection>

const NOW = '2026-04-24T12:00:00Z'
const installments: Installment[] = [
  { id: 'i1',     from: 1,  to: 1,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i2_6',   from: 2,  to: 6,  acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
  { id: 'i7_12',  from: 7,  to: 12, acquirer_id: 'adiq', created_at: NOW, updated_at: NOW },
]

export const Mastercard: Story = {
  args: { brand: 'MASTERCARD', acquirerId: 'adiq', installments, defaultOpen: true },
}

export const Visa: Story = {
  args: { brand: 'VISA', acquirerId: 'adiq', installments, defaultOpen: true },
}

export const Elo: Story = {
  args: { brand: 'ELO', acquirerId: 'adiq', installments, defaultOpen: true },
}

export const Amex: Story = {
  args: { brand: 'AMEX', acquirerId: 'adiq', installments, defaultOpen: true },
}

export const PIX: Story = {
  args: { brand: 'PIX', acquirerId: 'adiq', installments, defaultOpen: true },
}

export const FechadoDefault: Story = {
  name: 'Fechado por default',
  args: { brand: 'MASTERCARD', acquirerId: 'adiq', installments, defaultOpen: false },
}
