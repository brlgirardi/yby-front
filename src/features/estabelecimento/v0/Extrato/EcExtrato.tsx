'use client'
// Extrato do Estabelecimento Comercial — V0.
// 3 KPIs principais (Saldo atual, A receber hoje, Recebimentos futuros)
// + 4 KPIs do período (entradas/saídas/taxas/líquido) + tabela detalhada.
//
// Pixel/Rian (Enviesados cap. 8 — afeto): "Saldo atual" é o número que
// tranquiliza o EC pequeno. Variant info (azul) destacado.

import { useMemo, useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/atoms/Icon'
import Tooltip from '@/components/atoms/Tooltip'
import Drawer from '@/components/shared/Drawer'
import { ecExtratoKpis, ecExtratoLancamentos, type ExtratoLancamento } from '@/mocks/ec/financeiro'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

const fmtSigned = (v: number, sign: '+' | '-') =>
  `${sign} ${fmtBRL(Math.abs(v))}`

export default function EcExtrato() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ExtratoLancamento | null>(null)

  const ALL_FORMAS_EXT = ['Crédito', 'Débito', 'PIX']
  const ALL_PRODUTOS_EXT = ['CP', 'CNP']
  const [formaFilter,   setFormaFilter]   = useState<string[]>(ALL_FORMAS_EXT)
  const [produtoFilter, setProdutoFilter] = useState<string[]>(ALL_PRODUTOS_EXT)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    return ecExtratoLancamentos.filter((l) => {
      if (!formaFilter.includes(l.forma)) return false
      if (!produtoFilter.includes(l.produto)) return false
      if (term && !(l.idOperacao.includes(term) || l.idTransacao.includes(term) || l.descricao.toLowerCase().includes(term))) return false
      return true
    })
  }, [search, formaFilter, produtoFilter])

  const columns: ColumnType<ExtratoLancamento>[] = [
    { title: 'Data',           dataIndex: 'data',        key: 'data',        width: 140 },
    { title: 'ID da operação', dataIndex: 'idOperacao',  key: 'idOperacao',  width: 130 },
    { title: 'ID da transação',dataIndex: 'idTransacao', key: 'idTransacao', width: 140 },
    { title: 'Forma de pagamento', dataIndex: 'forma',   key: 'forma',       width: 160 },
    { title: 'Produto',        dataIndex: 'produto',     key: 'produto',     width: 90 },
    { title: 'Descrição',      dataIndex: 'descricao',   key: 'descricao' },
    {
      title:  'Entradas',
      key:    'entrada',
      align:  'right',
      width:  120,
      render: (_: unknown, row: ExtratoLancamento) => (
        <span style={{ color: '#237804' }}>{fmtSigned(row.entrada, '+')}</span>
      ),
    },
    {
      title:  (
        <Tooltip bare text="MDR (Merchant Discount Rate) — taxa cobrada sobre cada venda. É o custo de aceitar cartão.">
          <span style={{ borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help' }}>Saídas (MDR)</span>
        </Tooltip>
      ),
      key:    'saida',
      align:  'right',
      width:  140,
      render: (_: unknown, row: ExtratoLancamento) => (
        <span style={{ color: '#FF4D4F' }}>{fmtSigned(row.saida, '-')}</span>
      ),
    },
    {
      title:  'Total',
      key:    'total',
      align:  'right',
      width:  120,
      render: (_: unknown, row: ExtratoLancamento) => (
        <span style={{ color: '#237804', fontWeight: 500 }}>{fmtSigned(row.total, '+')}</span>
      ),
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: ExtratoLancamento) => (
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
      <PageHeader title="Extrato" breadcrumb="Estabelecimento Comercial / Financeiro / Extrato" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Saldo + previsões */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Saldo atual"          value={fmtBRL(ecExtratoKpis.saldoAtual)}          subLabel="Disponível na sua conta agora"      variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="A receber hoje"       value={fmtBRL(ecExtratoKpis.aReceberHoje)}        subLabel="Vai cair até o fim do dia"          variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Recebimentos futuros" value={fmtBRL(ecExtratoKpis.recebimentosFuturos)} subLabel="Próximos dias · você pode antecipar" variant="info" /></div>
        </div>

        {/* KPIs do período */}
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Últimos 7 dias</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Total de entradas" value={`+ ${fmtBRL(ecExtratoKpis.totalEntradas)}`} subLabel="O que entrou na conta"            variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Total de saídas"   value={`- ${fmtBRL(ecExtratoKpis.totalSaidas)}`}   subLabel="Pagamentos e devoluções"           variant="error" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Taxas"              value={`- ${fmtBRL(ecExtratoKpis.totalTaxas)}`}    subLabel="MDR + tarifas operacionais"        variant="neutral" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Total líquido"     value={`+ ${fmtBRL(ecExtratoKpis.totalLiquido)}`}  subLabel="Sobrou pra você no período"        variant="info" /></div>
        </div>

        {/* Tabela */}
        <DataTable<ExtratoLancamento>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquise o pagamento"
          searchValue={search}
          onSearch={setSearch}
          filters={[
            { label: 'Forma',   options: ALL_FORMAS_EXT.map((f) => ({ label: f, value: f })),   value: formaFilter,   onChange: setFormaFilter },
            { label: 'Produto', options: ALL_PRODUTOS_EXT.map((p) => ({ label: p, value: p })), value: produtoFilter, onChange: setProdutoFilter },
          ]}
          periodOptions={[
            { label: 'Últimos 7 dias',  value: '7d' },
            { label: 'Este mês',        value: 'mes' },
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
        title="Detalhes do lançamento"
        width={480}
      >
        {selected && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 20 }}>Dados do lançamento</div>
            {[
              { label: 'Data',              value: selected.data },
              { label: 'ID da operação',    value: selected.idOperacao },
              { label: 'ID da transação',   value: selected.idTransacao },
              { label: 'Forma de pagamento',value: selected.forma },
              { label: 'Produto',           value: selected.produto },
              { label: 'Descrição',         value: selected.descricao },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12 }}>Movimentação</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Entrada</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#237804' }}>+ {fmtBRL(selected.entrada)}</div>
                </div>
                <div style={{ flex: 1, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Saída (MDR)</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FF4D4F' }}>− {fmtBRL(selected.saida)}</div>
                </div>
                <div style={{ flex: 1, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Total</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1890FF' }}>+ {fmtBRL(selected.total)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
