import type { Meta, StoryObj } from '@storybook/react'
import ConciliationBadge from './ConciliationBadge'

const meta: Meta<typeof ConciliationBadge> = {
  title: 'Conciliation/ConciliationBadge',
  component: ConciliationBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge grande Tupi com ícone (CheckCircle / Warning) + label. Verde para `reconciled`, amarelo para outros estados. Usado no `AcquirerSummaryCard` e `BrandSummaryCard`. Espelha `ConciliationBadge` do branch LGR-264-recon-acquirer.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ConciliationBadge>

export const Reconciliado: Story = { args: { statusText: 'reconciled' } }
export const ParcialmenteConciliado: Story = { args: { statusText: 'partially_reconciled' } }
export const Divergente: Story = { args: { statusText: 'mismatch' } }
export const NaoConciliado: Story = { args: { statusText: 'not_reconciled' } }
export const Pequeno: Story = { args: { statusText: 'reconciled', size: 'sm' } }
