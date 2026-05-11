'use client'
// Antecipações do Estabelecimento Comercial — V0.
// 3 KPIs (Total recebíveis 7d, Hoje, Futuro) + tabela com Simular.
//
// Pixel/Rian (Enviesados cap. 6 — enquadramento + cap. 2 — aversão à perda):
// Mostrar "Valor líquido" como GANHO (azul/verde), e a Taxa como custo
// secundário mas TRANSPARENTE — não esconder. EC V0 já tem antecipação
// automática ligada por default; o botão "Simular antecipação" permite
// explorar cenários sem se comprometer (cap. 4 — não cria custo afundado).

import { useEffect, useMemo, useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import BrandLogo from '@/components/atoms/BrandLogo'
import SimulacaoDrawer from '@/features/estabelecimento/v0/shared/SimulacaoDrawer'
import Drawer from '@/components/shared/Drawer'
import { ecAntecipacaoKpis, ecAntecipacoes, type AntecipacaoOperacao } from '@/mocks/ec/financeiro'

const PAGE_SIZE = 10

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export default function EcAntecipacoes() {
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<AntecipacaoOperacao | null>(null)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => { setPageIndex(0) }, [selected?.id])

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ecAntecipacoes
    return ecAntecipacoes.filter((a) => a.dataPagamento.includes(term))
  }, [search])

  const totalPaginas = selected ? Math.max(1, Math.ceil(selected.parcelas.length / PAGE_SIZE)) : 0
  const parcelasPaginadas = selected
    ? selected.parcelas.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)
    : []

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
        />
      </div>
      <SimulacaoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes da liquidação antecipada"
        width={520}
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

            <section
              aria-labelledby="parcelas-heading"
              style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}
            >
              <div
                id="parcelas-heading"
                style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}
              >
                Parcelas antecipadas
              </div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', marginBottom: 12 }}>
                {selected.parcelas.length === 1
                  ? '1 parcela nesta operação'
                  : `${selected.parcelas.length} parcelas nesta operação`}
              </div>

              {selected.parcelas.length === 0 ? (
                <div
                  role="status"
                  style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', padding: '24px 0', textAlign: 'center' }}
                >
                  Nenhuma parcela disponível para esta operação.
                </div>
              ) : (
                <>
                  <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {parcelasPaginadas.map((p, idx) => {
                      const numero = pageIndex * PAGE_SIZE + idx + 1
                      return (
                        <li
                          key={p.transacaoId}
                          role="listitem"
                          style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
                                Parcela {numero}/{selected.parcelas.length}
                              </span>
                              <span aria-hidden="true">
                                <BrandLogo brand={p.bandeira} size={16} />
                              </span>
                              {p.parcial && (
                                <span
                                  aria-label="Antecipação parcial"
                                  style={{
                                    background: '#FFF7E6',
                                    border: '1px solid #FFE58F',
                                    color: '#D48806',
                                    padding: '2px 6px',
                                    borderRadius: 2,
                                    fontSize: 10,
                                    fontWeight: 500,
                                  }}
                                >
                                  Parcial
                                </span>
                              )}
                            </div>
                            <span style={{ fontWeight: 600, color: '#1890FF', fontSize: 14 }}>
                              {fmtBRL(p.valorAntecipado)}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: 4,
                              fontSize: 11,
                              color: 'rgba(0,0,0,0.55)',
                            }}
                          >
                            <span style={{ fontFamily: 'ui-monospace, monospace' }}>NSU {p.transacaoId}</span>
                            <span>Prevista {p.dataPrevistaOriginal}</span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: 2,
                              fontSize: 11,
                              color: 'rgba(0,0,0,0.55)',
                            }}
                          >
                            <span>Valor original {fmtBRL(p.valorOriginal)}</span>
                            <span style={{ color: '#FF4D4F' }}>Taxa {fmtBRL(p.taxa)}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  {totalPaginas > 1 && (
                    <nav
                      aria-label="Paginação de parcelas"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 12,
                        marginTop: 16,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                        disabled={pageIndex === 0}
                        style={{
                          height: 32,
                          minWidth: 88,
                          padding: '0 12px',
                          fontSize: 12,
                          borderRadius: 2,
                          border: '1px solid #d9d9d9',
                          background: '#fff',
                          color: 'rgba(0,0,0,0.85)',
                          cursor: pageIndex === 0 ? 'not-allowed' : 'pointer',
                          opacity: pageIndex === 0 ? 0.4 : 1,
                        }}
                      >
                        Anterior
                      </button>
                      <span
                        aria-live="polite"
                        aria-atomic="true"
                        style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}
                      >
                        Página {pageIndex + 1} de {totalPaginas}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPageIndex((i) => Math.min(totalPaginas - 1, i + 1))}
                        disabled={pageIndex >= totalPaginas - 1}
                        style={{
                          height: 32,
                          minWidth: 88,
                          padding: '0 12px',
                          fontSize: 12,
                          borderRadius: 2,
                          border: '1px solid #d9d9d9',
                          background: '#fff',
                          color: 'rgba(0,0,0,0.85)',
                          cursor: pageIndex >= totalPaginas - 1 ? 'not-allowed' : 'pointer',
                          opacity: pageIndex >= totalPaginas - 1 ? 0.4 : 1,
                        }}
                      >
                        Próximo
                      </button>
                    </nav>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </Drawer>
    </div>
  )
}
