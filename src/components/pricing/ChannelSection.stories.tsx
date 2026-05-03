import type { Meta, StoryObj } from '@storybook/react'
import ChannelSection, { CHANNELS } from './ChannelSection'
import type { Installment, CostBlueprintTable } from '@/services/types/pricing.types'

const meta: Meta<typeof ChannelSection> = {
  title: 'Pricing/ChannelSection',
  component: ChannelSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Box-canal Tupi: banner com ícone (CreditCard ou ShoppingCart) + descrição (CP/CNP) + lista de adquirentes.',
          '',
          '**CP — Cartão Presente:** habilita Maquininhas POS e TEF.',
          '**CNP — Gateway de Pagamentos:** habilita Link de pagamentos e Gateway ecommerce.',
          '',
          'Cada AcquirerSection dentro contém 5 BrandSections (Mastercard, Visa, Elo, Amex, PIX).',
          '',
          'Espelha `ChannelSection` do branch feat/pricing do yby-ui Tupi.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ChannelSection>

const NOW = '2026-04-24T12:00:00Z'
const installments: Installment[] = [
  { id: 'i1',    from: 1, to: 1, acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'i2_6',  from: 2, to: 6, acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'g1',    from: 1, to: 1, acquirer_id: 'getnet', created_at: NOW, updated_at: NOW },
]

const tablesCP: CostBlueprintTable[] = [
  { id: 'tbl_cp_adiq',   merchant_id: 'm1', acquirer_id: 'adiq',   is_active: true, channel: 'cp', created_at: NOW, updated_at: NOW },
  { id: 'tbl_cp_getnet', merchant_id: 'm1', acquirer_id: 'getnet', is_active: true, channel: 'cp', created_at: NOW, updated_at: NOW },
]

const acquirerNames = { adiq: 'Adiq', getnet: 'GetNet' }

export const CartaoPresente: Story = {
  name: 'CP — Cartão Presente',
  args: {
    channel: CHANNELS[0],
    tables: tablesCP,
    acquirerIds: ['adiq', 'getnet'],
    acquirerNames,
    installments,
  },
}

export const CartaoNaoPresente: Story = {
  name: 'CNP — Cartão Não Presente',
  args: {
    channel: CHANNELS[1],
    tables: [],
    acquirerIds: ['adiq'],
    acquirerNames,
    installments,
  },
}
