'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import ConciliationOverview from '@/components/conciliation/ConciliationOverview'
import BrandDetail from '@/components/conciliation/BrandDetail'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export default function ReconciliationPage() {
  const [view, setView] = useState<'overview' | 'detail'>('overview')
  const [date, setDate] = useState<string>('2026-04-24') // mock fixture date
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null)

  const handleBrandClick = (brand: BrandData) => {
    setSelectedBrand(brand)
    setView('detail')
  }

  const handleBack = () => {
    setView('overview')
    setSelectedBrand(null)
  }

  // Breadcrumb dinâmico — em drill-down mostra "...> [Bandeira]" para
  // contexto histórico (Nielsen #3 controle do usuário + #6 reconhecimento).
  const breadcrumb = view === 'detail' && selectedBrand
    ? `Financeiro / Conciliação / ${selectedBrand.name.charAt(0).toUpperCase() + selectedBrand.name.slice(1)}`
    : 'Financeiro / Conciliação'

  // Em drill-down, o título pode mostrar a bandeira para reforçar onde estamos
  const title = view === 'detail' && selectedBrand
    ? `Conciliação · ${selectedBrand.name.charAt(0).toUpperCase() + selectedBrand.name.slice(1)}`
    : 'Conciliação'

  // onBack do header: em overview = null (raiz do menu), em detail = handleBack
  const onBackProp = view === 'detail' ? handleBack : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title={title}
        breadcrumb={breadcrumb}
        onBack={onBackProp}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8' }}>
        {view === 'overview' && (
          <ConciliationOverview
            date={date}
            onDateChange={setDate}
            onBrandClick={handleBrandClick}
          />
        )}
        {view === 'detail' && selectedBrand && (
          <BrandDetail
            brand={selectedBrand}
            date={date}
            onDateChange={setDate}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

// Avoid unused warning for TODAY_ISO in case mock date is replaced.
void TODAY_ISO
