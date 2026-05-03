'use client'

import { useState } from 'react'
import { Space, Typography } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, ClockCircleOutlined } from '@ant-design/icons'
import BrandLogo from '@/components/shared/BrandLogo'
import type { CardBrand, CostBlueprintTable, Installment, PricingModel } from '@/services/types/pricing.types'
import BrandSection from './BrandSection'
import type { CostRow } from './MethodTable'

const { Text } = Typography

const ALL_BRANDS: CardBrand[] = ['MASTERCARD', 'VISA', 'ELO', 'AMEX', 'PIX']

const formatDate = (iso: string): string => {
  try { return new Date(iso).toLocaleDateString('pt-BR') } catch { return iso }
}

export interface AcquirerSectionProps {
  acquirerId: string
  acquirerName: string
  table: CostBlueprintTable | null
  installments: Installment[]
  onHasData?: (brand: string, hasData: boolean) => void
  onDataChange?: (brand: CardBrand, acquirerId: string, pricingType: PricingModel, rows: CostRow[]) => void
}

/**
 * Box-adquirente: header com logo + data de atualização, body com 5 BrandSections
 * (Mastercard, Visa, Elo, Amex, PIX).
 *
 * Espelha `AcquirerSection` do branch feat/pricing.
 */
export default function AcquirerSection({
  acquirerId, acquirerName, table, installments,
  onHasData, onDataChange,
}: AcquirerSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 8, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <Space size={12} align="center">
          <BrandLogo brand={acquirerName} size={32} />
          <Text style={{ fontSize: 15, fontWeight: 600 }}>{acquirerName}</Text>
        </Space>

        <Space size={8} align="center">
          <Space size={4} align="center">
            <ClockCircleOutlined style={{ fontSize: 12, color: '#888' }} />
            <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
              Atualizado em {table ? formatDate(table.updated_at) : '—'}
            </Text>
          </Space>
          {open ? <CaretUpOutlined style={{ fontSize: 16, color: '#666' }} /> : <CaretDownOutlined style={{ fontSize: 16, color: '#666' }} />}
        </Space>
      </div>

      {open && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          {ALL_BRANDS.map(brand => (
            <BrandSection
              key={brand}
              brand={brand}
              acquirerId={acquirerId}
              installments={installments}
              defaultOpen={!table}
              onHasData={onHasData}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
