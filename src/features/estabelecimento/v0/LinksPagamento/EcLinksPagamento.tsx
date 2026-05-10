'use client'
// Links de Pagamento do Estabelecimento Comercial — V0.

import { useMemo, useState } from 'react'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'
import Drawer from '@/components/shared/Drawer'
import { ecLinksPagamento, type LinkPagamento } from '@/mocks/ec/cobrancas'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export default function EcLinksPagamento() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<LinkPagamento | null>(null)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ecLinksPagamento
    return ecLinksPagamento.filter(
      (l) =>
        l.nome.toLowerCase().includes(term) ||
        l.status.toLowerCase().includes(term) ||
        l.id.includes(term),
    )
  }, [search])

  const columns: ColumnType<LinkPagamento>[] = [
    { title: 'Criado em', dataIndex: 'criadoEm', key: 'criadoEm', width: 140 },
    { title: 'ID',           dataIndex: 'id',     key: 'id',     width: 80 },
    { title: 'Nome do link', dataIndex: 'nome',   key: 'nome' },
    {
      title:  'Formas',
      key:    'formas',
      width:  140,
      render: (_: unknown, row: LinkPagamento) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {row.formas.map((b) =>
            b === 'PIX' ? (
              <span key={b} style={{ fontSize: 12, fontWeight: 500, color: '#32BCAD' }}>PIX</span>
            ) : (
              <BrandLogo key={b} brand={b} size={20} />
            ),
          )}
        </span>
      ),
    },
    { title: 'Valor do link',     dataIndex: 'valor',            key: 'valor',            align: 'right', width: 140, render: (v: number) => fmtBRL(v) },
    { title: 'Pagamentos',        dataIndex: 'pagamentos',       key: 'pagamentos',       align: 'right', width: 110 },
    { title: 'Limite Pagamentos', dataIndex: 'limitePagamentos', key: 'limitePagamentos', align: 'right', width: 130 },
    { title: 'Total recebido',    dataIndex: 'totalRecebido',    key: 'totalRecebido',    align: 'right', width: 140, render: (v: number) => fmtBRL(v) },
    {
      title:  'Status',
      key:    'status',
      width:  130,
      render: (_: unknown, row: LinkPagamento) => (
        <Tag
          status={row.status === 'Concluído' ? 'Liquidado' : row.status === 'Ativo' ? 'Ativo' : 'Inativo'}
          label={row.status}
        />
      ),
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: LinkPagamento) => (
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

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Links de pagamento"
        breadcrumb="Estabelecimento Comercial / Cobranças / Links de pagamento"
        extra={
          <Button variant="primary" icon="plus">
            Criar link de pagamento
          </Button>
        }
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <DataTable<LinkPagamento>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquise por nome ou status"
          searchValue={search}
          onSearch={setSearch}
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes do link"
        width={480}
        footer={
          <>
            <button style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>Copiar URL</button>
            <button style={{ flex: 1, border: '1px solid #1890FF', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: '#1890FF' }}>Compartilhar</button>
          </>
        }
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Dados do link</span>
              <Tag status={selected.status === 'Concluído' ? 'Liquidado' : selected.status === 'Ativo' ? 'Ativo' : 'Inativo'} label={selected.status} />
            </div>
            {[
              { label: 'ID do link',        value: selected.id },
              { label: 'Nome do link',      value: selected.nome },
              { label: 'Formas aceitas',    value: selected.formas.join(', ') },
              { label: 'Valor',             value: `R$ ${selected.valor.toFixed(2).replace('.', ',')}` },
              { label: 'Pagamentos feitos', value: `${selected.pagamentos} de ${selected.limitePagamentos || '∞'}` },
              { label: 'Total recebido',    value: `R$ ${selected.totalRecebido.toFixed(2).replace('.', ',')}` },
              { label: 'Criado em',         value: selected.criadoEm },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </>
        )}
      </Drawer>
    </div>
  )
}
