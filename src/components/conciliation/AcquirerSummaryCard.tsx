'use client'

import { Card, Col, Row } from 'antd'
import { ChevronRight } from 'lucide-react'
import BrandLogo from '@/components/atoms/BrandLogo'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { BrandData, MetricBreakdown } from '@/services/types/acquirerSummary.types'
import ConciliationBadge from '@/components/atoms/ConciliationBadge'
import Metric, { type MetricRow } from './Metric'

export interface AcquirerSummaryCardProps {
  brand: BrandData
  onClick?: (brand: BrandData) => void
}

/**
 * Card de sumário de conciliação por bandeira — modelo "fonte da verdade" (A).
 *
 * Cada métrica decompõe o total em até 3 linhas:
 *   ✓ reconciled  — bateu A com B exato
 *   ✗ divergent   — achou par em B mas valor diferente
 *   ? pending     — está em A, não veio em B (arquivo ausente)
 *
 * Linhas com valor zero são omitidas. Quando só a 1ª existe → 100% conciliado.
 */

function buildRows(
  breakdown: MetricBreakdown,
  fmt: (n: number) => string,
): MetricRow[] {
  const rows: MetricRow[] = []
  // Sempre mostra a linha de reconciliado (mesmo que zero) — é a fonte da verdade.
  rows.push({ kind: 'reconciled', value: fmt(breakdown.reconciled) })
  if (breakdown.divergent > 0) {
    rows.push({ kind: 'mismatch', value: fmt(breakdown.divergent) })
  }
  if (breakdown.pending > 0) {
    rows.push({ kind: 'notReconciled', value: fmt(breakdown.pending) })
  }
  return rows
}

function badgeFor(brand: BrandData): { status: string; label: string } {
  const tx = brand.transactions
  const hasDivergent = tx.divergent > 0
  const hasPending = tx.pending > 0
  const rate = Number.isFinite(brand.conciliationRate) ? brand.conciliationRate : 0

  if (!hasDivergent && !hasPending) {
    return { status: 'reconciled', label: '100% Conciliado' }
  }

  const formatRate = (r: number) => {
    if (r >= 100) return '100%'
    if (r >= 99.95) return '99,9%'
    return `${r.toFixed(1).replace('.', ',')}%`
  }
  return { status: 'mismatch', label: `${formatRate(rate)} Conciliado` }
}

const intFmt = (n: number) => Math.round(n).toLocaleString('pt-BR')
const currencyFmt = (n: number) => formatCurrency(n)

export default function AcquirerSummaryCard({ brand, onClick }: AcquirerSummaryCardProps) {
  const clickable = Boolean(onClick)
  const badge = badgeFor(brand)

  return (
    <Card
      hoverable={clickable}
      onClick={() => onClick?.(brand)}
      style={{ marginBottom: 12, cursor: clickable ? 'pointer' : 'default' }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <Row align="middle" gutter={[24, 16]} wrap style={{ width: '100%' }}>
        <Col flex="1 1 0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrandLogo brand={brand.name} size={48} />
        </Col>

        <Col flex="1 1 0">
          <ConciliationBadge statusText={badge.status} label={badge.label} />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="Transações"
            tooltip="Transações de A (fonte da verdade) decompostas por status: ✓ conciliadas (bateram com B) · ✗ divergentes (par em B com valor diferente) · ? pendentes (sem par em B)."
            rows={buildRows(brand.transactions, intFmt)}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="TPV"
            tooltip="Total Payment Volume de A, decomposto em ✓ conciliado · ✗ divergente · ? pendente."
            rows={buildRows(brand.tpv, currencyFmt)}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="ITC"
            tooltip="Interchange Transaction Cost de A, mesma decomposição em ✓/✗/?."
            rows={buildRows(brand.itc, currencyFmt)}
          />
        </Col>

        <Col flex="32px" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {clickable && <ChevronRight size={14} color="rgba(0,0,0,0.45)" />}
        </Col>
      </Row>
    </Card>
  )
}
