'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'

interface Terminal {
  id: string
  serial: string
  modelo: string
  local: string
  status: 'online' | 'offline' | 'manutencao'
  ultimaTransacao: string
  totalHoje: number
}

const TERMINAIS: Terminal[] = [
  { id: 'T-001', serial: 'PX12-8841', modelo: 'Getnet Smart PX',      local: 'Caixa 1 — Frente',    status: 'online',      ultimaTransacao: 'há 4 min',    totalHoje: 3870.50 },
  { id: 'T-002', serial: 'PX12-8842', modelo: 'Getnet Smart PX',      local: 'Caixa 2 — Frente',    status: 'online',      ultimaTransacao: 'há 12 min',   totalHoje: 2140.00 },
  { id: 'T-003', serial: 'ST20-0391', modelo: 'Stone S920',            local: 'Caixa 3 — Fundos',    status: 'offline',     ultimaTransacao: 'há 3 h',      totalHoje: 0 },
  { id: 'T-004', serial: 'IN90-1128', modelo: 'Ingenico Move 5000',    local: 'Delivery — Externo',  status: 'online',      ultimaTransacao: 'há 2 min',    totalHoje: 980.00 },
  { id: 'T-005', serial: 'PX12-8843', modelo: 'Getnet Smart PX',      local: 'Gerência',             status: 'manutencao',  ultimaTransacao: 'há 2 dias',   totalHoje: 0 },
]

const STATUS_LABEL: Record<Terminal['status'], string> = {
  online:      'Online',
  offline:     'Offline',
  manutencao:  'Manutenção',
}

const STATUS_TAG: Record<Terminal['status'], 'Ativo' | 'Inativo' | 'Pendente'> = {
  online:     'Ativo',
  offline:    'Inativo',
  manutencao: 'Pendente',
}

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export default function EcMaquininhas() {
  const [, setSelected] = useState<Terminal | null>(null)

  const online     = TERMINAIS.filter(t => t.status === 'online').length
  const offline    = TERMINAIS.filter(t => t.status === 'offline').length
  const totalHoje  = TERMINAIS.reduce((acc, t) => acc + t.totalHoje, 0)

  const columns: ColumnType<Terminal>[] = [
    { title: 'Serial',     dataIndex: 'serial',  key: 'serial',  width: 130 },
    { title: 'Modelo',     dataIndex: 'modelo',  key: 'modelo' },
    { title: 'Local',      dataIndex: 'local',   key: 'local' },
    {
      title: 'Última transação',
      dataIndex: 'ultimaTransacao',
      key: 'ultimaTransacao',
      width: 160,
      render: (v: string) => <span style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>{v}</span>,
    },
    {
      title: 'Total hoje',
      dataIndex: 'totalHoje',
      key: 'totalHoje',
      align: 'right',
      width: 140,
      render: (v: number) => (
        <span style={{ fontWeight: 500, color: v > 0 ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.25)' }}>
          {v > 0 ? fmtBRL(v) : '—'}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: unknown, row: Terminal) => (
        <Tag status={STATUS_TAG[row.status]} label={STATUS_LABEL[row.status]} />
      ),
    },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Maquininhas"
        breadcrumb="Estabelecimento Comercial · v0 / Cobranças / Maquininhas"
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Terminais online"  value={String(online)}          subLabel={`de ${TERMINAIS.length} cadastrados`}   variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Terminais offline" value={String(offline)}         subLabel="Verificar conectividade"                variant="neutral" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Faturado hoje"     value={fmtBRL(totalHoje)}       subLabel="Soma de todos os terminais"             variant="info" /></div>
        </div>

        <DataTable<Terminal>
          columns={columns}
          dataSource={TERMINAIS}
          rowKey="id"
          searchPlaceholder="Pesquise por serial ou local"
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>
    </div>
  )
}
