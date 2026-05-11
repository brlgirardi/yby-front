'use client'
// Liquidações do Estabelecimento Comercial — V0.

import { useMemo, useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/atoms/Tag'
import Icon from '@/components/atoms/Icon'
import BrandLogo from '@/components/atoms/BrandLogo'
import Drawer from '@/components/shared/Drawer'
import Tooltip from '@/components/atoms/Tooltip'
import { ecLiquidacaoKpis, ecLiquidacoes, type LiquidacaoLancamento } from '@/mocks/ec/financeiro'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

const ALL_BANDEIRAS = ['Visa', 'Mastercard', 'Elo', 'Amex']
const ALL_STATUS_LIQ = ['Pago', 'Crédito Vendido', 'Pendente']

export default function EcLiquidacoes() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<LiquidacaoLancamento | null>(null)
  const [bandeiraFilter, setBandeiraFilter] = useState<string[]>(ALL_BANDEIRAS)
  const [statusFilter,   setStatusFilter]   = useState<string[]>(ALL_STATUS_LIQ)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    return ecLiquidacoes.filter((l) => {
      if (!bandeiraFilter.includes(l.bandeira)) return false
      if (!statusFilter.includes(l.status)) return false
      if (term && !(l.lancamento.toLowerCase().includes(term) || l.nsu.includes(term))) return false
      return true
    })
  }, [search, bandeiraFilter, statusFilter])

  const columns: ColumnType<LiquidacaoLancamento>[] = [
    { title: 'Data de pagamento', dataIndex: 'dataPagamento', key: 'dataPagamento', width: 140 },
    { title: 'Data da venda',     dataIndex: 'dataVenda',     key: 'dataVenda',     width: 140 },
    {
      title:  'Bandeira',
      key:    'bandeira',
      width:  110,
      render: (_: unknown, row: LiquidacaoLancamento) => <BrandLogo brand={row.bandeira} size={20} />,
    },
    { title: 'Lançamento',        dataIndex: 'lancamento',    key: 'lancamento',    width: 160 },
    { title: 'Origem',            dataIndex: 'origem',        key: 'origem',        width: 130 },
    { title: 'NSU',               dataIndex: 'nsu',           key: 'nsu',           width: 130 },
    { title: 'Valor da parcela',  dataIndex: 'valorParcela',  key: 'valorParcela',  align: 'right', width: 130, render: (v: number) => fmtBRL(v) },
    {
      title:  'Taxas',
      key:    'taxas',
      align:  'right',
      width:  100,
      render: (_: unknown, row: LiquidacaoLancamento) => (
        <span style={{ color: '#FF4D4F' }}>{fmtBRL(row.taxas)}</span>
      ),
    },
    {
      title:  'Valor líquido',
      key:    'valorLiquido',
      align:  'right',
      width:  130,
      render: (_: unknown, row: LiquidacaoLancamento) => (
        <span style={{ color: '#1890FF' }}>{fmtBRL(row.valorLiquido)}</span>
      ),
    },
    {
      title:  'Status',
      key:    'status',
      width:  170,
      render: (_: unknown, row: LiquidacaoLancamento) => {
        if (row.status === 'Crédito Vendido') {
          return (
            <Tooltip bare text="Esta parcela já foi antecipada antes — o dinheiro já caiu na sua conta numa data anterior. Aqui aparece com líquido R$ 0 porque o adquirente está pagando agora pra cobrir a antecipação.">
              <span style={{ display: 'inline-block', borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help' }}>
                <Tag status="Antecipado" label="Já antecipado" />
              </span>
            </Tooltip>
          )
        }
        return <Tag status={row.status === 'Pago' ? 'Pago' : 'Pendente'} />
      },
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: LiquidacaoLancamento) => (
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
      <PageHeader title="Liquidações" breadcrumb="Estabelecimento Comercial / Financeiro / Liquidações" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Últimos 7 dias</div>

        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Total de entradas" value={`+ ${fmtBRL(ecLiquidacaoKpis.totalEntradas)}`} subLabel="Caiu na conta no período"      variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Total de saídas"   value={`- ${fmtBRL(ecLiquidacaoKpis.totalSaidas)}`}   subLabel="Devoluções e estornos"           variant="error" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Taxas"              value={`- ${fmtBRL(ecLiquidacaoKpis.totalTaxas)}`}    subLabel="MDR + tarifas"                   variant="neutral" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Total líquido"     value={`+ ${fmtBRL(ecLiquidacaoKpis.totalLiquido)}`}  subLabel="Sobrou pra você"                 variant="info" /></div>
        </div>

        <DataTable<LiquidacaoLancamento>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquise o pagamento"
          searchValue={search}
          onSearch={setSearch}
          filters={[
            { label: 'Bandeira', options: ALL_BANDEIRAS.map((b) => ({ label: b, value: b })),  value: bandeiraFilter, onChange: setBandeiraFilter },
            { label: 'Status',   options: ALL_STATUS_LIQ.map((s) => ({ label: s, value: s })), value: statusFilter,   onChange: setStatusFilter },
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
        title="Detalhes da liquidação"
        width={480}
        footer={
          <button style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>
            Baixar comprovante
          </button>
        }
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Dados da liquidação</span>
              <Tag status={selected.status === 'Pago' ? 'Pago' : selected.status === 'Crédito Vendido' ? 'Antecipado' : 'Pendente'} />
            </div>
            {[
              { label: 'Data de pagamento', value: selected.dataPagamento },
              { label: 'Data da venda',     value: selected.dataVenda },
              { label: 'Bandeira',          value: selected.bandeira },
              { label: 'Lançamento',        value: selected.lancamento },
              { label: 'Origem',            value: selected.origem },
              { label: 'NSU',               value: selected.nsu },
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1890FF' }}>{fmtBRL(selected.valorParcela)}</div>
                </div>
                <div style={{ flex: 1, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Taxas</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ff4d4f' }}>{fmtBRL(selected.taxas)}</div>
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
