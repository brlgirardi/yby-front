'use client'

import { useEffect, useState } from 'react'
import { Space, Switch, Typography } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import BrandLogo from '@/components/shared/BrandLogo'
import { MCC_GROUPS, type MCC, type MCCGroup } from '@/lib/pricing/mccGroups'
import type { CardBrand, CostItem, Installment, PriceItem } from '@/services/types/pricing.types'
import { CARD_BRAND_LABELS } from '@/services/types/pricing.types'
import BoxPrice from './BoxPrice'
import type { CostRow } from './MethodTable'
import { describeInstallment, findInstallment } from '@/lib/pricing/installments'

const { Text } = Typography

export interface BrandPriceSectionProps {
  brand: CardBrand
  acquirerId: string
  costItems: CostItem[]
  priceItems: PriceItem[]
  installments: Installment[]
  defaultOpen?: boolean
}

/**
 * Box-bandeira para Preços. Espelha a mesma estrutura do BrandSection mas usa
 * BoxPrice no body em vez de MethodTable. Suporta toggle "Custo único por
 * bandeira" → mostra MCC groups quando OFF.
 */
export default function BrandPriceSection({
  brand, costItems, priceItems, installments,
  defaultOpen = false,
}: BrandPriceSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [uniqueCost, setUniqueCost] = useState(true)

  // Converte CostItem (snake) → CostRow (camel) usado pelo BoxPrice
  const costRows: CostRow[] = costItems
    .filter(c => c.card_brand === brand)
    .map(c => {
      const inst = findInstallment(installments, c.installment_id)
      const methodKey = c.product_type === 'credit'
        ? (inst?.from === 1 && inst?.to === 1 ? 'credit_1'
           : inst?.from === inst?.to ? `credit_${inst?.from}`
           : `credit_${inst?.from}_${inst?.to}`)
        : c.product_type
      const methodLabel = c.product_type === 'credit'
        ? (inst?.from === 1 ? 'Crédito à vista' : `Crédito ${describeInstallment(inst)}`)
        : c.product_type === 'debit' ? 'Débito à vista' : 'Pré-pago'
      // Suga margem default do priceItem se houver
      void priceItems
      return {
        key: c.id,
        methodKey,
        label: methodLabel,
        product_type: c.product_type,
        installments: inst?.from ?? 1,
        installment_id: c.installment_id,
        rate: c.rate,
        fee: c.fee ?? 0,
      }
    })

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 8, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <BrandLogo brand={CARD_BRAND_LABELS[brand]} size={28} showLabel />
        <Space size={12} align="center">
          <Space size={6}>
            <Switch size="small" checked={uniqueCost} onChange={setUniqueCost}
              onClick={(_, e) => e.stopPropagation()} />
            <Text style={{ fontSize: 12 }}>Custo único por bandeira</Text>
          </Space>
          {open ? <CaretUpOutlined style={{ fontSize: 16, color: '#666' }} /> : <CaretDownOutlined style={{ fontSize: 16, color: '#666' }} />}
        </Space>
      </div>

      {open && (
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          {uniqueCost ? (
            costRows.length > 0
              ? <BoxPrice costRows={costRows} />
              : <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
                  Configure os custos desta bandeira para definir preços.
                </div>
          ) : (
            <div>
              {MCC_GROUPS.map(g => (
                <MccPriceGroupBlock key={g.id} group={g} costRows={costRows} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MccPriceGroupBlock({ group, costRows }: { group: MCCGroup; costRows: CostRow[] }) {
  const [open, setOpen] = useState(false)
  const [byIndividual, setByIndividual] = useState(false)
  const mccSummary = group.mccs.map(m => m.code).join(', ') + '.'

  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 0, marginBottom: 4, background: '#fff', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}>
        <div>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>{group.code}</Text>
          <Text style={{ fontSize: 13, marginLeft: 8 }}>— {group.name}</Text>
          <Text style={{ fontSize: 13, color: '#888', marginLeft: 4 }}>({group.description})</Text>
          <div style={{ marginTop: 2 }}>
            <Text style={{ fontSize: 12, color: '#aaa' }}>MCCs: {mccSummary}</Text>
          </div>
        </div>
        {open ? <CaretUpOutlined style={{ fontSize: 14, color: '#666' }} /> : <CaretDownOutlined style={{ fontSize: 14, color: '#666' }} />}
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Switch size="small" checked={byIndividual} onChange={setByIndividual} />
            <Text style={{ fontSize: 13 }}>Visualizar por MCC individual</Text>
          </div>
          {byIndividual ? (
            <div>
              {group.mccs.map(mcc => (
                <MccPriceIndividualBlock key={mcc.code} mcc={mcc} costRows={costRows} />
              ))}
            </div>
          ) : (
            costRows.length > 0
              ? <BoxPrice costRows={costRows} />
              : <div style={{ padding: 16, fontSize: 13, color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>Sem custos para este grupo.</div>
          )}
        </div>
      )}
    </div>
  )
}

function MccPriceIndividualBlock({ mcc, costRows }: { mcc: MCC; costRows: CostRow[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 0, marginBottom: 4, background: '#fff', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}>
        <Text style={{ fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{mcc.code}</span>
          <span style={{ color: '#888', marginLeft: 8 }}>— {mcc.description}</span>
        </Text>
        {open ? <CaretUpOutlined style={{ fontSize: 14, color: '#666' }} /> : <CaretDownOutlined style={{ fontSize: 14, color: '#666' }} />}
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: 16 }}>
          {costRows.length > 0
            ? <BoxPrice costRows={costRows} />
            : <div style={{ padding: 16, fontSize: 13, color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>Sem custos para este MCC.</div>}
        </div>
      )}
    </div>
  )
}
