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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Conciliação"
        breadcrumb="Financeiro / Conciliação"
        onBack={null}
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
