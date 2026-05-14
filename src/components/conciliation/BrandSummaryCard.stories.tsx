import type { Meta, StoryObj } from '@storybook/react'
import BrandSummaryCard from './BrandSummaryCard'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof BrandSummaryCard> = {
  title: 'Design System/Organisms/Conciliation/BrandSummaryCard',
  component: BrandSummaryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card de sumário no topo do BrandDetail. Mesma estrutura do AcquirerSummaryCard mas sem onClick (já estamos no detalhe). Espelha `BrandSummaryCard` do branch LGR-264-recon-acquirer.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof BrandSummaryCard>

const reconciled: BrandData = {
  id: 'cons_001_visa', useConfigId: 'cfg_visa_credit', consolidationId: 'cons_001',
  name: 'visa', conciliationRate: 100, status: 'reconciled',
  transactions: { total: 1240, reconciled: 1240, divergent: 0, pending: 0 },
  tpv: { total: 285430.50, reconciled: 285430.50, divergent: 0, pending: 0 },
  itc: { total: 5708.61, reconciled: 5708.61, divergent: 0, pending: 0 },
}

const mismatch: BrandData = {
  id: 'cons_002_mc', useConfigId: 'cfg_mc_credit', consolidationId: 'cons_002',
  name: 'mastercard', conciliationRate: 89.69, status: 'mismatch',
  transactions: { total: 892, reconciled: 800, divergent: 50, pending: 42 },
  tpv: { total: 198320.00, reconciled: 178650.00, divergent: 11420.00, pending: 8250.00 },
  itc: { total: 4561.36, reconciled: 4108.95, divergent: 262.66, pending: 189.75 },
}

export const Reconciliado: Story = { args: { brand: reconciled } }
export const Divergencia: Story = { name: 'Divergência', args: { brand: mismatch } }
