'use client'

import { useState, useMemo } from 'react'
import { Input, Select, Switch, Button, Table, Tag, Empty } from 'antd'
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'
import StatusTag from '@/components/shared/Tag'

const { Option } = Select

interface Row {
  key: string
  data: string
  nsu: string
  bandeira: string
  lancamento: string
  parcela: string
  valor: number
  comissao: number
  liquido: number
  antecipado: boolean
  status: string
}

const ALL_ROWS: Row[] = [
  { key: '1', data: '24/04/2026', nsu: 'NSU-00123', bandeira: 'Visa', lancamento: 'Crédito', parcela: '1/3', valor: 450.00, comissao: 13.50, liquido: 436.50, antecipado: false, status: 'Pendente' },
  { key: '2', data: '24/04/2026', nsu: 'NSU-00124', bandeira: 'Mastercard', lancamento: 'Crédito', parcela: '2/4', valor: 320.00, comissao: 9.60, liquido: 310.40, antecipado: true, status: 'Pendente' },
  { key: '3', data: '24/04/2026', nsu: 'NSU-00125', bandeira: 'Elo', lancamento: 'Débito', parcela: '1/1', valor: 180.00, comissao: 5.40, liquido: 174.60, antecipado: false, status: 'Liquidado' },
  { key: '4', data: '23/04/2026', nsu: 'NSU-00118', bandeira: 'Visa', lancamento: 'Crédito', parcela: '3/6', valor: 920.00, comissao: 27.60, liquido: 892.40, antecipado: true, status: 'Liquidado' },
  { key: '5', data: '23/04/2026', nsu: 'NSU-00119', bandeira: 'Mastercard', lancamento: 'Crédito', parcela: '1/2', valor: 640.00, comissao: 19.20, liquido: 620.80, antecipado: false, status: 'Pendente' },
  { key: '6', data: '22/04/2026', nsu: 'NSU-00112', bandeira: 'Elo', lancamento: 'Crédito', parcela: '4/12', valor: 1200.00, comissao: 36.00, liquido: 1164.00, antecipado: false, status: 'Liquidado' },
  { key: '7', data: '22/04/2026', nsu: 'NSU-00113', bandeira: 'Visa', lancamento: 'PIX', parcela: '1/1', valor: 550.00, comissao: 2.75, liquido: 547.25, antecipado: false, status: 'Liquidado' },
]

const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

export default function AgendaInstallments() {
  const [search, setSearch] = useState('')
  const [bandeira, setBandeira] = useState<string | null>(null)
  const [lancamento, setLancamento] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [grouped, setGrouped] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    return ALL_ROWS.filter(r => {
      if (search && !r.nsu.toLowerCase().includes(search.toLowerCase())) return false
      if (bandeira && r.bandeira !== bandeira) return false
      if (lancamento && r.lancamento !== lancamento) return false
      if (status && r.status !== status) return false
      return true
    })
  }, [search, bandeira, lancamento, status])

  const activeFilters = [
    bandeira && { key: 'bandeira', label: `Bandeira: ${bandeira}`, clear: () => setBandeira(null) },
    lancamento && { key: 'lancamento', label: `Lançamento: ${lancamento}`, clear: () => setLancamento(null) },
    status && { key: 'status', label: `Status: ${status}`, clear: () => setStatus(null) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[]

  const clearAll = () => { setSearch(''); setBandeira(null); setLancamento(null); setStatus(null) }

  const totalBruto = filtered.reduce((s, r) => s + r.valor, 0)
  const totalComissao = filtered.reduce((s, r) => s + r.comissao, 0)
  const totalLiquido = filtered.reduce((s, r) => s + r.liquido, 0)
  const totalAntecipado = filtered.filter(r => r.antecipado).reduce((s, r) => s + r.valor, 0)

  // Group by date + bandeira
  const groups = useMemo(() => {
    const map: Record<string, Row[]> = {}
    filtered.forEach(r => {
      const k = `${r.data}__${r.bandeira}`
      if (!map[k]) map[k] = []
      map[k].push(r)
    })
    return Object.entries(map).map(([key, rows]) => ({ key, rows, data: rows[0].data, bandeira: rows[0].bandeira }))
  }, [filtered])

  const columns = [
    { title: 'Data', dataIndex: 'data', key: 'data', width: 100 },
    {
      title: 'NSU/Ref', dataIndex: 'nsu', key: 'nsu', width: 130,
      render: (v: string, r: Row) => (
        <div className="flex items-center gap-2">
          {r.antecipado && <div className="w-2 h-2 rounded-full bg-[#FA8C16] flex-shrink-0" />}
          <span className="font-mono text-xs text-[#1890FF]">{v}</span>
        </div>
      )
    },
    { title: 'Bandeira', dataIndex: 'bandeira', key: 'bandeira', width: 110, render: (v: string) => <Tag>{v}</Tag> },
    { title: 'Lançamento', dataIndex: 'lancamento', key: 'lancamento', width: 100 },
    { title: 'Nº Parcela', dataIndex: 'parcela', key: 'parcela', width: 90, align: 'center' as const },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', align: 'right' as const, render: (v: number) => fmt(v) },
    { title: 'Comissão', dataIndex: 'comissao', key: 'comissao', align: 'right' as const, render: (v: number) => <span className="text-[#FF4D4F]">{fmt(v)}</span> },
    { title: 'Valor Líquido', dataIndex: 'liquido', key: 'liquido', align: 'right' as const, render: (v: number) => <span className="font-semibold text-[#52C41A]">{fmt(v)}</span> },
    { title: 'Antecipado?', dataIndex: 'antecipado', key: 'antecipado', align: 'center' as const, render: (v: boolean) => v ? <Tag color="orange">Sim</Tag> : <span className="text-[rgba(0,0,0,0.45)] text-xs">—</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
  ]

  const kpis = [
    { label: 'Total bruto (filtrado)', value: fmt(totalBruto), variant: 'info' as const },
    { label: 'Comissões', value: fmt(totalComissao), variant: 'error' as const },
    { label: 'Total antecipado', value: fmt(totalAntecipado), variant: 'orange' as const },
    { label: 'Total líquido', value: fmt(totalLiquido), variant: 'success' as const },
  ]

  return (
    <div>
      {/* KPIs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm border border-[#f0f0f0] p-4 mb-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            prefix={<Search size={14} className="text-[rgba(0,0,0,0.45)]" />}
            placeholder="Buscar NSU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200, borderRadius: 2 }}
            size="small"
            allowClear
          />
          <Select placeholder="Bandeira" value={bandeira} onChange={setBandeira} size="small" allowClear style={{ width: 130, borderRadius: 2 }}>
            {['Visa','Mastercard','Elo','PIX'].map(b => <Option key={b} value={b}>{b}</Option>)}
          </Select>
          <Select placeholder="Lançamento" value={lancamento} onChange={setLancamento} size="small" allowClear style={{ width: 140, borderRadius: 2 }}>
            {['Crédito','Débito','PIX'].map(l => <Option key={l} value={l}>{l}</Option>)}
          </Select>
          <Select placeholder="Status" value={status} onChange={setStatus} size="small" allowClear style={{ width: 130, borderRadius: 2 }}>
            {['Pendente','Liquidado'].map(s => <Option key={s} value={s}>{s}</Option>)}
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs" style={{ color: 'rgba(0,0,0,0.65)' }}>Agrupar por bandeira</span>
            <Switch size="small" checked={grouped} onChange={setGrouped} />
          </div>
        </div>

        {/* Active chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {activeFilters.map(f => (
              <span key={f.key} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: '#E6F7FF', border: '1px solid #91D5FF', color: '#1890FF' }}>
                {f.label}
                <button onClick={f.clear}><X size={12} /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Limpar todos</button>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-sm border border-[#f0f0f0] p-12 flex flex-col items-center gap-4">
          <Search size={40} style={{ color: 'rgba(0,0,0,0.25)' }} />
          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.45)' }}>Nenhum resultado encontrado com os filtros aplicados.</p>
          <Button size="small" onClick={clearAll}>Limpar filtros</Button>
        </div>
      ) : !grouped ? (
        <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <Table columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 20, showSizeChanger: false }} />
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(g => {
            const isOpen = expanded[g.key]
            const sub = g.rows.reduce((s, r) => s + r.liquido, 0)
            return (
              <div key={g.key} className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <button
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#fafafa] transition-colors"
                  onClick={() => setExpanded(p => ({ ...p, [g.key]: !p[g.key] }))}
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-sm font-medium">{g.data}</span>
                    <Tag>{g.bandeira}</Tag>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>{g.rows.length} parcelas</span>
                  </div>
                  <span className="text-sm font-semibold text-[#52C41A]">Subtotal: {fmt(sub)}</span>
                </button>
                {isOpen && (
                  <Table columns={columns} dataSource={g.rows} size="small" pagination={false} showHeader={false} />
                )}
              </div>
            )
          })}
          <div className="flex justify-end px-4 py-3 rounded-sm" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
            <span className="text-sm font-bold text-[#1890FF]">TOTAL GERAL: {fmt(totalLiquido)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
