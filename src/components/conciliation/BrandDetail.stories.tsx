import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import BrandDetail from './BrandDetail'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof BrandDetail> = {
  title: 'Design System/Organisms/Conciliation/BrandDetail',
  component: BrandDetail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Tela de detalhe da conciliação por bandeira (drill-down). Estrutura completa:',
          '',
          '1. **Header** com voltar, identificação (nome, useConfigId) e botão Exportar CSV',
          '2. **DateScroller** — 7 dias selecionáveis sem voltar pro Overview',
          '3. **BrandSummaryCard** — resumo capture × outgoing',
          '4. **Filtros** — busca por IRD + select de status',
          '5. **Lista de IRDs** dividida em colapsos: Divergências (amarelo) + Conciliados (verde)',
          '6. **Drawer InterchangeDetailModal** ao clicar num IRD — transação-a-transação',
          '',
          'Espelha `BrandDetail` do branch LGR-264-recon-acquirer.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof BrandDetail>

const brands: Record<string, BrandData> = {
  visaReconciled: {
    id: 'cons_001_visa', useConfigId: 'cfg_visa_credit', consolidationId: 'cons_001',
    name: 'visa', conciliationRate: 100, status: 'reconciled',
    transactions: { total: 1240, reconciled: 1240, divergent: 0, pending: 0 },
    tpv: { total: 285430.50, reconciled: 285430.50, divergent: 0, pending: 0 },
    itc: { total: 5708.61, reconciled: 5708.61, divergent: 0, pending: 0 },
  },
  mcMismatch: {
    id: 'cons_002_mc', useConfigId: 'cfg_mastercard_credit', consolidationId: 'cons_002',
    name: 'mastercard', conciliationRate: 89.69, status: 'mismatch',
    transactions: { total: 892, reconciled: 800, divergent: 50, pending: 42 },
    tpv: { total: 198320.00, reconciled: 178650.00, divergent: 11420.00, pending: 8250.00 },
    itc: { total: 4561.36, reconciled: 4108.95, divergent: 262.66, pending: 189.75 },
  },
  amexEmpty: {
    id: 'cons_999_amex', useConfigId: 'cfg_amex_unknown', consolidationId: 'cons_999',
    name: 'amex', conciliationRate: 100, status: 'reconciled',
    transactions: { total: 0, reconciled: 0, divergent: 0, pending: 0 },
    tpv: { total: 0, reconciled: 0, divergent: 0, pending: 0 },
    itc: { total: 0, reconciled: 0, divergent: 0, pending: 0 },
  },
}

const Wrapper = ({ brand }: { brand: BrandData }) => {
  const [date, setDate] = useState('2026-04-24')
  return (
    <div style={{ background: '#F2F4F8', minHeight: '100vh' }}>
      <BrandDetail brand={brand} date={date} onDateChange={setDate} onBack={() => alert('voltar')} />
    </div>
  )
}

export const VisaConciliada: Story = {
  name: 'Visa — 100% conciliada',
  render: () => <Wrapper brand={brands.visaReconciled} />,
}

export const MastercardComDivergencias: Story = {
  name: 'Mastercard com divergências',
  render: () => <Wrapper brand={brands.mcMismatch} />,
}

export const AmexSemDados: Story = {
  name: 'Amex sem IRDs (empty)',
  render: () => <Wrapper brand={brands.amexEmpty} />,
}
