'use client'

import { Card, Col, Row } from 'antd'
import BrandLogo from '@/components/shared/BrandLogo'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import ConciliationBadge from './ConciliationBadge'
import Metric from './Metric'

export interface BrandSummaryCardProps {
  brand: BrandData
}

/**
 * Card de sumário no topo do BrandDetail. Mesma estrutura visual do
 * AcquirerSummaryCard, mas sem onClick (já estamos no detalhe).
 *
 * Espelha `BrandSummaryCard` do branch LGR-264-recon-acquirer.
 */
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
          <Metric
            label="Transações"
            valuePrimary={brand.transactions.sourceA.toLocaleString('pt-BR')}
            valueSecondary={brand.transactions.sourceB.toLocaleString('pt-BR')}
            firstValue={brand.transactions.sourceA}
            secondValue={brand.transactions.sourceB}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="TPV"
            valuePrimary={formatCurrency(brand.tpv.sourceA)}
            valueSecondary={formatCurrency(brand.tpv.sourceB)}
            firstValue={brand.tpv.sourceA}
            secondValue={brand.tpv.sourceB}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="ITC"
            valuePrimary={formatCurrency(brand.itc.sourceA)}
            valueSecondary={formatCurrency(brand.itc.sourceB)}
            firstValue={brand.itc.sourceA}
            secondValue={brand.itc.sourceB}
          />
        </Col>
      </Row>
    </Card>
  )
}
