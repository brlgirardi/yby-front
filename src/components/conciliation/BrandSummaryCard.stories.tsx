import type { Meta, StoryObj } from '@storybook/react'
import BrandSummaryCard from './BrandSummaryCard'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof BrandSummaryCard> = {
  title: 'Conciliation/BrandSummaryCard',
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
  transactions: { sourceA: 1240, sourceB: 1240 },
  tpv: { sourceA: 285430.50, sourceB: 285430.50 },
  itc: { sourceA: 5708.61, sourceB: 5708.61 },
}

const mismatch: BrandData = {
  id: 'cons_002_mc', useConfigId: 'cfg_mc_credit', consolidationId: 'cons_002',
  name: 'mastercard', conciliationRate: 99.16, status: 'mismatch',
  transactions: { sourceA: 892, sourceB: 884 },
  tpv: { sourceA: 198320.00, sourceB: 197850.00 },
  itc: { sourceA: 4561.36, sourceB: 4549.55 },
}

export const Reconciliado: Story = { args: { brand: reconciled } }
export const Divergencia: Story = { name: 'Divergência', args: { brand: mismatch } }
