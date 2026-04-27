'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import DataTable, { PERIOD_OPTIONS } from './DataTable'
import type { ColumnType } from './DataTable'
import Tag from '@/components/shared/Tag'

// ─── Tipos de dados mock ────────────────────────────────────────────────────

type Transacao = {
  id: string
  data: string
  descricao: string
  adquirente: string
  valor: number
  status: string
}

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const MOCK_DATA: Transacao[] = [
  { id: 'TXN-001', data: '01/04/2026', descricao: 'Crédito lote Adiq',       adquirente: 'Adiq',  valor: 125000, status: 'Liquidado' },
  { id: 'TXN-002', data: '02/04/2026', descricao: 'Crédito lote Rede',       adquirente: 'Rede',  valor: 87500,  status: 'Liquidado' },
  { id: 'TXN-003', data: '03/04/2026', descricao: 'Desc. antecipação Cielo', adquirente: 'Cielo', valor: 62000,  status: 'Antecipado' },
  { id: 'TXN-004', data: '04/04/2026', descricao: 'Crédito lote Getnet',     adquirente: 'Getnet',valor: 45000,  status: 'Pendente' },
  { id: 'TXN-005', data: '07/04/2026', descricao: 'Crédito lote Adiq',       adquirente: 'Adiq',  valor: 118000, status: 'Liquidado' },
  { id: 'TXN-006', data: '08/04/2026', descricao: 'Chargeback Rede',         adquirente: 'Rede',  valor: 3200,   status: 'Chargeback' },
  { id: 'TXN-007', data: '09/04/2026', descricao: 'Crédito lote Cielo',      adquirente: 'Cielo', valor: 92000,  status: 'Em análise' },
  { id: 'TXN-008', data: '10/04/2026', descricao: 'Crédito lote Getnet',     adquirente: 'Getnet',valor: 67000,  status: 'Aprovado' },
]

const COLUMNS: ColumnType<Transacao>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: (v: string) => (
      <span style={{ fontFamily: 'Roboto Mono', fontSize: 11, color: '#1890FF' }}>{v}</span>
    ),
  },
  {
    title: 'Data',
    dataIndex: 'data',
    key: 'data',
    width: 110,
    render: (v: string) => <span style={{ color: 'rgba(0,0,0,0.65)' }}>{v}</span>,
  },
  {
    title: 'Descrição',
    dataIndex: 'descricao',
    key: 'descricao',
    render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
  },
  {
    title: 'Adquirente',
    dataIndex: 'adquirente',
    key: 'adquirente',
    width: 100,
    render: (v: string) => <span style={{ color: 'rgba(0,0,0,0.65)' }}>{v}</span>,
  },
  {
    title: 'Valor',
    dataIndex: 'valor',
    key: 'valor',
    width: 140,
    render: (v: number) => <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{fmt(v)}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (v: string) => <Tag status={v} />,
  },
]

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DataTable> = {
  title: 'Design System/Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#F2F4F8', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DataTable>

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default — só tabela',
  render: () => (
    <DataTable<Transacao>
      title="Eventos de liquidação"
      columns={COLUMNS}
      dataSource={MOCK_DATA}
      rowKey="id"
    />
  ),
}

export const ComPeriodoEExportar: Story = {
  name: 'Com período + Exportar no title row',
  render: () => (
    <DataTable<Transacao>
      title="Eventos de liquidação — Abril 2026"
      columns={COLUMNS}
      dataSource={MOCK_DATA}
      rowKey="id"
      periodOptions={PERIOD_OPTIONS}
      defaultPeriod="mes"
      onExport={() => alert('Exportar clicado')}
    />
  ),
}

export const ComBusca: Story = {
  name: 'Com barra de busca (toolbar)',
  render: () => {
    const [q, setQ] = useState('')
    const filtered = MOCK_DATA.filter(
      r =>
        r.descricao.toLowerCase().includes(q.toLowerCase()) ||
        r.adquirente.toLowerCase().includes(q.toLowerCase()),
    )
    return (
      <DataTable<Transacao>
        title="Eventos de liquidação"
        columns={COLUMNS}
        dataSource={filtered}
        rowKey="id"
        searchPlaceholder="Buscar por descrição ou adquirente..."
        searchValue={q}
        onSearch={setQ}
        periodOptions={PERIOD_OPTIONS}
        defaultPeriod="mes"
        onExport={() => {}}
      />
    )
  },
}

export const ComFiltrosPill: Story = {
  name: 'Com filtros pill (multi-select)',
  render: () => {
    const [statusFilter, setStatusFilter] = useState<string[]>([])
    const [adqFilter, setAdqFilter] = useState<string[]>([])

    const filtered = MOCK_DATA.filter(r => {
      const okStatus = statusFilter.length === 0 || statusFilter.includes(r.status)
      const okAdq = adqFilter.length === 0 || adqFilter.includes(r.adquirente)
      return okStatus && okAdq
    })

    return (
      <DataTable<Transacao>
        title="Eventos de liquidação"
        columns={COLUMNS}
        dataSource={filtered}
        rowKey="id"
        filters={[
          {
            label: 'Status',
            options: ['Liquidado', 'Pendente', 'Antecipado', 'Chargeback', 'Em análise', 'Aprovado'].map(v => ({ label: v, value: v })),
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            label: 'Adquirente',
            options: ['Adiq', 'Rede', 'Cielo', 'Getnet'].map(v => ({ label: v, value: v })),
            value: adqFilter,
            onChange: setAdqFilter,
          },
        ]}
        periodOptions={PERIOD_OPTIONS}
        defaultPeriod="mes"
        onExport={() => {}}
      />
    )
  },
}

export const ComTitleExtra: Story = {
  name: 'Com botão de ação no título',
  render: () => (
    <DataTable<Transacao>
      title="Eventos de liquidação"
      titleExtra={
        <button
          style={{
            border: '1px solid #1890FF',
            background: '#e6f4ff',
            color: '#1890FF',
            borderRadius: 2,
            height: 32,
            padding: '5px 16px',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          + Importar CSV
        </button>
      }
      columns={COLUMNS}
      dataSource={MOCK_DATA}
      rowKey="id"
      periodOptions={PERIOD_OPTIONS}
      defaultPeriod="hoje"
      onExport={() => {}}
    />
  ),
}

export const SemPaginacao: Story = {
  name: 'Sem paginação (lista curta)',
  render: () => (
    <DataTable<Transacao>
      title="Adquirentes ativos"
      columns={COLUMNS}
      dataSource={MOCK_DATA.slice(0, 4)}
      rowKey="id"
      showPagination={false}
    />
  ),
}

export const Loading: Story = {
  name: 'Estado loading',
  render: () => (
    <DataTable<Transacao>
      title="Carregando dados..."
      columns={COLUMNS}
      dataSource={[]}
      rowKey="id"
      loading
      periodOptions={PERIOD_OPTIONS}
      defaultPeriod="mes"
    />
  ),
}

export const KitCompleto: Story = {
  name: 'Kit completo — busca + filtros + período + exportar + ação',
  render: () => {
    const [q, setQ] = useState('')
    const [statusFilter, setStatusFilter] = useState<string[]>([])

    const filtered = MOCK_DATA.filter(r => {
      const okQ = r.descricao.toLowerCase().includes(q.toLowerCase()) || r.adquirente.toLowerCase().includes(q.toLowerCase())
      const okStatus = statusFilter.length === 0 || statusFilter.includes(r.status)
      return okQ && okStatus
    })

    return (
      <DataTable<Transacao>
        title="Eventos de liquidação — Abril 2026"
        titleExtra={
          <button
            style={{
              border: '1px solid #1890FF',
              background: '#e6f4ff',
              color: '#1890FF',
              borderRadius: 2,
              height: 32,
              padding: '5px 16px',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            + Importar
          </button>
        }
        columns={COLUMNS}
        dataSource={filtered}
        rowKey="id"
        searchPlaceholder="Buscar por descrição ou adquirente..."
        searchValue={q}
        onSearch={setQ}
        filters={[
          {
            label: 'Status',
            options: ['Liquidado', 'Pendente', 'Antecipado', 'Chargeback', 'Em análise'].map(v => ({ label: v, value: v })),
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        periodOptions={PERIOD_OPTIONS}
        defaultPeriod="mes"
        onExport={() => alert('CSV exportado')}
        onAdvancedFilter={() => alert('Filtro avançado')}
      />
    )
  },
}
