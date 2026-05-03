'use client'

import { useEffect, useState } from 'react'
import { Switch, Table, Typography } from 'antd'
import ShiftInput from '@/components/shared/ShiftInput'
import type { CostRow } from './MethodTable'

const { Text, Link } = Typography

export interface PriceRow {
  key: string
  methodKey: string
  label: string
  product_type: string
  custo: number
  taxa: number
  fee: number
}

export interface BoxPriceProps {
  costRows: CostRow[]
}

/**
 * Tabela editável de Preços. Cada linha é derivada de um `CostRow`:
 *  - Coluna 1: Método (chip/tag visual)
 *  - Coluna 2: "Custo adquirente" — ITC + custo % (read-only, herdado)
 *  - Coluna 3: "Sua taxa (%)" — ShiftInput editável
 *  - Coluna 4: "Seu fee (R$)" — ShiftInput editável (se feeEnabled)
 *  - Coluna 5: "Preço final" — texto azul "ITC + N% + R$ M"
 *
 * Espelha `BoxPrice` do branch feat/pricing.
 */
export default function BoxPrice({ costRows }: BoxPriceProps) {
  const [feeEnabled, setFeeEnabled] = useState(true)

  const [rows, setRows] = useState<PriceRow[]>(() =>
    costRows.map(r => ({
      key: r.key,
      methodKey: r.methodKey,
      label: r.label,
      product_type: r.product_type,
      custo: r.rate,
      taxa: r.product_type === 'debit' || r.product_type === 'pre_paid' ? 0.9 : 3.0,
      fee: 0,
    })),
  )

  // Mantém rows sincronizado quando costRows muda externamente
  useEffect(() => {
    setRows(prev => costRows.map(r => {
      const existing = prev.find(p => p.key === r.key)
      return existing
        ? { ...existing, label: r.label, product_type: r.product_type, custo: r.rate }
        : {
            key: r.key,
            methodKey: r.methodKey,
            label: r.label,
            product_type: r.product_type,
            custo: r.rate,
            taxa: r.product_type === 'debit' || r.product_type === 'pre_paid' ? 0.9 : 3.0,
            fee: 0,
          }
    }))
  }, [costRows])

  const handleToggleFee = (v: boolean) => {
    setFeeEnabled(v)
    setRows(prev => prev.map(r => ({ ...r, fee: 0 })))
  }

  const formatPrecoFinal = (row: PriceRow) => {
    const taxa = row.taxa.toFixed(2).replace('.', ',')
    if (feeEnabled && row.fee > 0) {
      const fee = row.fee.toFixed(2).replace('.', ',')
      return `ITC + ${taxa}% + R$ ${fee}`
    }
    return `ITC + ${taxa}%`
  }

  const columns = [
    {
      title: 'Método',
      dataIndex: 'label',
      width: 130,
      render: (val: string) => (
        <span
          style={{
            display: 'inline-block',
            background: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: 0,
            padding: '2px 6px',
            fontSize: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 121,
          }}
          title={val}
        >
          {val}
        </span>
      ),
    },
    {
      title: 'Custo adquirente',
      dataIndex: 'custo',
      width: 160,
      render: (val: number) => (
        <Text style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap' }} ellipsis>
          ITC + {val.toFixed(2).replace('.', ',')}%
        </Text>
      ),
    },
    {
      title: 'Sua taxa (%)',
      dataIndex: 'taxa',
      render: (val: number, record: PriceRow) => (
        <ShiftInput
          value={val}
          onChange={v => setRows(prev => prev.map(r => r.key === record.key ? { ...r, taxa: v } : r))}
          suffix="%"
        />
      ),
    },
    ...(feeEnabled ? [{
      title: 'Seu fee (R$)',
      dataIndex: 'fee',
      render: (val: number, record: PriceRow) => (
        <ShiftInput
          value={val}
          onChange={v => setRows(prev => prev.map(r => r.key === record.key ? { ...r, fee: v } : r))}
        />
      ),
    }] : []),
    {
      title: 'Preço final',
      key: 'final',
      width: 180,
      render: (_: unknown, record: PriceRow) => (
        <Link style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {formatPrecoFinal(record)}
        </Link>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 13 }} strong>Configuração do preço:</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Switch size="small" checked={feeEnabled} onChange={handleToggleFee} />
          <Text style={{ fontSize: 13 }}>Fee por método</Text>
        </div>
      </div>

      <Table
        dataSource={rows}
        columns={columns}
        rowKey="key"
        pagination={false}
        size="small"
        tableLayout="fixed"
        style={{ width: '100%' }}
      />
    </div>
  )
}
