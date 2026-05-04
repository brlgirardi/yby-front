'use client'

import { useState } from 'react'
import { Typography } from 'antd'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import BrandLogo from '@/components/shared/BrandLogo'
import type { CardBrand, CostItem, Installment, PriceBlueprintTable, PriceItem } from '@/services/types/pricing.types'
import BrandPriceSection from './BrandPriceSection'

const { Text } = Typography

const ALL_BRANDS: CardBrand[] = ['MASTERCARD', 'VISA', 'ELO', 'AMEX', 'PIX']

const formatDate = (iso: string): string => {
  try { return new Date(iso).toLocaleDateString('pt-BR') } catch { return iso }
}

export interface AcquirerPriceSectionProps {
  acquirerId: string
  acquirerName: string
  table: PriceBlueprintTable | null
  costItems: CostItem[]
  priceItems: PriceItem[]
  installments: Installment[]
}

export default function AcquirerPriceSection({
  acquirerId, acquirerName, table, costItems, priceItems, installments,
}: AcquirerPriceSectionProps) {
  const [open, setOpen] = useState(true)
  const acquirerCostItems = costItems.filter(c => c.acquirer_id === acquirerId)

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 8, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BrandLogo brand={acquirerName} size={28} />
          <Text style={{ fontSize: 15, fontWeight: 600, lineHeight: '28px' }}>{acquirerName}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} color="#888" />
            <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', lineHeight: '16px' }}>
              Atualizado em {table ? formatDate(table.updated_at) : '—'}
            </Text>
          </div>
          {open ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
        </div>
      </div>

      {open && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          {ALL_BRANDS.map(brand => (
            <BrandPriceSection
              key={brand}
              brand={brand}
              acquirerId={acquirerId}
              costItems={acquirerCostItems}
              priceItems={priceItems}
              installments={installments}
              defaultOpen={!table}
            />
          ))}
        </div>
      )}
    </div>
  )
}
