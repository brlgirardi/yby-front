'use client'
// Cobranças do Estabelecimento Comercial — V0.
// Lista de cobranças unificadas (POS, Link, Ecommerce) com filtros.

import { useMemo, useState } from 'react'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'
import ChannelChip from '@/components/shared/ChannelChip'
import Drawer from '@/components/shared/Drawer'
import { ecCobrancas, type Cobranca } from '@/mocks/ec/cobrancas'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

const ALL_FORMAS = ['Visa', 'Mastercard', 'Elo', 'Amex', 'PIX']
const ALL_CANAIS: { label: string; value: 'pos' | 'link' | 'ecommerce' }[] = [
  { label: 'POS',       value: 'pos' },
  { label: 'Link',      value: 'link' },
  { label: 'Ecommerce', value: 'ecommerce' },
]
const ALL_STATUS = ['Sucesso', 'Falha', 'Pendente']

export default function EcCobrancas() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Cobranca | null>(null)
  const [formaFilter,  setFormaFilter]  = useState<string[]>(ALL_FORMAS)
  const [canalFilter,  setCanalFilter]  = useState<string[]>(ALL_CANAIS.map((c) => c.value))
  const [statusFilter, setStatusFilter] = useState<string[]>(ALL_STATUS)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    return ecCobrancas.filter((c) => {
      if (!formaFilter.includes(c.brand)) return false
      if (!canalFilter.includes(c.canal)) return false
      if (!statusFilter.includes(c.status)) return false
      if (term && !(c.id.toLowerCase().includes(term) || c.cliente.toLowerCase().includes(term))) return false
      return true
    })
  }, [search, formaFilter, canalFilter, statusFilter])

  const columns: ColumnType<Cobranca>[] = [
    { title: 'Criado em',         dataIndex: 'criadoEm',        key: 'criadoEm', width: 140 },
    {
      title:     'ID da transação',
      dataIndex: 'id',
      key:       'id',
      width:     140,
      render:    (v: string) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'rgba(0,0,0,0.55)', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v}>{v}</span>
      ),
    },
    { title: 'Cliente',           dataIndex: 'cliente',         key: 'cliente' },
    {
      title:  'Canal',
      key:    'canal',
      width:  140,
      render: (_: unknown, row: Cobranca) => (
        <ChannelChip channel={row.canal} posId={row.canal === 'pos' ? row.canalDetalhe : undefined} />
      ),
    },
    {
      title:  'Forma de Pagamento',
      key:    'forma',
      width:  180,
      render: (_: unknown, row: Cobranca) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
          {row.brand === 'PIX' ? (
            <span style={{ fontWeight: 500, color: '#32BCAD' }}>PIX</span>
          ) : (
            <BrandLogo brand={row.brand} size={20} />
          )}
          <span>{row.parcelas}x</span>
        </span>
      ),
    },
    {
      title:     'Valor',
      dataIndex: 'valor',
      key:       'valor',
      align:     'right',
      width:     140,
      render:    (v: number) => fmtBRL(v),
    },
    {
      title:  'Status',
      key:    'status',
      width:  120,
      render: (_: unknown, row: Cobranca) => (
        <Tag status={row.status === 'Sucesso' ? 'Pago' : row.status === 'Falha' ? 'Erro' : 'Pendente'} />
      ),
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: Cobranca) => (
        <button
          aria-label="Ver detalhes"
          onClick={(e) => { e.stopPropagation(); setSelected(row) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)' }}
        >
          <Icon name="eye" size={16} />
        </button>
      ),
    },
  ]

  const channelLabel: Record<Cobranca['canal'], string> = {
    pos: 'POS', link: 'Link de pagamento', ecommerce: 'Ecommerce',
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Cobranças" breadcrumb="Estabelecimento Comercial / Cobranças" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <DataTable<Cobranca>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquise o pagamento"
          searchValue={search}
          onSearch={setSearch}
          filters={[
            { label: 'Formas',  options: ALL_FORMAS.map((f) => ({ label: f, value: f })),                             value: formaFilter,  onChange: setFormaFilter },
            { label: 'Canais',  options: ALL_CANAIS,                                                                   value: canalFilter,  onChange: setCanalFilter },
            { label: 'Status',  options: ALL_STATUS.map((s) => ({ label: s, value: s })),                             value: statusFilter, onChange: setStatusFilter },
          ]}
          periodOptions={[
            { label: 'Últimos 7 dias',  value: '7d' },
            { label: 'Este mês',        value: 'mes' },
            { label: 'Mês anterior',    value: 'mes_ant' },
          ]}
          defaultPeriod="7d"
          onExport={() => undefined}
          onAdvancedFilter={() => undefined}
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes da cobrança"
        width={480}
        footer={
          <button
            style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}
          >
            Baixar comprovante
          </button>
        }
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Dados da cobrança</span>
              <Tag status={selected.status === 'Sucesso' ? 'Pago' : selected.status === 'Falha' ? 'Erro' : 'Pendente'} />
            </div>
            {[
              { label: 'ID da transação',   value: selected.id },
              { label: 'Cliente',           value: selected.cliente },
              { label: 'Canal',             value: channelLabel[selected.canal] + (selected.canal === 'pos' && selected.canalDetalhe ? ` · POS-${selected.canalDetalhe}` : '') },
              { label: 'Forma de pagamento',value: `${selected.brand} ${selected.parcelas}x` },
              { label: 'Criado em',         value: selected.criadoEm },
              { label: 'Última transação',  value: selected.ultimaTransacao },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12 }}>Resumo financeiro</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Bruto</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1890FF' }}>{fmtBRL(selected.valor)}</div>
                </div>
                <div style={{ flex: 1, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Taxa</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ff4d4f' }}>{fmtBRL(selected.valor * 0.01)}</div>
                </div>
                <div style={{ flex: 1, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Líquido</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#52c41a' }}>{fmtBRL(selected.valor * 0.99)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
