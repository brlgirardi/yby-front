import type { Meta, StoryObj } from '@storybook/react'
import AcquirerSummaryCard from './AcquirerSummaryCard'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof AcquirerSummaryCard> = {
  title: 'Conciliation/AcquirerSummaryCard',
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
  transactions: { sourceA: 1240, sourceB: 1240 },
  tpv: { sourceA: 285430.50, sourceB: 285430.50 },
  itc: { sourceA: 5708.61, sourceB: 5708.61 },
}

const mismatchBrand: BrandData = {
  id: 'cons_002_cfg_mc',
  useConfigId: 'cfg_mastercard_credit',
  consolidationId: 'cons_002',
  name: 'mastercard',
  conciliationRate: 99.16,
  status: 'mismatch',
  transactions: { sourceA: 892, sourceB: 884 },
  tpv: { sourceA: 198320.00, sourceB: 197850.00 },
  itc: { sourceA: 4561.36, sourceB: 4549.55 },
}

const partialBrand: BrandData = {
  id: 'cons_003_cfg_elo',
  useConfigId: 'cfg_elo_debit',
  consolidationId: 'cons_003',
  name: 'elo',
  conciliationRate: 97.13,
  status: 'partially_reconciled',
  transactions: { sourceA: 412, sourceB: 410 },
  tpv: { sourceA: 76420, sourceB: 76200 },
  itc: { sourceA: 916.72, sourceB: 914.40 },
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
