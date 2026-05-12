'use client'
// Dashboard Financeiro Adquirente — 2 abas (Planitização / Conciliação ITC).
// Usa CardSection padrão + wrappers Recharts tematáveis (Tupi/Vero).
// Sem mais SVG inline manual: tudo via @/components/charts.

import { useMemo, useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import CardSection from '@/components/shared/CardSection'
import Tag from '@/components/atoms/Tag'
import BrandLogo from '@/components/atoms/BrandLogo'
import AppSelect from '@/components/ui/AppSelect'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import { useTheme } from '@/stores/themeStore'
import {
  DonutBreakdown,
  MultiLineKPI,
  BarList,
  WaterfallChart,
  HeatmapGrid,
  LineKPI,
} from '@/components/charts'
import {
  bandeiraDistribuicao,
  bandeiraTimeline,
  platinizacaoTop15,
  itcPorBandeiraModalidade,
  mixCategoriaPorBandeira,
  itcTimeline,
  itcKpis,
  coberturaWaterfall,
  conciliacaoVsDivergencia,
  impactoDivergencias,
  resultadoFinanceiroItc,
  irregularidadesPorBandeira,
  platinizacaoHeatmap,
  top10CartoesItc,
  type TopCardItc,
} from '@/mocks/adquirente/dashboard'

type TabKey = 'planitizacao' | 'itc'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
const fmtBRLcompact = (v: number) =>
  Math.abs(v) >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M`
  : Math.abs(v) >= 1_000   ? `R$ ${(v / 1_000).toFixed(0)}k`
  : `R$ ${v.toLocaleString('pt-BR')}`

export default function AqDashboard() {
  const [tab, setTab] = useState<TabKey>('planitizacao')
  const theme = useTheme()

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'planitizacao', label: 'Planitização' },
    { key: 'itc',          label: 'Conciliação ITC' },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Dashboard Financeiro" breadcrumb="Adquirente / Dashboard" noBorder />

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px', display: 'flex', gap: 4 }}>
        {tabs.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '14px 16px',
                fontSize: 13,
                color: active ? theme.primary : 'rgba(0,0,0,0.65)',
                fontWeight: active ? 500 : 400,
                cursor: 'pointer',
                borderBottom: active ? `2px solid ${theme.primary}` : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {tab === 'planitizacao' && (
          <>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 12 }}>
              <AppSelect placeholder="Todos os Adquirentes"     style={{ width: 220 }} options={[{ value: 'all', label: 'Todos os Adquirentes' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os Estabelecimentos" style={{ width: 280 }} options={[{ value: 'all', label: 'Todos os Estabelecimentos' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os MCCs"             style={{ width: 220 }} options={[{ value: 'all', label: 'Todos os MCCs' }]} defaultValue="all" />
            </div>

            {/* Decisão de precificação — destaque no topo da aba */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
              <CardSection
                title="Custo (ITC) por bandeira e modalidade"
                subtitle="Use para precificar — leia o ITC do produto e some sua margem"
                icon="grid"
                noBodyPadding
              >
                <HeatmapGrid
                  data={itcPorBandeiraModalidade.map((c) => ({
                    row: c.bandeira,
                    col: c.modalidade,
                    value: c.pct,
                  }))}
                  columns={['Débito', 'Crédito à vista', 'Crédito 2-6x', 'Crédito 6-12x']}
                  formatValue={(v) => (v === 0 ? '—' : `${v.toFixed(2).replace('.', ',')}%`)}
                  renderRow={(r) => (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <BrandLogo brand={r} size={24} />
                      <span>{r}</span>
                    </span>
                  )}
                />
              </CardSection>

              <CardSection
                title="Mix de cartões por bandeira e categoria"
                subtitle="Use para precificar — % dentro de cada bandeira"
                icon="creditCard"
                noBodyPadding
              >
                <HeatmapGrid
                  data={mixCategoriaPorBandeira.map((c) => ({
                    row: c.bandeira,
                    col: c.categoria,
                    value: c.pct,
                  }))}
                  columns={['Entry Level', 'Mid-Tier', 'Premium Core', 'Ultra Premium', 'Corporate']}
                  rows={['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard']}
                  formatValue={(v) => (v === 0 ? '—' : `${v}%`)}
                  renderRow={(r) => (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <BrandLogo brand={r} size={24} />
                      <span>{r}</span>
                    </span>
                  )}
                />
              </CardSection>
            </div>

            <ItcTimelineCard />


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
              <CardSection title="Distribuição de contagem por bandeira" icon="filter">
                <DonutBreakdown
                  data={bandeiraDistribuicao.map((b) => ({ label: b.bandeira, value: b.pct, color: b.color }))}
                  formatValue={(v) => `${v.toFixed(1)}%`}
                />
              </CardSection>

              <CardSection title="Quantidade e % por bandeira" icon="trendingUp" subtitle="Últimos 6 meses">
                <MultiLineKPI
                  data={bandeiraTimeline as unknown as Array<Record<string, string | number>>}
                  xKey="mes"
                  series={[
                    { key: 'mastercard', label: 'Mastercard' },
                    { key: 'visa',       label: 'Visa',  color: '#FA8C16' },
                    { key: 'elo',        label: 'Elo',   color: '#52C41A' },
                  ]}
                />
              </CardSection>
            </div>

            <CardSection title="Platinização — Top 15" icon="barChart" subtitle="Volume por categoria de cartão">
              <BarList
                data={platinizacaoTop15.map((p) => ({
                  label: `${p.categoria}`,
                  sublabel: `(${p.bandeira.toLowerCase()})`,
                  value: p.valor,
                }))}
              />
            </CardSection>
          </>
        )}

        {tab === 'itc' && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <AppSelect placeholder="Mês atual"           style={{ width: 160 }} options={[{ value: 'mes', label: 'Mês atual' }]} defaultValue="mes" />
              <AppSelect placeholder="Todos os Adquirentes" style={{ width: 200 }} options={[{ value: 'all', label: 'Todos os Adquirentes' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os ECs"         style={{ width: 200 }} options={[{ value: 'all', label: 'Todos os ECs' }]} defaultValue="all" />
              <AppSelect placeholder="Todas as Bandeiras"   style={{ width: 200 }} options={[{ value: 'all', label: 'Todas as Bandeiras' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os MCCs"        style={{ width: 200 }} options={[{ value: 'all', label: 'Todos os MCCs' }]} defaultValue="all" />
              <AppSelect placeholder="Todas Categorias"     style={{ width: 180 }} options={[{ value: 'all', label: 'Todas Categorias' }]} defaultValue="all" />
            </div>

            {/* KPIs ITC */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {itcKpis.map((k) => (
                <div key={k.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderLeft: `3px solid ${k.deltaTone === 'success' ? '#52C41A' : '#FA8C16'}`, borderRadius: 2, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(0,0,0,0.85)' }}>{k.valor}</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>{k.sub}</div>
                  <div style={{ fontSize: 11, color: k.deltaTone === 'success' ? '#52C41A' : '#FF4D4F', marginTop: 4 }}>
                    {k.delta}
                  </div>
                </div>
              ))}
            </div>

            <CardSection
              title="Cobertura analítica — elegibilidade das transações"
              subtitle="Distribuição e perda de elegibilidade ao longo do processo de conciliação"
              icon="filter"
            >
              <WaterfallChart
                data={coberturaWaterfall.map((d) => ({ label: d.label, value: d.valor, tone: d.tone }))}
                formatValue={(v) => v.toLocaleString('pt-BR')}
                height={260}
              />
            </CardSection>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <CardSection title="Conciliação × Divergência" icon="checkCircle">
                {(() => {
                  const total = conciliacaoVsDivergencia.reduce((s, x) => s + x.valor, 0)
                  return (
                    <>
                      <div style={{ display: 'flex', height: 32, borderRadius: 2, overflow: 'hidden' }}>
                        {conciliacaoVsDivergencia.map((c) => (
                          <div key={c.label} style={{
                            flexBasis: `${(c.valor / total) * 100}%`,
                            background: c.label === 'Conciliada' ? '#52C41A' : '#FF4D4F',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {c.valor.toLocaleString('pt-BR')}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, fontSize: 12 }}>
                        <span style={{ color: '#52C41A' }}>● Conciliada</span>
                        <span style={{ color: '#FF4D4F' }}>● Divergente</span>
                      </div>
                    </>
                  )
                })()}
              </CardSection>

              <CardSection title="Impacto das divergências" icon="alertTriangle">
                <BarList
                  data={impactoDivergencias.map((i) => ({
                    label: i.label,
                    value: i.valor,
                    color: i.label === 'Conciliada' ? '#52C41A' : '#FAAD14',
                  }))}
                />
              </CardSection>
            </div>

            <CardSection title="Resultado financeiro ITC" subtitle="Impacto líquido por mês" icon="trendingUp">
              <LineKPI
                data={resultadoFinanceiroItc.map((r) => ({ label: r.mes, value: r.valor }))}
                area={false}
                formatValue={(v) => `${v >= 0 ? '+' : ''}${v.toLocaleString('pt-BR')}`}
              />
            </CardSection>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {irregularidadesPorBandeira.map((b) => (
                <CardSection key={b.bandeira} title={b.bandeira} icon="creditCard">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <BrandLogo brand={b.bandeira} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Exposição & saldo</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>TPV divergente</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.primary, marginBottom: 10 }}>{fmtBRLcompact(b.tpvDivergente)}</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Saldo líquido</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12 }}>{fmtBRL(b.saldoLiquido)}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Tag status="Aprovado" label={`+${b.diffPosPct}% (R$ ${b.diffPosVal})`} />
                    <Tag status="Erro"     label={`${b.diffNegPct}% (R$ ${b.diffNegVal})`} />
                  </div>
                </CardSection>
              ))}
            </div>

            <CardSection
              title="Platinização — distribuição por MCC × Tier"
              subtitle="Identificação de retenções de categoria por segmento"
              icon="grid"
              noBodyPadding
            >
              <HeatmapGrid
                data={platinizacaoHeatmap.map((c) => ({ row: c.mcc, col: c.tier, value: c.pct }))}
                columns={['Entry', 'Mid', 'Premium', 'Ultra']}
              />
            </CardSection>

            {/* Top 10 cartões ITC */}
            {(() => {
              const topCols: ColumnType<TopCardItc>[] = [
                { title: '#',         dataIndex: 'rank',     key: 'rank',     width: 50, render: (v: number) => <span style={{ color: 'rgba(0,0,0,0.45)' }}>{v}</span> },
                { title: 'Bandeira',  dataIndex: 'bandeira', key: 'bandeira', width: 90, render: (v: string) => <BrandLogo brand={v} size={22} /> },
                { title: 'Cartão',    dataIndex: 'cartao',   key: 'cartao',   render: (v: string) => <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>{v}</span> },
                { title: 'Categoria', dataIndex: 'categoria', key: 'categoria', width: 110, render: (v: string) => <Tag status="Info" label={v} showIcon={false} /> },
                { title: 'Volume',    dataIndex: 'volume',   key: 'volume',   align: 'right', width: 110, render: (v: number) => v.toLocaleString('pt-BR') },
                {
                  title: 'R$ Diverg.', dataIndex: 'divergValor', key: 'divergValor', align: 'right', width: 130,
                  render: (v: number) => (
                    <span style={{ color: v >= 0 ? '#52C41A' : '#FF4D4F', fontWeight: 600 }}>
                      {v >= 0 ? '+' : ''}R$ {v.toLocaleString('pt-BR')}
                    </span>
                  ),
                },
                { title: '% Diverg.', dataIndex: 'divergPct', key: 'divergPct', align: 'right', width: 100, render: (v: number) => `${v}%` },
                { title: 'Saldo',     dataIndex: 'saldo',     key: 'saldo',     align: 'right', width: 110, render: (v: number) => <span style={{ fontWeight: 500 }}>R$ {v.toLocaleString('pt-BR')}</span> },
              ]
              return (
                <DataTable<TopCardItc>
                  title="Top 10 cartões com maior impacto ITC"
                  columns={topCols}
                  dataSource={top10CartoesItc}
                  rowKey="rank"
                  showPagination={false}
                />
              )
            })()}
          </>
        )}
      </div>
    </div>
  )
}

// ── Card: Timeline ITC mensal — todas as bandeiras, seletor de modalidade ──
const BANDEIRAS_ITC = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'] as const
const MODALIDADES_ITC = ['Débito', 'Crédito à vista', 'Crédito 2-6x', 'Crédito 6-12x'] as const

// Cores aproximadas das bandeiras (paleta oficial, ajustadas para legibilidade em linha).
const BANDEIRA_COLORS: Record<string, string> = {
  Visa:       '#1A1F71', // azul Visa
  Mastercard: '#EB001B', // vermelho Mastercard
  Elo:        '#00A4E0', // azul Elo (mais legível que o amarelo oficial)
  Amex:       '#2E77BB', // azul Amex
  Hipercard:  '#B3131B', // vinho Hipercard
}

function ItcTimelineCard() {
  const [modalidade, setModalidade] = useState<string>('Crédito à vista')

  // Pivota itcTimeline: cada mês vira uma row com 1 coluna por bandeira.
  const data = useMemo(() => {
    const meses = Array.from(new Set(itcTimeline.map((p) => p.mes)))
    return meses.map((mes) => {
      const row: Record<string, string | number> = { mes }
      for (const b of BANDEIRAS_ITC) {
        const point = itcTimeline.find(
          (p) => p.mes === mes && p.bandeira === b && p.modalidade === modalidade,
        )
        if (point && point.pct > 0) row[b] = point.pct
      }
      return row
    })
  }, [modalidade])

  // Filtra bandeiras que têm pelo menos um valor > 0 (ex: Amex não opera débito).
  const seriesAtivas = useMemo(
    () =>
      BANDEIRAS_ITC.filter((b) =>
        itcTimeline.some(
          (p) => p.bandeira === b && p.modalidade === modalidade && p.pct > 0,
        ),
      ).map((b) => ({ key: b, label: b, color: BANDEIRA_COLORS[b] })),
    [modalidade],
  )

  return (
    <CardSection
      title="Evolução do ITC ao longo do tempo"
      subtitle="Use para precificar — oscilação por bandeira no prazo selecionado"
      icon="trendingUp"
      extra={
        <AppSelect
          value={modalidade}
          onChange={(v) => setModalidade(v as string)}
          style={{ width: 180 }}
          options={MODALIDADES_ITC.map((m) => ({ value: m, label: m }))}
        />
      }
    >
      <MultiLineKPI
        data={data}
        xKey="mes"
        series={seriesAtivas}
        height={300}
        zoomY
        formatValue={(v) => `${v.toFixed(2).replace('.', ',')}%`}
        formatYTick={(v) => `${v.toFixed(2).replace('.', ',')}%`}
      />
    </CardSection>
  )
}
