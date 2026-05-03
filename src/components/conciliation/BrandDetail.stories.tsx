import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import BrandDetail from './BrandDetail'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const meta: Meta<typeof BrandDetail> = {
  title: 'Conciliation/BrandDetail',
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
    transactions: { sourceA: 1240, sourceB: 1240 },
    tpv: { sourceA: 285430.50, sourceB: 285430.50 },
    itc: { sourceA: 5708.61, sourceB: 5708.61 },
  },
  mcMismatch: {
    id: 'cons_002_mc', useConfigId: 'cfg_mastercard_credit', consolidationId: 'cons_002',
    name: 'mastercard', conciliationRate: 99.16, status: 'mismatch',
    transactions: { sourceA: 892, sourceB: 884 },
    tpv: { sourceA: 198320.00, sourceB: 197850.00 },
    itc: { sourceA: 4561.36, sourceB: 4549.55 },
  },
  amexEmpty: {
    id: 'cons_999_amex', useConfigId: 'cfg_amex_unknown', consolidationId: 'cons_999',
    name: 'amex', conciliationRate: 100, status: 'reconciled',
    transactions: { sourceA: 0, sourceB: 0 },
    tpv: { sourceA: 0, sourceB: 0 },
    itc: { sourceA: 0, sourceB: 0 },
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
