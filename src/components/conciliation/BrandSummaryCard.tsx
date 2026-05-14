'use client'

import { Card, Col, Row } from 'antd'
import BrandLogo from '@/components/atoms/BrandLogo'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { BrandData, MetricBreakdown } from '@/services/types/acquirerSummary.types'
import ConciliationBadge from '@/components/atoms/ConciliationBadge'
import Metric, { type MetricRow } from './Metric'

export interface BrandSummaryCardProps {
  brand: BrandData
}

function buildRows(b: MetricBreakdown, fmt: (n: number) => string): MetricRow[] {
  const rows: MetricRow[] = [{ kind: 'reconciled', value: fmt(b.reconciled) }]
  if (b.divergent > 0) rows.push({ kind: 'mismatch', value: fmt(b.divergent) })
  if (b.pending > 0) rows.push({ kind: 'notReconciled', value: fmt(b.pending) })
  return rows
}

const intFmt = (n: number) => Math.round(n).toLocaleString('pt-BR')

export default function BrandSummaryCard({ brand }: BrandSummaryCardProps) {
  return (
    <Card style={{ marginBottom: 12 }} styles={{ body: { padding: '20px 24px' } }}>
      <Row align="middle" gutter={[24, 16]} wrap style={{ width: '100%' }}>
        <Col flex="1 1 0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrandLogo brand={brand.name} size={48} />
        </Col>

        <Col flex="1 1 0">
          <ConciliationBadge statusText={brand.status ?? ''} />
        </Col>

        <Col flex="1 1 0">
          <Metric label="Transações" rows={buildRows(brand.transactions, intFmt)} />
        </Col>

        <Col flex="1 1 0">
          <Metric label="TPV" rows={buildRows(brand.tpv, formatCurrency)} />
        </Col>

        <Col flex="1 1 0">
          <Metric label="ITC" rows={buildRows(brand.itc, formatCurrency)} />
        </Col>
      </Row>
    </Card>
  )
}
