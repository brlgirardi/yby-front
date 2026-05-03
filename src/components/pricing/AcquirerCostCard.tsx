'use client'

import { useState } from 'react'
import BrandLogo from '@/components/shared/BrandLogo'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import Icon from '@/components/shared/Icon'
import type { CardBrand, CostItem, Installment, ProductType } from '@/services/types/pricing.types'
import { CARD_BRAND_LABELS, CHANNEL_LABELS, PAYMENT_METHOD_LABELS } from '@/services/types/pricing.types'
import { describeInstallment, findInstallment } from '@/lib/pricing/installments'

export interface AcquirerCostCardProps {
  acquirerId: string
  acquirerName: string
  channel?: 'cp' | 'cnp'
  isActive?: boolean
  costItems: CostItem[]
  installments: Installment[]
  /** Quando true, agrupa por bandeira; senão, lista linhas planas. */
  groupByBrand?: boolean
}

const BRANDS_ORDER: CardBrand[] = ['MASTERCARD', 'VISA', 'ELO', 'AMEX', 'PIX']

const PRODUCT_LABELS: Record<ProductType, string> = {
  credit: 'Crédito',
  debit: 'Débito',
  pre_paid: 'Pré-pago',
}

/**
 * Card colapsável de custos por adquirente (read-only).
 * Mostra a tabela de Cost Items agrupada por bandeira × método de pagamento.
 */
export default function AcquirerCostCard({
  acquirerName,
  channel,
  isActive = true,
  costItems,
  installments,
  groupByBrand = true,
}: AcquirerCostCardProps) {
  const [expanded, setExpanded] = useState(true)

  const brandsPresent = BRANDS_ORDER.filter(b => costItems.some(c => c.card_brand === b))

  return (
    <div style={{
      background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2,
      marginBottom: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <button onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Roboto', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{acquirerName}</span>
          {channel && <Tag status="Info" label={CHANNEL_LABELS[channel]} />}
          {isActive ? <Tag status="Ativo" /> : <Tag status="Inativo" />}
          <Tooltip
            text="Cost Blueprint Table — taxa que o adquirente cobra do sub-adquirente. Cada linha é um Cost Item: bandeira × método × parcelamento."
            delay={1000}
          >
            <span />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          <span>{costItems.length} taxas configuradas</span>
          <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={14} />
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa', padding: '12px 20px' }}>
          {groupByBrand ? (
            brandsPresent.map(brand => (
              <BrandGroup
                key={brand}
                brand={brand}
                items={costItems.filter(c => c.card_brand === brand)}
                installments={installments}
              />
            ))
          ) : (
            <FlatTable items={costItems} installments={installments} />
          )}
        </div>
      )}
    </div>
  )
}

interface BrandGroupProps {
  brand: CardBrand
  items: CostItem[]
  installments: Installment[]
}

function BrandGroup({ brand, items, installments }: BrandGroupProps) {
  if (!items.length) return null
  return (
    <div style={{ marginBottom: 14, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
        <BrandLogo brand={CARD_BRAND_LABELS[brand]} size={22} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{CARD_BRAND_LABELS[brand]}</span>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginLeft: 'auto' }}>{items.length} linhas</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
            <th style={th}>Produto</th>
            <th style={th}>Parcelamento</th>
            <th style={th}>Modelo</th>
            <th style={{ ...th, textAlign: 'right' }}>Taxa</th>
            <th style={{ ...th, textAlign: 'right' }}>Tarifa fixa</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <CostRow key={item.id} item={item} installments={installments} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FlatTable({ items, installments }: { items: CostItem[]; installments: Installment[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', border: '1px solid #f0f0f0' }}>
      <thead>
        <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <th style={th}>Bandeira</th>
          <th style={th}>Produto</th>
          <th style={th}>Parcelamento</th>
          <th style={th}>Modelo</th>
          <th style={{ ...th, textAlign: 'right' }}>Taxa</th>
          <th style={{ ...th, textAlign: 'right' }}>Tarifa fixa</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
            <td style={td}><BrandLogo brand={CARD_BRAND_LABELS[item.card_brand]} size={18} showLabel /></td>
            <CostRowCells item={item} installments={installments} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CostRow({ item, installments }: { item: CostItem; installments: Installment[] }) {
  return (
    <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
      <CostRowCells item={item} installments={installments} />
    </tr>
  )
}

function CostRowCells({ item, installments }: { item: CostItem; installments: Installment[] }) {
  const inst = findInstallment(installments, item.installment_id)
  const productLabel = PRODUCT_LABELS[item.product_type]
  const methodKey = item.product_type === 'credit'
    ? (inst?.from === 1 ? 'credit_1' : inst?.to === inst?.from ? `credit_${inst?.from}` : `credit_${inst?.from}_${inst?.to}`)
    : item.product_type
  const methodLabel = PAYMENT_METHOD_LABELS[methodKey] ?? productLabel
  return (
    <>
      <td style={td}>{methodLabel}</td>
      <td style={td}><span style={{ fontFamily: 'Roboto Mono', color: 'rgba(0,0,0,0.65)' }}>{describeInstallment(inst)}</span></td>
      <td style={td}>
        <Tag status="Info" label={item.types === 'mdr' ? 'MDR' : 'Interchange+'} />
      </td>
      <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#1890FF' }}>
        {item.rate.toFixed(2).replace('.', ',')}%
      </td>
      <td style={{ ...td, textAlign: 'right', color: 'rgba(0,0,0,0.65)' }}>
        {item.fee !== undefined && item.fee > 0 ? `R$ ${item.fee.toFixed(2).replace('.', ',')}` : '—'}
      </td>
    </>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '8px 14px', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.65)' }
const td: React.CSSProperties = { padding: '8px 14px', color: 'rgba(0,0,0,0.85)' }
