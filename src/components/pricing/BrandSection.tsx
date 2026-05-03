'use client'

import { useEffect, useState } from 'react'
import { Space, Switch, Typography } from 'antd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import BrandLogo from '@/components/shared/BrandLogo'
import { MCC_GROUPS, type MCC, type MCCGroup } from '@/lib/pricing/mccGroups'
import type { CardBrand, Installment, PricingModel } from '@/services/types/pricing.types'
import { CARD_BRAND_LABELS } from '@/services/types/pricing.types'
import MethodTable, { type CostRow, buildDefaultRows, buildPaymentMethodOptions } from './MethodTable'

const { Text } = Typography

export interface BrandSectionProps {
  brand: CardBrand
  installments: Installment[]
  acquirerId: string
  defaultOpen?: boolean
  initialRows?: CostRow[]
  /** Callback quando dados da bandeira mudam — usado para salvar agregado. */
  onDataChange?: (brand: CardBrand, acquirerId: string, pricingType: PricingModel, rows: CostRow[]) => void
  onHasData?: (brand: CardBrand, hasData: boolean) => void
}

/**
 * Box-bandeira: header colapsável com logo + tabela de custos OU lista de MCC
 * groups (Interchange+). Espelha `BrandSection` do branch feat/pricing.
 *
 * Toggle "Custo único por bandeira":
 *  - ON  → MethodTable direta (rate único por método para esta bandeira)
 *  - OFF → MCC Groups (Fuel/Retail/Travel) com tabela em cada um
 */
export default function BrandSection({
  brand, installments, acquirerId,
  defaultOpen = false, initialRows,
  onDataChange, onHasData,
}: BrandSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [uniqueCost, setUniqueCost] = useState(true)
  const [pricingType, setPricingType] = useState<PricingModel>('mdr')
  const [feeEnabled, setFeeEnabled] = useState(true)
  const [rows, setRows] = useState<CostRow[]>(initialRows ?? [])

  useEffect(() => {
    if (open && uniqueCost && rows.length === 0) {
      setRows(buildDefaultRows(buildPaymentMethodOptions(installments)))
    }
  }, [open, uniqueCost, installments]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onHasData?.(brand, rows.some(r => r.rate > 0 || r.fee > 0))
    onDataChange?.(brand, acquirerId, pricingType, rows)
  }, [rows, pricingType]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 8, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <BrandLogo brand={CARD_BRAND_LABELS[brand]} size={28} showLabel />
        <Space size={12} align="center">
          <Space size={6}>
            <Switch
              size="small"
              checked={uniqueCost}
              onChange={(v) => { setUniqueCost(v) }}
              onClick={(_, e) => e.stopPropagation()}
            />
            <Text style={{ fontSize: 12 }}>Custo único por bandeira</Text>
          </Space>
          {open ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
        </Space>
      </div>

      {open && (
        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          {uniqueCost ? (
            <MethodTable
              pricingType={pricingType}
              onPricingTypeChange={setPricingType}
              feeEnabled={feeEnabled}
              onFeeEnabledChange={setFeeEnabled}
              rows={rows}
              onRowsChange={setRows}
              installments={installments}
            />
          ) : (
            <div>
              {MCC_GROUPS.map(group => (
                <MccGroupBlock key={group.id} group={group} previousRows={rows} installments={installments} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface MccGroupBlockProps {
  group: MCCGroup
  previousRows?: CostRow[]
  installments: Installment[]
}

function MccGroupBlock({ group, previousRows, installments }: MccGroupBlockProps) {
  const [open, setOpen] = useState(false)
  const [byIndividual, setByIndividual] = useState(false)
  const [pricingType, setPricingType] = useState<PricingModel>('mdr')
  const [feeEnabled, setFeeEnabled] = useState(true)
  const [rows, setRows] = useState<CostRow[]>([])

  useEffect(() => {
    if (open && !byIndividual && rows.length === 0) {
      setRows(buildDefaultRows(buildPaymentMethodOptions(installments)))
    }
  }, [open, byIndividual, installments]) // eslint-disable-line react-hooks/exhaustive-deps

  const mccSummary = group.mccs.map(m => m.code).join(', ') + '.'

  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 0, marginBottom: 4, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <div>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>{group.code}</Text>
          <Text style={{ fontSize: 13, marginLeft: 8 }}>— {group.name}</Text>
          <Text style={{ fontSize: 13, color: '#888', marginLeft: 4 }}>({group.description})</Text>
          <div style={{ marginTop: 2 }}>
            <Text style={{ fontSize: 12, color: '#aaa' }}>MCCs: {mccSummary}</Text>
          </div>
        </div>
        {open ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Switch size="small" checked={byIndividual} onChange={setByIndividual} />
            <Text style={{ fontSize: 13 }}>Visualizar por MCC individual</Text>
          </div>

          {byIndividual ? (
            <div>
              {group.mccs.map(mcc => (
                <MccIndividualBlock key={mcc.code} mcc={mcc} previousRows={rows} installments={installments} />
              ))}
            </div>
          ) : (
            <MethodTable
              pricingType={pricingType}
              onPricingTypeChange={setPricingType}
              feeEnabled={feeEnabled}
              onFeeEnabledChange={setFeeEnabled}
              rows={rows}
              onRowsChange={setRows}
              previousRows={previousRows}
              installments={installments}
            />
          )}
        </div>
      )}
    </div>
  )
}

function MccIndividualBlock({ mcc, previousRows, installments }: { mcc: MCC; previousRows?: CostRow[]; installments: Installment[] }) {
  const [open, setOpen] = useState(false)
  const [pricingType, setPricingType] = useState<PricingModel>('mdr')
  const [feeEnabled, setFeeEnabled] = useState(true)
  const [rows, setRows] = useState<CostRow[]>([])

  useEffect(() => {
    if (open && rows.length === 0) {
      setRows(buildDefaultRows(buildPaymentMethodOptions(installments)))
    }
  }, [open, installments]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 0, marginBottom: 4, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <Text style={{ fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{mcc.code}</span>
          <span style={{ color: '#888', marginLeft: 8 }}>— {mcc.description}</span>
        </Text>
        {open ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px' }}>
          <MethodTable
            pricingType={pricingType}
            onPricingTypeChange={setPricingType}
            feeEnabled={feeEnabled}
            onFeeEnabledChange={setFeeEnabled}
            rows={rows}
            onRowsChange={setRows}
            previousRows={previousRows}
            installments={installments}
          />
        </div>
      )}
    </div>
  )
}
