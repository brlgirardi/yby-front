'use client'

import { useState } from 'react'
import { Segmented, Checkbox } from 'antd'
import Tooltip from '@/components/shared/Tooltip'
import { Info, ChevronLeft, ChevronRight } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'

type ViewMode = 'bruto' | 'adquirente' | 'liquido'
type BrutoSubMode = 'consolidado' | 'adquirente'
type DayData = {
  received?: { label: string; value: string; color: string }
  expected?: { label: string; value: string; color: string }
  anticipated?: { label: string; value: string; color: string }
  acquirer?: string
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DOW = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const ACQUIRERS = ['Adiq','Rede','Cielo','Getnet']

function generateDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = Array(first).fill(null)
  for (let d = 1; d <= total; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

const acqs = ['Adiq','Rede','Cielo','Getnet']

function fakeDayData(day: number, viewMode: ViewMode): DayData {
  if (day % 7 === 0) return {}
  const seed = day * 137
  if (viewMode === 'adquirente') {
    return { acquirer: acqs[day % acqs.length] }
  }
  const base = (seed % 50 + 10) * 1000
  if (day < 24) {
    return {
      received: { label: 'Recebido', value: `R$ ${(base).toLocaleString('pt-BR')}`, color: '#52C41A' },
    }
  }
  return {
    expected: { label: 'A receber', value: `R$ ${(base).toLocaleString('pt-BR')}`, color: '#1890FF' },
  }
}

type DreItem = {
  label: string
  value: string
  color: string
  tooltip: string | null
  sub?: { label: string; value: string }[]
}

const dreItems: DreItem[] = [
  { label: 'Parcelas a creditar', value: 'R$ 48.200', color: '#1890FF', tooltip: 'Soma das parcelas de cartão a vencer na data selecionada, antes de qualquer dedução.' },
  {
    label: 'Antecipações concedidas',
    value: '− R$ 8.400',
    color: '#722ED1',
    tooltip: 'Parcelas desta data que o sub-adquirente já adiantou a merchants. O valor chega do adquirente mas é retido para recuperar o crédito concedido.',
    sub: [
      { label: 'Restaurante Bom Sabor', value: 'R$ 5.100' },
      { label: 'Mercado Boa Vista',     value: 'R$ 3.300' },
    ],
  },
  { label: 'Taxas e MDR',        value: '− R$ 1.446', color: '#FF4D4F', tooltip: 'MDR cobrado pelo adquirente sobre o volume bruto da data.' },
  { label: 'Gravame / garantia', value: '− R$ 3.200', color: '#FAAD14', tooltip: 'Oneração de recebíveis como garantia registrada em registradora (CIP/CERC/TAG).' },
  { label: 'Líquido estimado',   value: 'R$ 35.154', color: '#52C41A', tooltip: null },
]

export default function AgendaCalendar() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate())
  const [viewMode, setViewMode] = useState<ViewMode>('bruto')
  const [brutoSubMode, setBrutoSubMode] = useState<BrutoSubMode>('consolidado')
  const [acqFilter, setAcqFilter] = useState<string[]>(ACQUIRERS)
  const [acqDropOpen, setAcqDropOpen] = useState(false)

  const isBruto = viewMode !== 'liquido'
  const isPerAcquirer = isBruto && brutoSubMode === 'adquirente'

  const days = generateDays(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const kpis = [
    { label: 'A receber (mês)', value: 'R$ 487.320', variant: 'info' as const },
    { label: 'Antecipações concedidas', value: 'R$ 62.590', variant: 'warning' as const, tooltip: 'Total que o sub-adquirente adiantou a merchants e ainda não recuperou dos adquirentes. Clique para ver detalhes na aba Antecipações.' },
    { label: 'Antecipado (funding)', value: 'R$ 93.400', variant: 'orange' as const },
    { label: 'MDR / Taxas', value: 'R$ 14.620', variant: 'error' as const },
    { label: 'Líquido previsto', value: 'R$ 379.300', variant: 'success' as const },
  ]

  return (
    <div>
      {/* KPIs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="flex gap-4">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1 rounded hover:bg-[#f5f5f5]"><ChevronLeft size={16} /></button>
              <span className="font-medium text-sm">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="p-1 rounded hover:bg-[#f5f5f5]"><ChevronRight size={16} /></button>
            </div>

            {/* ─── Filtros com hierarquia visual clara ─────────────────── */}
            <div className="flex items-center gap-2">

              {/* Nível 2 — sub-filtro condicional (só quando Bruto ativo) */}
              {isBruto && (
                <div
                  className="flex items-center gap-2 pr-2"
                  style={{ borderRight: '1px solid #f0f0f0' }}
                >
                  {/* Nível 3 — adquirentes (só quando Por adquirente ativo) */}
                  {isPerAcquirer && (
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                        style={{
                          border: acqFilter.length < ACQUIRERS.length ? '1px solid #1890FF' : '1px solid #d9d9d9',
                          background: acqFilter.length < ACQUIRERS.length ? '#E6F7FF' : '#fff',
                          color: acqFilter.length < ACQUIRERS.length ? '#1890FF' : 'rgba(0,0,0,0.65)',
                        }}
                        onMouseEnter={() => setAcqDropOpen(true)}
                        onMouseLeave={() => setAcqDropOpen(false)}
                      >
                        Adquirentes
                        {acqFilter.length < ACQUIRERS.length && (
                          <span style={{
                            background: '#1890FF', color: '#fff',
                            borderRadius: '50%', width: 14, height: 14,
                            fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {acqFilter.length}
                          </span>
                        )}
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {acqDropOpen && (
                        <div
                          className="absolute right-0 bg-white rounded z-10"
                          style={{ top: 30, border: '1px solid #f0f0f0', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', padding: '4px 0', minWidth: 140 }}
                          onMouseEnter={() => setAcqDropOpen(true)}
                          onMouseLeave={() => setAcqDropOpen(false)}
                        >
                          {ACQUIRERS.map(a => (
                            <div key={a}
                              className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-[#f5f5f5]"
                              onClick={() => setAcqFilter(f => f.includes(a) ? f.filter(x => x !== a) : [...f, a])}
                            >
                              <Checkbox checked={acqFilter.includes(a)} />
                              <span className="text-xs">{a}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Segmented
                    size="small"
                    value={brutoSubMode}
                    onChange={(v) => setBrutoSubMode(v as BrutoSubMode)}
                    options={[
                      { label: 'Consolidado', value: 'consolidado' },
                      { label: 'Por adquirente', value: 'adquirente' },
                    ]}
                  />
                </div>
              )}

              {/* Nível 1 — filtro principal: Bruto vs Líquido */}
              <Segmented
                size="small"
                value={isBruto ? 'bruto' : 'liquido'}
                onChange={(v) => {
                  if (v === 'liquido') setViewMode('liquido')
                  else setViewMode('bruto')
                }}
                options={[
                  { label: 'Bruto recebido', value: 'bruto' },
                  { label: 'Líquido sub', value: 'liquido' },
                ]}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7">
            {DOW.map(d => (
              <div key={d} className="text-center py-2 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.45)', borderBottom: '1px solid #f0f0f0' }}>
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              const data = day ? fakeDayData(day, isPerAcquirer ? 'adquirente' : viewMode) : {}
              const isSelected = day === selectedDay
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()

              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDay(day)}
                  className="border-b border-r border-[#f0f0f0] relative"
                  style={{
                    minHeight: 72,
                    cursor: day ? 'pointer' : 'default',
                    background: isSelected && day ? '#E6F7FF' : day ? 'white' : '#fafafa',
                    transition: 'background 0.15s',
                  }}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-between px-1.5 pt-1">
                        <span className="text-xs" style={{
                          color: isToday ? '#1890FF' : 'rgba(0,0,0,0.65)',
                          fontWeight: isToday ? 700 : 400
                        }}>
                          {day}
                        </span>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#1890FF]" />}
                      </div>
                      <div className="px-1.5 pb-1 space-y-0.5">
                        {isPerAcquirer && data.acquirer && acqFilter.includes(data.acquirer) && (
                          <div className="text-xs font-medium truncate" style={{ color: '#1890FF', fontSize: 10 }}>{data.acquirer}</div>
                        )}
                        {data.received && (
                          <>
                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }}>{data.received.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: data.received.color }}>{data.received.value}</div>
                          </>
                        )}
                        {data.expected && (
                          <>
                            <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }}>{data.expected.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: data.expected.color }}>{data.expected.value}</div>
                          </>
                        )}
                        {data.anticipated && (
                          <div style={{ fontSize: 12, fontWeight: 600, color: data.anticipated.color }}>{data.anticipated.value}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* DRE Panel */}
        <div
          className="bg-white rounded-sm border border-[#f0f0f0] flex-shrink-0"
          style={{ width: 280, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
        >
          <div className="px-4 py-3 border-b border-[#f0f0f0]">
            <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>
              DRE — {selectedDay}/{String(month + 1).padStart(2, '0')}/{year}
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {dreItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.65)' }}>{item.label}</span>
                    {item.tooltip && (
                      <Tooltip text={item.tooltip} delay={1000} bare>
                        <Info size={13} style={{ color: 'rgba(0,0,0,0.45)' }} />
                      </Tooltip>
                    )}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
                </div>
                {item.sub && (
                  <div className="mt-1 ml-2 space-y-0.5" style={{ borderLeft: '2px solid #f0f0f0', paddingLeft: 8 }}>
                    {item.sub.map(s => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>↳ {s.label}</span>
                        <span style={{ fontSize: 11, color: '#722ED1' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[#f0f0f0] pt-3 mt-3">
              <div className="text-xs text-[rgba(0,0,0,0.45)]">Fontes: Adiq, Rede, Cielo, Getnet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
