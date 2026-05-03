'use client'

import { Card, Col, Row } from 'antd'
import { ChevronRight } from 'lucide-react'
import BrandLogo from '@/components/shared/BrandLogo'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import ConciliationBadge from './ConciliationBadge'
import Metric from './Metric'

export interface AcquirerSummaryCardProps {
  brand: BrandData
  onClick?: (brand: BrandData) => void
}

/**
 * Card de sumário de conciliação por bandeira (uma linha = uma bandeira × tipo).
 * Layout Tupi: logo grande à esquerda, ConciliationBadge no centro,
 * 3 métricas (Transações, TPV, ITC) com valores capture × outgoing empilhados.
 *
 * Espelha `AcquirerSummaryCard` do branch LGR-264-recon-acquirer.
 */
export default function AcquirerSummaryCard({ brand, onClick }: AcquirerSummaryCardProps) {
  const clickable = Boolean(onClick)

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
          <ConciliationBadge statusText={brand.status ?? ''} />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="Transações"
            tooltip="Quantidade de transações no dia. Captura = registrado pelo sub. Outgoing = liquidado pela registradora."
            valuePrimary={brand.transactions.sourceA.toLocaleString('pt-BR')}
            valueSecondary={brand.transactions.sourceB.toLocaleString('pt-BR')}
            firstValue={brand.transactions.sourceA}
            secondValue={brand.transactions.sourceB}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="TPV"
            tooltip="Total Payment Volume — valor bruto transacionado capture × outgoing."
            valuePrimary={formatCurrency(brand.tpv.sourceA)}
            valueSecondary={formatCurrency(brand.tpv.sourceB)}
            firstValue={brand.tpv.sourceA}
            secondValue={brand.tpv.sourceB}
          />
        </Col>

        <Col flex="1 1 0">
          <Metric
            label="ITC"
            tooltip="Interchange Transaction Cost — taxa cobrada pela bandeira capture × outgoing."
            valuePrimary={formatCurrency(brand.itc.sourceA)}
            valueSecondary={formatCurrency(brand.itc.sourceB)}
            firstValue={brand.itc.sourceA}
            secondValue={brand.itc.sourceB}
          />
        </Col>

        <Col flex="32px" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {clickable && <ChevronRight size={14} color="rgba(0,0,0,0.45)" />}
        </Col>
      </Row>
    </Card>
  )
}
