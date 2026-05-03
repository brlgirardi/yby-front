'use client'

import BrandLogo from '@/components/shared/BrandLogo'
import Tag from '@/components/shared/Tag'
import Icon from '@/components/shared/Icon'
import { formatCurrency } from '@/lib/conciliation/formatters'
import { toTagStatus } from '@/lib/conciliation/statusUtils'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import Metric from './Metric'

export interface AcquirerSummaryCardProps {
  brand: BrandData
  onClick?: (brand: BrandData) => void
}

/**
 * Card de sumário de conciliação por bandeira (1 linha = 1 bandeira × tipo).
 * Mostra: logo, status (Tag semântico), métrica de Transações, Volume (TPV)
 * e ITC (custo de intercâmbio) — comparando capture vs outgoing.
 *
 * Click navega para o BrandDetail (drill-down nas transações divergentes).
 */
export default function AcquirerSummaryCard({ brand, onClick }: AcquirerSummaryCardProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      onClick={() => onClick?.(brand)}
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={e => {
        if (!clickable) return
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
        ;(e.currentTarget as HTMLElement).style.borderColor = '#91d5ff'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'
        ;(e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0'
      }}
    >
      {/* Logo da bandeira */}
      <div style={{ minWidth: 96, display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandLogo brand={brand.name} size={28} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', textTransform: 'capitalize' }}>
          {brand.name}
        </span>
      </div>

      {/* Status semântico */}
      <div style={{ minWidth: 140 }}>
        <Tag status={toTagStatus(brand.status ?? '')} />
      </div>

      {/* Métricas duplas */}
      <Metric
        label="Transações"
        tooltip="Quantidade de transações no dia. Captura = registrado pelo sub. Outgoing = liquidado pela registradora (Núclea/CIP/CERC). Divergência indica transação faltando em uma das origens."
        valuePrimary={brand.transactions.sourceA.toLocaleString('pt-BR')}
        valueSecondary={brand.transactions.sourceB.toLocaleString('pt-BR')}
        firstValue={brand.transactions.sourceA}
        secondValue={brand.transactions.sourceB}
      />

      <Metric
        label="Volume (TPV)"
        tooltip="Total Payment Volume — valor bruto transacionado no dia. Comparação capture × outgoing detecta diferenças de valor."
        valuePrimary={formatCurrency(brand.tpv.sourceA)}
        valueSecondary={formatCurrency(brand.tpv.sourceB)}
        firstValue={brand.tpv.sourceA}
        secondValue={brand.tpv.sourceB}
      />

      <Metric
        label="ITC"
        tooltip="Interchange Transaction Cost — custo de intercâmbio cobrado pela bandeira. Calculado pelo sub (capture) e o que veio da registradora (outgoing)."
        valuePrimary={formatCurrency(brand.itc.sourceA)}
        valueSecondary={formatCurrency(brand.itc.sourceB)}
        firstValue={brand.itc.sourceA}
        secondValue={brand.itc.sourceB}
      />

      {/* Taxa de conciliação + chevron */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', fontWeight: 500 }}>Taxa de conciliação</div>
          <div style={{
            fontSize: 16, fontWeight: 700,
            color: brand.conciliationRate >= 100 ? '#52C41A' : brand.conciliationRate >= 95 ? '#FA8C16' : '#FF4D4F',
          }}>
            {brand.conciliationRate.toFixed(2)}%
          </div>
        </div>
        {clickable && <Icon name="chevronRight" size={16} color="rgba(0,0,0,0.45)" />}
      </div>
    </div>
  )
}
