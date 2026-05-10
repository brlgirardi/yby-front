'use client'
// Antecipações do Estabelecimento Comercial — V0.
// 3 KPIs (Total recebíveis 7d, Hoje, Futuro) + tabela com Simular.
//
// Pixel/Rian (Enviesados cap. 6 — enquadramento + cap. 2 — aversão à perda):
// Mostrar "Valor líquido" como GANHO (azul/verde), e a Taxa como custo
// secundário mas TRANSPARENTE — não esconder. EC V0 já tem antecipação
// automática ligada por default; o botão "Simular antecipação" permite
// explorar cenários sem se comprometer (cap. 4 — não cria custo afundado).

import { useMemo, useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'
import SimulacaoDrawer from '@/features/estabelecimento/v0/shared/SimulacaoDrawer'
import Drawer from '@/components/shared/Drawer'
import { ecAntecipacaoKpis, ecAntecipacoes, type AntecipacaoOperacao, type ParcelaAntecipada } from '@/mocks/ec/financeiro'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export default function EcAntecipacoes() {
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<AntecipacaoOperacao | null>(null)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ecAntecipacoes
    return ecAntecipacoes.filter((a) => a.dataPagamento.includes(term))
  }, [search])

  const columns: ColumnType<AntecipacaoOperacao>[] = [
    { title: 'Data de liquidação',    dataIndex: 'dataPagamento',        key: 'dataPagamento',        width: 180 },
    {
      title:  'Parcelas',
      key:    'qtd',
      width:  90,
      align:  'center',
      render: (_: unknown, row: AntecipacaoOperacao) => row.parcelas.length,
    },
    { title: 'Valor bruto',           dataIndex: 'valorBruto',           key: 'valorBruto',           align: 'right', width: 140, render: (v: number) => fmtBRL(v) },
    {
      title:  'Taxa',
      key:    'taxa',
      align:  'right',
      width:  120,
      render: (_: unknown, row: AntecipacaoOperacao) => (
        <span style={{ color: '#FF4D4F' }}>{fmtBRL(row.taxa)}</span>
      ),
    },
    {
      title:  'Valor líquido',
      key:    'valorLiquido',
      align:  'right',
      width:  140,
      render: (_: unknown, row: AntecipacaoOperacao) => (
        <span style={{ color: '#1890FF', fontWeight: 500 }}>{fmtBRL(row.valorLiquido)}</span>
      ),
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: AntecipacaoOperacao) => (
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

  // Tabela aninhada — parcelas da operação expandida
  const parcelaColumns: ColumnType<ParcelaAntecipada>[] = [
    { title: 'NSU',          dataIndex: 'transacaoId',         key: 'transacaoId',         width: 130, render: (v: string) => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{v}</span> },
    { title: 'Parcela',      dataIndex: 'parcela',             key: 'parcela',             width: 90 },
    {
      title:  'Bandeira',
      key:    'bandeira',
      width:  100,
      render: (_: unknown, row: ParcelaAntecipada) => <BrandLogo brand={row.bandeira} size={20} />,
    },
    { title: 'Data prevista', dataIndex: 'dataPrevistaOriginal', key: 'dataPrevistaOriginal', width: 130 },
    {
      title:  'Valor original',
      key:    'valorOriginal',
      align:  'right',
      width:  130,
      render: (_: unknown, row: ParcelaAntecipada) => (
        <span style={{ color: 'rgba(0,0,0,0.65)' }}>{fmtBRL(row.valorOriginal)}</span>
      ),
    },
    {
      title:  'Antecipado',
      key:    'valorAntecipado',
      align:  'right',
      width:  150,
      render: (_: unknown, row: ParcelaAntecipada) => (
        <span style={{ fontWeight: 500 }}>{fmtBRL(row.valorAntecipado)}</span>
      ),
    },
    { title: 'Taxa',          key: 'taxa',          align: 'right', width: 100, render: (_: unknown, row: ParcelaAntecipada) => <span style={{ color: '#FF4D4F' }}>{fmtBRL(row.taxa)}</span> },
    { title: 'Valor líquido', key: 'valorLiquido',  align: 'right', width: 130, render: (_: unknown, row: ParcelaAntecipada) => <span style={{ color: '#1890FF' }}>{fmtBRL(row.valorLiquido)}</span> },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Antecipações"
        breadcrumb="Estabelecimento Comercial / Financeiro / Antecipações"
        extra={<Button variant="primary" onClick={() => setDrawerOpen(true)}>Simular antecipação</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Antecipei nos últimos 7 dias" value={fmtBRL(ecAntecipacaoKpis.totalRecebiveis7Dias)} subLabel="Total já recebido antecipado" variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Vai cair hoje"               value={fmtBRL(ecAntecipacaoKpis.totalHoje)}            subLabel="Antecipações que liquidam em 30/10" variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="A receber no futuro"         value={fmtBRL(ecAntecipacaoKpis.noFuturo)}             subLabel="Próximas antecipações já programadas" variant="info" /></div>
        </div>

        <DataTable<AntecipacaoOperacao>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquise por data ou NSU"
          searchValue={search}
          onSearch={setSearch}
          periodOptions={[
            { label: 'Últimos 7 dias',  value: '7d' },
            { label: 'Este mês',        value: 'mes' },
          ]}
          defaultPeriod="7d"
          onExport={() => undefined}
          onAdvancedFilter={() => undefined}
          expandable={{
            expandedRowRender: (record: AntecipacaoOperacao) => (
              <div style={{ padding: '8px 0' }}>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', padding: '0 0 8px' }}>
                  Parcelas antecipadas nesta operação · valores parciais marcados com a tag "Antecipado"
                </div>
                <DataTable<ParcelaAntecipada>
                  columns={parcelaColumns}
                  dataSource={record.parcelas}
                  rowKey="transacaoId"
                  showPagination={false}
                />
              </div>
            ),
            rowExpandable: (record: AntecipacaoOperacao) => record.parcelas.length > 0,
          }}
        />
      </div>
      <SimulacaoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes da liquidação antecipada"
        width={480}
      >
        {selected && (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 20 }}>Dados da operação</div>
            {[
              { label: 'Data de pagamento',         value: selected.dataPagamento },
              { label: 'Quantidade de transações', value: String(selected.quantidadeTransacoes).padStart(2, '0') },
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1890FF' }}>{fmtBRL(selected.valorBruto)}</div>
                </div>
                <div style={{ flex: 1, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Taxa</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ff4d4f' }}>{fmtBRL(selected.taxa)}</div>
                </div>
                <div style={{ flex: 1, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Líquido</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#52c41a' }}>{fmtBRL(selected.valorLiquido)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
