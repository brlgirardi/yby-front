'use client'
// Dashboard Financeiro Adquirente — 2 abas (Planitização / Conciliação ITC).
// Aba "Geral" removida em 2026-05-10 — fluxo Adquirente foca em platinização e
// conciliação ITC; KPIs operacionais ficam em outra persona.
// Charts em SVG inline (zero dep externa). Reuso do design system Yby.

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import BrandLogo from '@/components/shared/BrandLogo'
import AppSelect from '@/components/ui/AppSelect'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import { useTheme } from '@/stores/themeStore'
import {
  bandeiraDistribuicao,
  bandeiraTimeline,
  platinizacaoTop15,
  itcKpis,
  coberturaWaterfall,
  conciliacaoVsDivergencia,
  impactoDivergencias,
  resultadoFinanceiroItc,
  irregularidadesPorBandeira,
  platinizacaoHeatmap,
  TIER_COLORS,
  top10CartoesItc,
  type WaterfallItem,
  type HeatmapCell,
  type TopCardItc,
} from '@/mocks/adquirente/dashboard'

type TabKey = 'planitizacao' | 'itc'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

// ── helpers SVG charts ─────────────────────────────────────
function HorizontalBar({ value, max, color = '#1890FF' }: { value: number; max: number; color?: string }) {
  const pct = (value / max) * 100
  return (
    <div style={{ width: '100%', height: 8, background: '#F5F5F5', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
    </div>
  )
}

function DonutChart({ data, size = 200 }: { data: { label: string; pct: number; color: string }[]; size?: number }) {
  const r = size / 2 - 12
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F5F5F5" strokeWidth="20" />
      {data.map((d, i) => {
        const dash = (d.pct / 100) * circ
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="20"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )
        offset += dash
        return el
      })}
    </svg>
  )
}

function MultiLineChart({ data, height = 240, primary = '#1890FF' }: { data: typeof bandeiraTimeline; height?: number; primary?: string }) {
  const series = [
    { key: 'mastercard', color: primary, label: 'Mastercard' },
    { key: 'visa',       color: '#FA8C16', label: 'Visa' },
    { key: 'elo',        color: '#52C41A', label: 'Elo' },
  ] as const
  const allValues = data.flatMap((d) => series.map((s) => d[s.key]))
  const max = Math.max(...allValues) * 1.1
  const w = 100, h = 100
  const xStep = w / (data.length - 1)
  return (
    <div style={{ width: '100%', height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {series.map((s) => {
          const points = data.map((d, i) => `${i * xStep},${h - (d[s.key] / max) * h}`).join(' ')
          return <polyline key={s.key} fill="none" stroke={s.color} strokeWidth="0.6" points={points} />
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
        {data.map((d) => <span key={d.mes}>{d.mes}</span>)}
      </div>
    </div>
  )
}

function Waterfall({ data }: { data: WaterfallItem[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.valor)))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d) => {
        const isNeg = d.tone === 'negative'
        const color = isNeg ? '#FF4D4F' : d.tone === 'final' ? '#52C41A' : '#1890FF'
        const widthPct = (Math.abs(d.valor) / max) * 100
        return (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flexBasis: 200, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{d.label}</span>
            <div style={{ flex: 1, position: 'relative', height: 22 }}>
              <div style={{
                position: 'absolute', top: 0,
                left: isNeg ? 'auto' : 0,
                right: isNeg ? 0 : 'auto',
                width: `${widthPct}%`,
                height: '100%',
                background: color,
                opacity: 0.85,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: isNeg ? 0 : 8,
                paddingRight: isNeg ? 8 : 0,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                justifyContent: isNeg ? 'flex-end' : 'flex-start',
              }}>
                {d.valor.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HeatmapTable({ data }: { data: HeatmapCell[] }) {
  const mccs = Array.from(new Set(data.map((d) => d.mcc)))
  const tiers: HeatmapCell['tier'][] = ['Entry', 'Mid', 'Premium', 'Ultra']
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ background: '#FAFAFA' }}>
          <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 500, color: 'rgba(0,0,0,0.65)' }}>MCC</th>
          {tiers.map((t) => (
            <th key={t} style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500, color: 'rgba(0,0,0,0.65)' }}>{t}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mccs.map((mcc) => (
          <tr key={mcc}>
            <td style={{ padding: '10px 12px', color: 'rgba(0,0,0,0.85)', fontWeight: 500, borderBottom: '1px solid #f5f5f5' }}>{mcc}</td>
            {tiers.map((t) => {
              const cell = data.find((d) => d.mcc === mcc && d.tier === t)
              const pct = cell?.pct ?? 0
              const intensity = Math.min(pct / 65, 1)  // normaliza
              return (
                <td key={t} style={{
                  padding: '10px 12px',
                  textAlign: 'center',
                  background: `${TIER_COLORS[t]}${Math.round(intensity * 200 + 30).toString(16).padStart(2, '0')}`,
                  color: pct > 30 ? '#fff' : 'rgba(0,0,0,0.85)',
                  fontWeight: 600,
                  borderBottom: '1px solid #f5f5f5',
                }}>
                  {pct}%
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Componente principal ───────────────────────────────────
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
            <div style={{ display: 'flex', gap: 12 }}>
              <AppSelect placeholder="Todos os Adquirentes"     style={{ width: 220 }} options={[{ value: 'all', label: 'Todos os Adquirentes' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os Estabelecimentos" style={{ width: 280 }} options={[{ value: 'all', label: 'Todos os Estabelecimentos' }]} defaultValue="all" />
              <AppSelect placeholder="Todos os MCCs"             style={{ width: 220 }} options={[{ value: 'all', label: 'Todos os MCCs' }]} defaultValue="all" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 16 }}>Distribuição de contagem por bandeira</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                  <DonutChart data={bandeiraDistribuicao.map((b) => ({ label: b.bandeira, pct: b.pct, color: b.color }))} />
                  <div>
                    {bandeiraDistribuicao.map((b) => (
                      <div key={b.bandeira} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{b.bandeira}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: b.color }}>{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 16 }}>Quantidade e % por bandeira</div>
                <MultiLineChart data={bandeiraTimeline} primary={theme.primary} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                  {[
                    { c: theme.primary, l: 'Mastercard' },
                    { c: '#FA8C16',     l: 'Visa' },
                    { c: '#52C41A',     l: 'Elo' },
                  ].map((s) => (
                    <span key={s.l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.c }} /> {s.l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 16 }}>Platinização — Top 15</div>
              {(() => {
                const max = Math.max(...platinizacaoTop15.map((p) => p.valor))
                return platinizacaoTop15.map((p) => (
                  <div key={`${p.bandeira}-${p.categoria}`} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <BrandLogo brand={p.bandeira} size={22} />
                    <span style={{ flexBasis: 180, fontSize: 12, color: 'rgba(0,0,0,0.85)' }}>
                      {p.categoria} <span style={{ color: 'rgba(0,0,0,0.45)' }}>({p.bandeira.toLowerCase()})</span>
                    </span>
                    <div style={{ flex: 1 }}>
                      <HorizontalBar value={p.valor} max={max} />
                    </div>
                    <span style={{ flexBasis: 70, textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{p.valor.toLocaleString('pt-BR')}</span>
                  </div>
                ))
              })()}
            </div>
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

            {/* Waterfall */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Cobertura Analítica — Elegibilidade das Transações</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Distribuição e perda de elegibilidade ao longo do processo de conciliação</div>
              </div>
              <Waterfall data={coberturaWaterfall} />
            </div>

            {/* Conciliação x Divergência + Impacto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 14 }}>Conciliação x Divergência</div>
                {(() => {
                  const total = conciliacaoVsDivergencia.reduce((s, x) => s + x.valor, 0)
                  return (
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
                  )
                })()}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, fontSize: 12 }}>
                  <span style={{ color: '#52C41A' }}>● Conciliada</span>
                  <span style={{ color: '#FF4D4F' }}>● Divergente</span>
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 14 }}>Impacto das Divergências</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
                  {impactoDivergencias.map((i) => {
                    const max = Math.max(...impactoDivergencias.map((x) => x.valor))
                    const h = (i.valor / max) * 150
                    return (
                      <div key={i.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.65)' }}>{i.valor}</span>
                        <div style={{ width: '100%', height: h, background: '#FAAD14', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', textAlign: 'center' }}>{i.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Resultado Financeiro ITC */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 14 }}>Resultado Financeiro ITC</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
                {resultadoFinanceiroItc.map((r) => {
                  const max = Math.max(...resultadoFinanceiroItc.map((x) => Math.abs(x.valor)))
                  const h = (Math.abs(r.valor) / max) * 70
                  const isPos = r.valor >= 0
                  return (
                    <div key={r.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'center' }}>
                      <div style={{ minHeight: 20, fontSize: 10, color: isPos ? '#52C41A' : '#FF4D4F', fontWeight: 600 }}>
                        {isPos ? '+' : ''}{r.valor.toLocaleString('pt-BR')}
                      </div>
                      <div style={{ width: '100%', height: 70, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        {isPos && <div style={{ width: '100%', height: h, background: '#52C41A', borderRadius: 2 }} />}
                      </div>
                      <div style={{ width: '100%', height: 1, background: '#D9D9D9' }} />
                      <div style={{ width: '100%', height: 70, display: 'flex', flexDirection: 'column' }}>
                        {!isPos && <div style={{ width: '100%', height: h, background: '#FF4D4F', borderRadius: 2 }} />}
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)' }}>{r.mes}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Irregularidades por bandeira */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {irregularidadesPorBandeira.map((b) => (
                <div key={b.bandeira} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <BrandLogo brand={b.bandeira} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{b.bandeira}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>TPV divergente</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.primary, marginBottom: 10 }}>{fmtBRL(b.tpvDivergente)}</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Saldo líquido</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12 }}>{fmtBRL(b.saldoLiquido)}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Tag status="Aprovado" label={`+${b.diffPosPct}% (R$ ${b.diffPosVal})`} />
                    <Tag status="Erro"     label={`${b.diffNegPct}% (R$ ${b.diffNegVal})`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap MCC × Categoria */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Platinização — Distribuição por MCC e Categoria</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Identificação de detenções de categoria por segmento</div>
              </div>
              <HeatmapTable data={platinizacaoHeatmap} />
            </div>

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
