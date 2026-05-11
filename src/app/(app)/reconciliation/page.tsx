'use client'

import PageHeader from '@/components/shared/PageHeader'
import ConciliationModulesGrid from '@/components/conciliation/ConciliationModulesGrid'

export default function ReconciliationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Conciliação"
        breadcrumb="Sub-adquirente / Conciliação"
        onBack={null}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8' }}>
        <ConciliationModulesGrid />
      </div>
    </div>
  )
}
