'use client'
// Agenda do Estabelecimento Comercial — V0.
// Layout 1:1 com a Agenda do SUB: calendário customizado em grid 7 colunas
// (sem antd Calendar) + painel direito com sections expansíveis. Cards têm
// border-bottom entre header e body — padrão TUPI estabelecido.
//
// Pixel/Rian (Enviesados cap. 6 — enquadramento + cap. 8 — afeto):
// - "Líquido para o dia" verde no topo (KPI)
// - dias passados em opacity 0.6 + cinza neutro (não vermelho)
// - hoje com borda azul superior
// - selecionado com bg azul claro

import { useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import Tooltip from '@/components/shared/Tooltip'
import { ecAgendaKpis, ecAgendaJanuary, ecAgendaDay11 } from '@/mocks/ec/agenda'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// Janeiro 2025 começa numa quarta — offset 3
const FIRST_DOW = 3
const TODAY = 11
const CURRENT_MONTH = 0  // Janeiro

interface DaySection {
  key: string
  icon: 'trendingUp' | 'creditCard' | 'barChart' | 'users'
  color: string
  label: string
  summary: string
  summaryValue: string
  summaryColor: string
  rows: { l: React.ReactNode; v: string; c: string }[]
}

export default function EcAgenda() {
  const [viewMode, setViewMode] = useState<'liquido' | 'bruto'>('liquido')
  const [selectedDay, setSelectedDay] = useState<number>(TODAY)
  const [expandedPainel, setExpandedPainel] = useState<Record<string, boolean>>({ creditos: true })

  const togglePainel = (key: string) =>
    setExpandedPainel((p) => ({ ...p, [key]: !p[key] }))

  // Sections do painel direito — copy didático pro EC pequeno.
  // Tooltips explicam "gravame" como antecipação na linguagem do operador.
  const sections: DaySection[] = [
    {
      key: 'creditos',
      icon: 'trendingUp',
      color: '#52c41a',
      label: 'Vou receber',
      summary: 'Total bruto',
      summaryValue: '+R$ 282.800,00',
      summaryColor: '#52c41a',
      rows: [
        { l: <Tooltip bare text="Parcelas das suas vendas que caem nessa data — antes de qualquer taxa.">Parcelas a receber</Tooltip>, v: '+R$ 191.400,00', c: '#52c41a' },
        // Pixel/Rian (cap. 9 não-impostor): linguagem do EC, não do contador.
        // "gravame" é jurídico — fica no tooltip pra quem quiser jargão.
        { l: <Tooltip bare text="Termo técnico: gravame. Antecipações que você fez antes — agora o dinheiro está caindo na sua conta.">Antecipações que caem hoje</Tooltip>, v: '+R$ 91.400,00', c: '#52c41a' },
      ],
    },
    {
      key: 'deducoes',
      icon: 'creditCard',
      color: '#fa8c16',
      label: 'O que sai',
      summary: 'Total descontado',
      summaryValue: '−R$ 50.000,00',
      summaryColor: '#ff4d4f',
      rows: [
        { l: <Tooltip bare text="Taxas operacionais (MDR + tarifas) sobre as transações que caem hoje.">Taxas e tarifas</Tooltip>, v: '−R$ 25.000,00', c: '#ff4d4f' },
        { l: <Tooltip bare text="Termo técnico: débito de gravame. Estas parcelas você já recebeu antes via antecipação — por isso saem da agenda agora.">Parcelas que você já recebeu antes</Tooltip>, v: '−R$ 25.000,00', c: '#ff4d4f' },
      ],
    },
    {
      key: 'liquido',
      icon: 'barChart',
      color: '#1890ff',
      label: 'Cai na conta',
      summary: 'Valor líquido',
      summaryValue: `+ ${fmtBRL(ecAgendaDay11.aReceberNoDia)}`,
      summaryColor: '#1890ff',
      rows: [],
    },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Agenda" breadcrumb="Estabelecimento Comercial / Agenda" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Entrada"            value={fmtBRL(ecAgendaKpis.entrada)}           subLabel="Total bruto previsto no mês"      variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Saída"              value={fmtBRL(ecAgendaKpis.saida)}             subLabel="Taxas e débitos do período"        variant="error" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Líquido para o dia" value={fmtBRL(ecAgendaKpis.liquidoDoDia)}      subLabel="Cai na conta hoje"                 variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Entradas futuras"   value={fmtBRL(ecAgendaKpis.entradasFuturas)}   subLabel="Próximos 90 dias"                  variant="warning" /></div>
        </div>

        {/* Calendar + Day Detail */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Calendar card */}
          <div style={{ flex: 1, background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            {/* Header com filtros — divider após */}
            <div style={{ padding: '16px 21px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex' }}>
                  <Icon name="chevronLeft" size={14} />
                </button>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{MONTHS[CURRENT_MONTH]} 2025</span>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex' }}>
                  <Icon name="chevronRight" size={14} />
                </button>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {([
                  { v: 'liquido', l: 'Líquido' },
                  { v: 'bruto',   l: 'Bruto'   },
                ] as const).map((opt) => {
                  const active = viewMode === opt.v
                  return (
                    <Tooltip bare key={opt.v} text={opt.v === 'liquido' ? 'O que de fato cai na conta (depois de taxas e débitos de antecipação).' : 'Total que entra antes de qualquer dedução.'}>
                      <button
                        onClick={() => setViewMode(opt.v)}
                        style={{
                          border:`1px solid ${active ? '#1890FF' : '#d9d9d9'}`,
                          background: active ? '#e6f7ff' : '#fff',
                          color: active ? '#1890FF' : 'rgba(0,0,0,0.65)',
                          borderRadius: 2, padding: '4px 12px', fontSize: 12, cursor: 'pointer',
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        {opt.l}
                      </button>
                    </Tooltip>
                  )
                })}
              </div>
            </div>

            {/* Body: grid + legenda */}
            <div style={{ padding: '16px 21px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Grid */}
              <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #f0f0f0' }}>
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                    <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.45)' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                  {Array.from({ length: FIRST_DOW }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', minHeight: 72 }} />
                  ))}
                  {ecAgendaJanuary.map((d) => {
                    const isSelected = d.day === selectedDay
                    const isToday    = d.day === TODAY
                    const isPast     = d.day < TODAY
                    const dayVal     = viewMode === 'bruto' ? d.amount : (d.liquido ?? Math.round(d.amount * 0.32))

                    const dayNumColor = isToday ? '#1890FF' : isPast ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.65)'
                    const valColor    = dayVal === 0
                      ? (isPast ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.2)')
                      : isPast ? 'rgba(0,0,0,0.35)' : isToday ? '#1890FF' : '#91CAFF'
                    const cellOpacity = isPast && !isSelected ? 0.6 : 1
                    const bgDay = isSelected ? '#e6f7ff' : isToday ? '#f0f7ff' : '#fff'

                    return (
                      <div
                        key={d.day}
                        onClick={() => setSelectedDay(d.day)}
                        style={{
                          borderRight: '1px solid #f0f0f0',
                          borderBottom: '1px solid #f0f0f0',
                          minHeight: 72, padding: '8px 10px', cursor: 'pointer',
                          background: bgDay, position: 'relative',
                          transition: 'background 0.1s', opacity: cellOpacity,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            ;(e.currentTarget as HTMLElement).style.background = '#fafafa'
                            ;(e.currentTarget as HTMLElement).style.opacity = '1'
                          }
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background = bgDay
                          ;(e.currentTarget as HTMLElement).style.opacity = String(cellOpacity)
                        }}
                      >
                        {isToday && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#1890FF', borderRadius: '2px 2px 0 0' }} />}
                        <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: dayNumColor, marginBottom: 4 }}>{d.day}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: valColor }}>
                          {dayVal === 0 ? '—' : `R$ ${(dayVal / 1000).toFixed(0)}k`}
                        </div>
                        {isSelected && <div style={{ position: 'absolute', top: 6, right: 8, width: 5, height: 5, borderRadius: '50%', background: '#1890FF' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legenda */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>
                  <span style={{ width: 20, height: 8, borderRadius: 2, background: 'rgba(0,0,0,0.1)', display: 'inline-block' }} />
                  Passado
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
                  <span style={{ width: 20, height: 8, borderRadius: 2, borderTop: '2px solid #1890FF', background: '#f0f7ff', display: 'inline-block' }} />
                  Hoje
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#91CAFF' }}>
                  <span style={{ width: 20, height: 8, borderRadius: 2, background: '#f0f7ff', border: '1px solid #91CAFF', display: 'inline-block' }} />
                  Previsto
                </span>
                <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.25)', marginLeft: 'auto' }}>Clique no dia para detalhes →</span>
              </div>
            </div>
          </div>

          {/* Day Detail Panel */}
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
              {/* Header com divider */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
                    {selectedDay} de {MONTHS[CURRENT_MONTH]}
                  </span>
                  <span style={{ fontSize: 10, background: '#e6f7ff', color: '#1890FF', border: '1px solid #91CAFF', borderRadius: 2, padding: '1px 6px', fontWeight: 600, lineHeight: '18px' }}>
                    {selectedDay < TODAY ? 'Liquidado' : selectedDay === TODAY ? 'Hoje' : 'Previsto'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Resumo do dia</div>
              </div>

              {/* Body com sections */}
              <div style={{ padding: '8px 0' }}>
                {sections.map((section, si, arr) => {
                  const isOpen = !!expandedPainel[section.key]
                  return (
                    <div key={section.key} style={{ borderBottom: si < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div
                        onClick={() => togglePainel(section.key)}
                        style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', cursor: 'pointer', userSelect: 'none' }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isOpen ? 0 : 3 }}>
                            <Icon name={section.icon} size={12} color={section.color} />
                            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              {section.label}
                            </span>
                          </div>
                          {!isOpen && (
                            <span style={{ fontSize: 15, fontWeight: 700, color: section.summaryColor, paddingLeft: 18 }}>
                              {section.summaryValue}
                            </span>
                          )}
                        </div>
                        {section.rows.length > 0 && (
                          <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} size={12} color="rgba(0,0,0,0.35)" />
                        )}
                      </div>
                      {isOpen && section.rows.length > 0 && (
                        <div style={{ padding: '0 18px 12px' }}>
                          {section.rows.map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: 12 }}>
                              <span style={{ color: 'rgba(0,0,0,0.65)' }}>{r.l}</span>
                              <span style={{ color: r.c, fontWeight: 600 }}>{r.v}</span>
                            </div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0 2px', fontSize: 12 }}>
                            <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 600 }}>{section.summary}</span>
                            <span style={{ color: section.summaryColor, fontWeight: 700 }}>{section.summaryValue}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
