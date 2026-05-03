'use client'

import BrandLogo from '@/components/shared/BrandLogo'
import Tag from '@/components/shared/Tag'
import { formatCurrency } from '@/lib/conciliation/formatters'
import { toTagStatus } from '@/lib/conciliation/statusUtils'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import Metric from './Metric'

export interface BrandSummaryCardProps {
  brand: BrandData
}

/**
 * Card de sumário de bandeira exibido no topo do BrandDetail.
 * Mostra logo, status e métricas (Transações / TPV / ITC) em capture × outgoing.
 *
 * Espelha `BrandSummaryCard` do branch LGR-264-recon-acquirer.
 */
export default function BrandSummaryCard({ brand }: BrandSummaryCardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <div style={{ minWidth: 96, display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandLogo brand={brand.name} size={28} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', textTransform: 'capitalize' }}>
          {brand.name}
        </span>
      </div>

      <div style={{ minWidth: 140 }}>
        <Tag status={toTagStatus(brand.status ?? '')} />
      </div>

      <Metric
        label="Transações"
        valuePrimary={brand.transactions.sourceA.toLocaleString('pt-BR')}
        valueSecondary={brand.transactions.sourceB.toLocaleString('pt-BR')}
        firstValue={brand.transactions.sourceA}
        secondValue={brand.transactions.sourceB}
      />
      <Metric
        label="Volume (TPV)"
        valuePrimary={formatCurrency(brand.tpv.sourceA)}
        valueSecondary={formatCurrency(brand.tpv.sourceB)}
        firstValue={brand.tpv.sourceA}
        secondValue={brand.tpv.sourceB}
      />
      <Metric
        label="ITC"
        valuePrimary={formatCurrency(brand.itc.sourceA)}
        valueSecondary={formatCurrency(brand.itc.sourceB)}
        firstValue={brand.itc.sourceA}
        secondValue={brand.itc.sourceB}
      />

      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', fontWeight: 500 }}>Taxa de conciliação</div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          color: brand.conciliationRate >= 100 ? '#52C41A' : brand.conciliationRate >= 95 ? '#FA8C16' : '#FF4D4F',
        }}>
          {brand.conciliationRate.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
