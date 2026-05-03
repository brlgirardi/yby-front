'use client'

import { useMemo, useState } from 'react'
import { Button, InputNumber, Radio, Select, Space, Switch, Table, Typography } from 'antd'
import { Trash2, Plus } from 'lucide-react'
import type { Installment, PricingModel } from '@/services/types/pricing.types'

const { Text } = Typography

export interface CostRow {
  key: string
  methodKey: string
  label: string
  product_type: string
  installments: number
  installment_id: string
  rate: number
  fee: number
}

export interface PaymentMethodOption {
  key: string
  label: string
  product_type: string
  installments: number
  installment_id: string
}

/**
 * Constrói as opções de método (versão "ungrouped" — uma linha por parcelamento).
 * Espelha `buildPaymentMethodOptions` do branch feat/pricing.
 */
export function buildPaymentMethodOptions(installments: Installment[]): PaymentMethodOption[] {
  const options: PaymentMethodOption[] = []
  const inst1 = installments.find(i => i.from === 1 && i.to === 1)
  if (inst1) {
    options.push({ key: 'pre_paid',  label: 'Pré-pago',         product_type: 'pre_paid', installments: 1, installment_id: inst1.id })
    options.push({ key: 'debit',     label: 'Débito à vista',   product_type: 'debit',    installments: 1, installment_id: inst1.id })
    options.push({ key: 'credit_1',  label: 'Crédito à vista',  product_type: 'credit',   installments: 1, installment_id: inst1.id })
  }
  for (const inst of installments) {
    if (inst.from > 1 && inst.from === inst.to) {
      options.push({ key: `credit_${inst.from}`, label: `Crédito ${inst.from}x`, product_type: 'credit', installments: inst.from, installment_id: inst.id })
    } else if (inst.from > 1 && inst.to > inst.from) {
      options.push({ key: `credit_${inst.from}_${inst.to}`, label: `Crédito parcelado ${inst.from}x à ${inst.to}x`, product_type: 'credit', installments: inst.from, installment_id: inst.id })
    }
  }
  return options
}

/** Versão "grouped" — agrupa parcelas em ranges (2-6x, 7-12x). */
export function buildRangeMethodOptions(installments: Installment[]): PaymentMethodOption[] {
  const options: PaymentMethodOption[] = []
  const inst1 = installments.find(i => i.from === 1 && i.to === 1)
  if (inst1) {
    options.push({ key: 'debit',    label: 'Débito à vista',  product_type: 'debit',  installments: 1, installment_id: inst1.id })
    options.push({ key: 'credit_1', label: 'Crédito à vista', product_type: 'credit', installments: 1, installment_id: inst1.id })
  }
  for (const inst of installments) {
    if (inst.from > 1 && inst.from === inst.to) {
      options.push({ key: `credit_${inst.from}`, label: `Crédito ${inst.from}x`, product_type: 'credit', installments: inst.from, installment_id: inst.id })
    } else if (inst.from > 1 && inst.to > inst.from) {
      options.push({ key: `credit_${inst.from}_${inst.to}`, label: `Crédito parcelado ${inst.from}x à ${inst.to}x`, product_type: 'credit', installments: inst.from, installment_id: inst.id })
    }
  }
  return options
}

const STATIC_FALLBACK_OPTIONS: PaymentMethodOption[] = [
  { key: 'pre_paid', label: 'Pré-pago',        product_type: 'pre_paid', installments: 1, installment_id: '' },
  { key: 'debit',    label: 'Débito à vista',  product_type: 'debit',    installments: 1, installment_id: '' },
  { key: 'credit_1', label: 'Crédito à vista', product_type: 'credit',   installments: 1, installment_id: '' },
  { key: 'credit_2', label: 'Crédito 2x',      product_type: 'credit',   installments: 2, installment_id: '' },
]

export function buildDefaultRows(options: PaymentMethodOption[] = STATIC_FALLBACK_OPTIONS): CostRow[] {
  return options.slice(0, 4).map((opt, i) => ({
    key: `${opt.key}-${i}`,
    methodKey: opt.key,
    label: opt.label,
    product_type: opt.product_type,
    installments: opt.installments,
    installment_id: opt.installment_id,
    rate: 0,
    fee: 0,
  }))
}

export interface MethodTableProps {
  pricingType: PricingModel
  onPricingTypeChange: (v: PricingModel) => void
  feeEnabled: boolean
  onFeeEnabledChange: (v: boolean) => void
  rows: CostRow[]
  onRowsChange: (rows: CostRow[]) => void
  previousRows?: CostRow[]
  installments?: Installment[]
}

/**
 * Tabela editável de métodos de pagamento × taxa de custo.
 * Espelha `MethodTable` do branch feat/pricing.
 *
 * Colunas: Método (Select com toggle Agrupar) | Rate (MDR ou Plus %) |
 * Fee opcional (R$) | Custo total | Ações (excluir).
 */
export default function MethodTable({
  pricingType, onPricingTypeChange,
  feeEnabled, onFeeEnabledChange,
  rows, onRowsChange,
  previousRows,
  installments = [],
}: MethodTableProps) {
  const [replicatePrevious, setReplicatePrevious] = useState(false)
  const [grouped, setGrouped] = useState(false)

  const ungroupedOptions = useMemo(() => buildPaymentMethodOptions(installments), [installments])
  const rangeOptions     = useMemo(() => buildRangeMethodOptions(installments), [installments])
  const activeOptions    = grouped ? rangeOptions : ungroupedOptions

  const handleGroupedChange = (value: boolean) => {
    setGrouped(value)
    if (value) {
      const debitRow = rows.find(r => r.methodKey === 'debit')
      const credit1Row = rows.find(r => r.methodKey === 'credit_1')
      const newRows: CostRow[] = []
      if (debitRow) newRows.push(debitRow)
      if (credit1Row) newRows.push(credit1Row)
      rangeOptions.filter(o => o.key !== 'debit' && o.key !== 'credit_1').forEach(opt => {
        newRows.push({ key: `${opt.key}-${Date.now()}`, methodKey: opt.key, label: opt.label, product_type: opt.product_type, installments: opt.installments, installment_id: opt.installment_id, rate: 0, fee: 0 })
      })
      onRowsChange(newRows)
    } else {
      onRowsChange(buildDefaultRows(ungroupedOptions))
    }
  }

  const displayRows = useMemo(() => {
    if (!grouped) return rows
    return [...rows].sort((a, b) => {
      const ia = rangeOptions.findIndex(o => o.key === a.methodKey)
      const ib = rangeOptions.findIndex(o => o.key === b.methodKey)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
  }, [rows, grouped, rangeOptions])

  const rateColTitle = pricingType === 'mdr' ? 'MDR (%)' : 'Plus (%)'
  const mainColPct = feeEnabled ? '25%' : '37.5%'

  const handleRateChange = (key: string, value: number) => {
    onRowsChange(rows.map(r => r.key === key ? { ...r, rate: value } : r))
  }

  const handleReplicatePrevious = () => {
    if (!previousRows || previousRows.length === 0) return
    onRowsChange(previousRows.map(r => ({ ...r, key: `${r.key}-copy-${Date.now()}` })))
  }

  const handleAdd = () => {
    const used = new Set(rows.map(r => r.methodKey))
    const next = activeOptions.find(o => !used.has(o.key))
    if (!next) return
    const last = rows[rows.length - 1]
    const rate = replicatePrevious && last ? last.rate : 0
    const fee  = replicatePrevious && last ? last.fee  : 0
    onRowsChange([
      ...rows,
      { key: `${next.key}-${Date.now()}`, methodKey: next.key, label: next.label, product_type: next.product_type, installments: next.installments, installment_id: next.installment_id, rate, fee },
    ])
  }

  const columns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ marginLeft: 4 }}>Método</span>
          <Space size={4}>
            <Switch size="small" checked={grouped} onChange={handleGroupedChange} />
            <Text style={{ fontSize: 12, fontWeight: 400 }}>Agrupar parcelamentos</Text>
          </Space>
        </div>
      ),
      dataIndex: 'methodKey',
      width: mainColPct,
      render: (val: string, record: CostRow) => (
        <Select
          value={val}
          style={{ width: '100%' }}
          onChange={(methodKey) => {
            const opt = activeOptions.find(o => o.key === methodKey) ?? activeOptions[0]
            if (!opt) return
            onRowsChange(rows.map(r => r.key === record.key
              ? { ...r, methodKey, label: opt.label, product_type: opt.product_type, installments: opt.installments, installment_id: opt.installment_id }
              : r,
            ))
          }}
        >
          {activeOptions.map(opt => {
            const usedByOther = rows.some(r => r.key !== record.key && r.methodKey === opt.key)
            return (
              <Select.Option key={opt.key} value={opt.key} disabled={usedByOther}>
                {opt.label}
              </Select.Option>
            )
          })}
        </Select>
      ),
    },
    {
      title: rateColTitle,
      dataIndex: 'rate',
      width: mainColPct,
      render: (val: number, record: CostRow) => (
        <InputNumber
          value={val}
          min={0}
          max={100}
          precision={2}
          decimalSeparator=","
          style={{ width: '100%' }}
          onChange={v => handleRateChange(record.key, v ?? 0)}
        />
      ),
    },
    ...(feeEnabled ? [{
      title: 'Fee (R$)',
      dataIndex: 'fee',
      width: mainColPct,
      render: (val: number, record: CostRow) => (
        <InputNumber
          value={val}
          min={0}
          precision={2}
          decimalSeparator=","
          style={{ width: '100%' }}
          onChange={v => onRowsChange(rows.map(r => r.key === record.key ? { ...r, fee: v ?? 0 } : r))}
        />
      ),
    }] : []),
    {
      title: 'Custo Total',
      key: 'total',
      width: '15%',
      render: (_: unknown, record: CostRow) => {
        const rate = record.rate.toFixed(2).replace('.', ',')
        const feeStr = feeEnabled && record.fee > 0 ? ` + R$ ${record.fee.toFixed(2).replace('.', ',')}` : ''
        return <Text style={{ fontSize: 13, color: '#1677ff' }}>{rate}%{feeStr}</Text>
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: CostRow) => (
        <Button
          size="small" type="text"
          icon={<Trash2 size={14} color={rows.length <= 1 ? '#d9d9d9' : '#000'} />}
          style={{ background: '#f5f5f5', border: 'none', width: 28, minWidth: 28, padding: 0 }}
          disabled={rows.length <= 1}
          onClick={() => onRowsChange(rows.filter(r => r.key !== record.key))}
        />
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
        <Space align="center">
          <Text style={{ fontSize: 13 }} strong>Configurações de custo</Text>
          <Radio.Group value={pricingType} onChange={e => onPricingTypeChange(e.target.value)}>
            <Radio value="mdr">MDR</Radio>
            <Radio value="interchange_plus">Interchange Plus</Radio>
          </Radio.Group>
        </Space>
        <Space size={6}>
          <Switch size="small" checked={feeEnabled} onChange={onFeeEnabledChange} />
          <Text style={{ fontSize: 13 }}>Fee por método</Text>
        </Space>
      </div>

      <Table
        dataSource={displayRows}
        columns={columns}
        rowKey="key"
        pagination={false}
        size="small"
        tableLayout="fixed"
        style={{ marginBottom: 12, width: '100%' }}
      />

      <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          icon={<Plus size={14} />}
          style={{ borderRadius: 0, background: '#fff' }}
          onClick={handleAdd}
        >
          Adicionar método
        </Button>
        <Space size={6}>
          <Switch
            size="small"
            checked={replicatePrevious}
            onChange={v => {
              setReplicatePrevious(v)
              if (v) handleReplicatePrevious()
            }}
          />
          <Text style={{ fontSize: 13 }}>Replicar custo anterior</Text>
        </Space>
      </div>
    </>
  )
}
