import type { Meta, StoryObj } from '@storybook/react'
import AcquirerSummaryCard from './AcquirerSummaryCard'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof AcquirerSummaryCard> = {
  title: 'Design System/Organisms/Conciliation/AcquirerSummaryCard',
  component: AcquirerSummaryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Card de sumário de conciliação por bandeira (1 linha = 1 bandeira × tipo de transação).',
          '',
          '**Vocabulário Tupi:**',
          '- *Capture (source A)*: o que o sub registrou no fluxo de captura.',
          '- *Outgoing (source B)*: o que a registradora (Núclea/CIP/CERC) liquidou.',
          '- *TPV*: Total Payment Volume.',
          '- *ITC*: Interchange Transaction Cost (taxa cobrada pela bandeira).',
          '- *Taxa de conciliação*: % de match entre as duas origens.',
          '',
          '**Cores da taxa:** verde (≥100%), laranja (≥95%), vermelho (<95%). Quando capture e outgoing divergem, o valor secundário é destacado em vermelho.',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof AcquirerSummaryCard>

const reconciledBrand: BrandData = {
  id: 'cons_001_cfg_visa_credit',
  useConfigId: 'cfg_visa_credit',
  consolidationId: 'cons_001',
  name: 'visa',
  conciliationRate: 100,
  status: 'reconciled',
  transactions: { total: 1240, reconciled: 1240, divergent: 0, pending: 0 },
  tpv: { total: 285430.50, reconciled: 285430.50, divergent: 0, pending: 0 },
  itc: { total: 5708.61, reconciled: 5708.61, divergent: 0, pending: 0 },
}

const mismatchBrand: BrandData = {
  id: 'cons_002_cfg_mc',
  useConfigId: 'cfg_mastercard_credit',
  consolidationId: 'cons_002',
  name: 'mastercard',
  conciliationRate: 89.69,
  status: 'mismatch',
  transactions: { total: 892, reconciled: 800, divergent: 50, pending: 42 },
  tpv: { total: 198320.00, reconciled: 178650.00, divergent: 11420.00, pending: 8250.00 },
  itc: { total: 4561.36, reconciled: 4108.95, divergent: 262.66, pending: 189.75 },
}

const partialBrand: BrandData = {
  id: 'cons_003_cfg_elo',
  useConfigId: 'cfg_elo_debit',
  consolidationId: 'cons_003',
  name: 'elo',
  conciliationRate: 99.71,
  status: 'partially_reconciled',
  transactions: { total: 412, reconciled: 410, divergent: 2, pending: 0 },
  tpv: { total: 76420, reconciled: 76200, divergent: 220, pending: 0 },
  itc: { total: 916.72, reconciled: 914.40, divergent: 2.32, pending: 0 },
}

export const Reconciliado: Story = {
  args: { brand: reconciledBrand, onClick: () => alert('Drill-down') },
}

export const Divergencia: Story = {
  name: 'Divergência (mismatch)',
  args: { brand: mismatchBrand, onClick: () => alert('Drill-down') },
}

export const ParcialmenteConciliado: Story = {
  name: 'Parcialmente conciliado',
  args: { brand: partialBrand, onClick: () => alert('Drill-down') },
}

export const SemClique: Story = {
  name: 'Sem onClick (read-only)',
  args: { brand: reconciledBrand },
}
