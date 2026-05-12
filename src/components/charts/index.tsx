'use client'
// Charts shared do design system Yby — wrappers fininhos sobre Recharts.
//
// Por quê wrappers ao invés de usar Recharts direto:
// - cor primária reativa ao tema (Tupi/Vero) — não passa hex à mão
// - tooltip/grid/eixos com estilo unificado (mesma fonte, cores, padding)
// - assinatura simples: passa `data` e pronto, dispensando configurar cada chart
// - charts ficam interativos (hover, tooltip) sem custo adicional
//
// Wrappers exportados:
//   <LineKPI />       — série temporal simples (1 linha)
//   <MultiLineKPI />  — várias séries (ex: bandeiras ao longo do tempo)
//   <DonutBreakdown />— participação de N categorias com legenda
//   <BarList />       — lista horizontal (ranking, formas de pagamento)
//   <WaterfallChart />— variação ↑/↓ com barras lado a lado
//   <HeatmapGrid />   — matriz X×Y com intensidade por cor

import { useState, type ReactNode } from 'react'
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '@/stores/themeStore'

// ── tokens compartilhados ─────────────────────────────────────────
const TOOLTIP_STYLE = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 2,
  fontSize: 12,
  padding: '6px 10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}
const LABEL_STYLE = { color: 'rgba(0,0,0,0.85)', fontWeight: 500, marginBottom: 4 }
const ITEM_STYLE = { color: 'rgba(0,0,0,0.65)', padding: 0 }
const AXIS_STYLE = { fontSize: 11, fill: 'rgba(0,0,0,0.45)' }
const GRID_STROKE = 'rgba(0,0,0,0.06)'

// Paleta categórica para multi-series (Tupi-style, theme-agnostic).
// O primeiro slot é substituído por theme.primary nos wrappers.
const CATEGORICAL = ['#1890FF', '#FA8C16', '#52C41A', '#722ED1', '#13C2C2', '#EB2F96']

// Formatador BR padrão pra eixos (sem casas, com k/M)
function formatNumberShort(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// ── LineKPI — série temporal simples ──────────────────────────────
export interface LineKPIPoint { label: string; value: number }
interface LineKPIProps {
  data: LineKPIPoint[]
  height?: number
  /** Curva preenchida com gradiente abaixo da linha. */
  area?: boolean
  /** Formatador customizado pro tooltip. */
  formatValue?: (v: number) => string
}
export function LineKPI({ data, height = 240, area = true, formatValue = formatNumberShort }: LineKPIProps) {
  const theme = useTheme()
  const id = `lineKpi-${theme.key}`
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {area ? (
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.primary} stopOpacity={0.25} />
                <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={{ stroke: GRID_STROKE }} />
            <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={formatNumberShort} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={LABEL_STYLE}
              itemStyle={ITEM_STYLE}
              formatter={(v) => formatValue(typeof v === 'number' ? v : Number(v) || 0)}
            />
            <Area type="monotone" dataKey="value" stroke={theme.primary} strokeWidth={2} fill={`url(#${id})`} dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={{ stroke: GRID_STROKE }} />
            <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={formatNumberShort} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={LABEL_STYLE}
              itemStyle={ITEM_STYLE}
              formatter={(v) => formatValue(typeof v === 'number' ? v : Number(v) || 0)}
            />
            <Line type="monotone" dataKey="value" stroke={theme.primary} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// ── MultiLineKPI ──────────────────────────────────────────────────
export interface MultiLineSerie { key: string; label: string; color?: string }
interface MultiLineKPIProps {
  data: Array<Record<string, string | number>>
  /** Chave do eixo X dentro de cada item de data. */
  xKey: string
  /** Definição das séries (cada uma vira uma linha). */
  series: MultiLineSerie[]
  height?: number
  formatValue?: (v: number) => string
  /** Quando true, eixo Y faz auto-zoom no range dos dados em vez de começar em 0. */
  zoomY?: boolean
  /** Formatter do tick do eixo Y (default: formatNumberShort). */
  formatYTick?: (v: number) => string
}
export function MultiLineKPI({ data, xKey, series, height = 240, formatValue = formatNumberShort, zoomY = false, formatYTick }: MultiLineKPIProps) {
  const theme = useTheme()
  const colorOf = (s: MultiLineSerie, i: number) => s.color ?? (i === 0 ? theme.primary : CATEGORICAL[i % CATEGORICAL.length])

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey={xKey} tick={AXIS_STYLE} tickLine={false} axisLine={{ stroke: GRID_STROKE }} />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYTick ?? formatNumberShort}
            domain={zoomY ? ['auto', 'auto'] : undefined}
            padding={zoomY ? { top: 8, bottom: 8 } : undefined}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={LABEL_STYLE}
            itemStyle={ITEM_STYLE}
            formatter={(v) => formatValue(typeof v === 'number' ? v : Number(v) || 0)}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={colorOf(s, i)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── DonutBreakdown ────────────────────────────────────────────────
export interface DonutSlice { label: string; value: number; color?: string }
interface DonutBreakdownProps {
  data: DonutSlice[]
  height?: number
  /** Largura do anel (raio externo - interno). */
  thickness?: number
  /** Mostrar legenda à direita do donut (default true). */
  showLegend?: boolean
  /** Formatador do tooltip. */
  formatValue?: (v: number) => string
}
export function DonutBreakdown({ data, height = 220, thickness = 22, showLegend = true, formatValue }: DonutBreakdownProps) {
  const theme = useTheme()
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const colorOf = (d: DonutSlice, i: number) => d.color ?? (i === 0 ? theme.primary : CATEGORICAL[i % CATEGORICAL.length])

  return (
    <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ flex: showLegend ? 1 : '1 1 100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={`${50}%`}
              outerRadius={`${50 + thickness}%`}
              paddingAngle={1}
              stroke="none"
            >
              {data.map((d, i) => (
                <Cell key={d.label} fill={colorOf(d, i)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={LABEL_STYLE}
              itemStyle={ITEM_STYLE}
              formatter={(v) => {
                const n = typeof v === 'number' ? v : Number(v) || 0
                return formatValue ? formatValue(n) : `${((n / total) * 100).toFixed(1)}% (${n.toLocaleString('pt-BR')})`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, flexShrink: 0 }}>
          {data.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorOf(d, i) }} />
              <span style={{ color: 'rgba(0,0,0,0.65)' }}>{d.label}</span>
              <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 600 }}>
                {((d.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── BarList ───────────────────────────────────────────────────────
export interface BarListItem { label: string; value: number; color?: string; sublabel?: string }
interface BarListProps {
  data: BarListItem[]
  /** Formatar valor à direita. */
  formatValue?: (v: number) => string
  /** Mostrar valor em % (calculado pelo max). */
  asPercent?: boolean
  /** Altura de cada linha. */
  rowHeight?: number
}
export function BarList({ data, formatValue, asPercent = false, rowHeight = 28 }: BarListProps) {
  const theme = useTheme()
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, idx) => {
        const pct = (d.value / max) * 100
        const color = d.color ?? theme.primary
        const valueLabel = formatValue
          ? formatValue(d.value)
          : asPercent
            ? `${pct.toFixed(1)}%`
            : d.value.toLocaleString('pt-BR')
        return (
          <div key={`${d.label}-${d.sublabel ?? ''}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flexBasis: 160, fontSize: 12, color: 'rgba(0,0,0,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.label}
              {d.sublabel && <span style={{ color: 'rgba(0,0,0,0.45)', marginLeft: 4 }}>{d.sublabel}</span>}
            </div>
            <div style={{ flex: 1, height: rowHeight - 18, background: '#F5F5F5', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
            </div>
            <div style={{ flexBasis: 80, textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
              {valueLabel}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── WaterfallChart ────────────────────────────────────────────────
export interface WaterfallItem { label: string; value: number; tone?: 'positive' | 'negative' | 'final' }
interface WaterfallProps {
  data: WaterfallItem[]
  height?: number
  formatValue?: (v: number) => string
}
export function WaterfallChart({ data, height = 240, formatValue = formatNumberShort }: WaterfallProps) {
  const theme = useTheme()
  const colorOf = (tone?: WaterfallItem['tone']) =>
    tone === 'negative' ? '#FF4D4F'
    : tone === 'final'  ? '#52C41A'
    : theme.primary

  // Recharts BarChart vertical com Cell por barra (cor por tone).
  const chartData = data.map((d) => ({
    label: d.label,
    abs: Math.abs(d.value),
    raw: d.value,
    tone: d.tone,
  }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 100, bottom: 0 }}>
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis type="number" tick={AXIS_STYLE} tickLine={false} axisLine={false} tickFormatter={formatNumberShort} />
          <YAxis type="category" dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={false} width={150} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={LABEL_STYLE}
            itemStyle={ITEM_STYLE}
            formatter={(_v, _n, item) => {
              const raw = (item as { payload?: { raw?: number } }).payload?.raw ?? 0
              return formatValue(raw)
            }}
          />
          <Bar dataKey="abs" radius={[2, 2, 2, 2]}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={colorOf(d.tone)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── HeatmapGrid ───────────────────────────────────────────────────
export interface HeatmapCell { row: string; col: string; value: number }
interface HeatmapProps {
  data: HeatmapCell[]
  /** Ordem das colunas (default: ordem de aparição). */
  columns?: string[]
  /** Ordem das linhas (default: ordem de aparição). */
  rows?: string[]
  /** Cor base — opacidade varia por value. Default: theme.primary. */
  color?: string
  /** Formatador da célula. */
  formatValue?: (v: number) => string
  /** Render customizado do label da linha (ex: logo de bandeira). */
  renderRow?: (row: string) => ReactNode
  /** Conteúdo customizado do tooltip por célula. Quando definido, substitui o title nativo. */
  renderCellTooltip?: (row: string, col: string, value: number) => ReactNode
}
export function HeatmapGrid({ data, columns, rows, color, formatValue = (v) => `${v}%`, renderRow, renderCellTooltip }: HeatmapProps) {
  const theme = useTheme()
  const baseColor = color ?? theme.primary
  const cols = columns ?? Array.from(new Set(data.map((d) => d.col)))
  const rws  = rows    ?? Array.from(new Set(data.map((d) => d.row)))
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr>
          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 500, color: 'rgba(0,0,0,0.65)', background: '#FAFAFA' }}>—</th>
          {cols.map((c) => (
            <th key={c} style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 500, color: 'rgba(0,0,0,0.65)', background: '#FAFAFA' }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rws.map((r) => (
          <tr key={r}>
            <td style={{ padding: '8px 12px', color: 'rgba(0,0,0,0.85)', fontWeight: 500, borderTop: '1px solid #f5f5f5' }}>
              {renderRow ? renderRow(r) : r}
            </td>
            {cols.map((c) => {
              const cell = data.find((d) => d.row === r && d.col === c)
              const v = cell?.value ?? 0
              const intensity = Math.min(v / max, 1)
              const alpha = Math.round(intensity * 220 + 20).toString(16).padStart(2, '0')
              return (
                <HeatCell
                  key={c}
                  row={r}
                  col={c}
                  value={v}
                  bg={`${baseColor}${alpha}`}
                  fg={intensity > 0.55 ? '#fff' : 'rgba(0,0,0,0.85)'}
                  formatValue={formatValue}
                  renderCellTooltip={renderCellTooltip}
                />
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface HeatCellProps {
  row: string
  col: string
  value: number
  bg: string
  fg: string
  formatValue: (v: number) => string
  renderCellTooltip?: (row: string, col: string, value: number) => ReactNode
}
function HeatCell({ row, col, value, bg, fg, formatValue, renderCellTooltip }: HeatCellProps) {
  const [hover, setHover] = useState(false)
  const hasCustomTooltip = !!renderCellTooltip
  return (
    <td
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px 12px',
        textAlign: 'center',
        background: bg,
        color: fg,
        fontWeight: 600,
        borderTop: '1px solid #f5f5f5',
        transition: 'background 0.2s',
        position: 'relative',
      }}
      title={hasCustomTooltip ? undefined : `${row} × ${col}: ${formatValue(value)}`}
    >
      {formatValue(value)}
      {hasCustomTooltip && hover && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translate(-50%, 8px)',
            zIndex: 20,
            background: '#fff',
            color: 'rgba(0,0,0,0.85)',
            border: '1px solid #f0f0f0',
            borderRadius: 4,
            padding: '10px 12px',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.5,
            minWidth: 220,
            maxWidth: 280,
            textAlign: 'left',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
          }}
        >
          {renderCellTooltip!(row, col, value)}
        </div>
      )}
    </td>
  )
}
