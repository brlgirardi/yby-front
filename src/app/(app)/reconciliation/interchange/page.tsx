'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import ConciliationOverview from '@/components/conciliation/ConciliationOverview'
import BrandDetail from '@/components/conciliation/BrandDetail'
import type { BrandData } from '@/services/types/acquirerSummary.types'

const TODAY_ISO = new Date().toISOString().slice(0, 10)

export default function InterchangePage() {
  const [view, setView] = useState<'overview' | 'detail'>('overview')
  const [date, setDate] = useState<string>('2026-04-24')
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null)

  const handleBrandClick = (brand: BrandData) => {
    setSelectedBrand(brand)
    setView('detail')
  }

  const handleBack = () => {
    setView('overview')
    setSelectedBrand(null)
  }

  const breadcrumb = view === 'detail' && selectedBrand
    ? `Sub-adquirente / Conciliação / Captura vs. Intercâmbio / ${selectedBrand.name.charAt(0).toUpperCase() + selectedBrand.name.slice(1)}`
    : 'Sub-adquirente / Conciliação / Captura vs. Intercâmbio'

  const title = view === 'detail' && selectedBrand
    ? `Captura vs. Intercâmbio · ${selectedBrand.name.charAt(0).toUpperCase() + selectedBrand.name.slice(1)}`
    : 'Captura vs. Intercâmbio'

  const onBackProp = view === 'detail' ? handleBack : undefined

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

void TODAY_ISO
