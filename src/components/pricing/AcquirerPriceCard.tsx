'use client'

import { useState } from 'react'
import BrandLogo from '@/components/shared/BrandLogo'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import Icon from '@/components/shared/Icon'
import type {
  CardBrand, CostItem, Installment, PriceItem, ProductType,
} from '@/services/types/pricing.types'
import { CARD_BRAND_LABELS, CHANNEL_LABELS, PAYMENT_METHOD_LABELS } from '@/services/types/pricing.types'
import { describeInstallment, findInstallment } from '@/lib/pricing/installments'

export interface AcquirerPriceCardProps {
  acquirerId: string
  acquirerName: string
  channel?: 'cp' | 'cnp'
  isActive?: boolean
  costItems: CostItem[]
  priceItems: PriceItem[]
  installments: Installment[]
}

const BRANDS_ORDER: CardBrand[] = ['MASTERCARD', 'VISA', 'ELO', 'AMEX', 'PIX']
const PRODUCT_LABELS: Record<ProductType, string> = { credit: 'Crédito', debit: 'Débito', pre_paid: 'Pré-pago' }

interface PricedRow {
  cost: CostItem
  price: PriceItem | undefined
}

/**
 * Card colapsável da tabela de preços (Price Blueprint) por adquirente.
 * Cada linha mostra: custo + margem (em pontos percentuais) = preço final cobrado do EC.
 */
export default function AcquirerPriceCard({
  acquirerName, channel, isActive = true,
  costItems, priceItems, installments,
}: AcquirerPriceCardProps) {
  const [expanded, setExpanded] = useState(true)

  const rows: PricedRow[] = costItems.map(c => ({
    cost: c,
    price: priceItems.find(p => p.cost_items_id === c.id),
  }))

  const brandsPresent = BRANDS_ORDER.filter(b => costItems.some(c => c.card_brand === b))

  const totalMarginAvg = priceItems.length
    ? priceItems.reduce((acc, p) => acc + p.margin, 0) / priceItems.length
    : 0

  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, marginBottom: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
      <button onClick={() => setExpanded(e => !e)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Roboto', textAlign: 'left' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{acquirerName}</span>
          {channel && <Tag status="Info" label={CHANNEL_LABELS[channel]} />}
          {isActive ? <Tag status="Ativo" /> : <Tag status="Inativo" />}
          <Tooltip
            text="Price Blueprint Table — taxa que o sub-adquirente cobra dos ECs. Cada linha = custo (do adquirente) + margem (em pontos percentuais) = preço final."
            delay={1000}
          >
            <span />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          <span>Margem média: <strong style={{ color: '#1890FF' }}>+{totalMarginAvg.toFixed(2).replace('.', ',')}pp</strong></span>
          <span>•</span>
          <span>{rows.length} preços ativos</span>
          <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={14} />
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa', padding: '12px 20px' }}>
          {brandsPresent.map(brand => (
            <BrandGroup key={brand}
              brand={brand}
              rows={rows.filter(r => r.cost.card_brand === brand)}
              installments={installments}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface BrandGroupProps {
  brand: CardBrand
  rows: PricedRow[]
  installments: Installment[]
}

function BrandGroup({ brand, rows, installments }: BrandGroupProps) {
  if (!rows.length) return null
  return (
    <div style={{ marginBottom: 14, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
        <BrandLogo brand={CARD_BRAND_LABELS[brand]} size={22} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{CARD_BRAND_LABELS[brand]}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
            <th style={th}>Produto</th>
            <th style={th}>Parcelamento</th>
            <th style={{ ...th, textAlign: 'right', color: 'rgba(0,0,0,0.45)' }}>Custo</th>
            <th style={{ ...th, textAlign: 'right', color: '#722ED1' }}>Margem (pp)</th>
            <th style={{ ...th, textAlign: 'right', color: '#52C41A' }}>Preço final</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const inst = findInstallment(installments, r.cost.installment_id)
            const methodKey = r.cost.product_type === 'credit'
              ? (inst?.from === 1 ? 'credit_1' : inst?.to === inst?.from ? `credit_${inst?.from}` : `credit_${inst?.from}_${inst?.to}`)
              : r.cost.product_type
            const methodLabel = PAYMENT_METHOD_LABELS[methodKey] ?? PRODUCT_LABELS[r.cost.product_type]

            return (
              <tr key={r.cost.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={td}>{methodLabel}</td>
                <td style={td}><span style={{ fontFamily: 'Roboto Mono', color: 'rgba(0,0,0,0.65)' }}>{describeInstallment(inst)}</span></td>
                <td style={{ ...td, textAlign: 'right', color: 'rgba(0,0,0,0.45)' }}>
                  {r.cost.rate.toFixed(2).replace('.', ',')}%
                </td>
                <td style={{ ...td, textAlign: 'right', color: '#722ED1', fontWeight: 500 }}>
                  {r.price ? `+${r.price.margin.toFixed(2).replace('.', ',')}` : '—'}
                </td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#52C41A' }}>
                  {r.price ? `${r.price.rate.toFixed(2).replace('.', ',')}%` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '8px 14px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.65)' }
const td: React.CSSProperties = { padding: '8px 14px', color: 'rgba(0,0,0,0.85)' }
