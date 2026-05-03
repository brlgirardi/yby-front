'use client'

import { useMemo } from 'react'
import Icon from '@/components/shared/Icon'

export interface DateScrollerProps {
  /** Data selecionada (YYYY-MM-DD). */
  value: string
  onChange: (date: string) => void
  /** Quantos dias mostrar antes/depois. Default 3 (total = 7 dias com a selecionada no centro). */
  range?: number
}

const WEEKDAYS_PT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

function todayLocal(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function parseISO(iso: string): Date {
  const [y, m, dd] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, dd ?? 1)
}

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function shiftDays(d: Date, n: number): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  c.setDate(c.getDate() + n)
  return c
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/**
 * Seletor de data horizontal — 7 cards (3 antes + selecionado + 3 depois).
 * Espelha o `DateRangePicker`/`DateCard` do branch LGR-264-recon-acquirer.
 *
 * Affordance: card "HOJE" para o dia atual, dia da semana abreviado +
 * data DD/MM. Setas laterais andam de 7 em 7 dias.
 */
export default function DateScroller({ value, onChange, range = 3 }: DateScrollerProps) {
  const selected = useMemo(() => parseISO(value), [value])
  const today = todayLocal()

  const dates = useMemo(() => {
    const arr: Date[] = []
    for (let i = -range; i <= range; i++) arr.push(shiftDays(selected, i))
    return arr
  }, [selected, range])

  const goPrev = () => onChange(toISO(shiftDays(selected, -7)))
  const goNext = () => onChange(toISO(shiftDays(selected, 7)))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={goPrev} aria-label="Semana anterior"
        style={btn}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f0f0'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
        <Icon name="chevronLeft" size={14} />
      </button>

      <div style={{ display: 'flex', gap: 8, flex: 1, overflow: 'hidden' }}>
        {dates.map(d => {
          const iso = toISO(d)
          const isSelected = sameDay(d, selected)
          const isToday = sameDay(d, today)
          const weekday = WEEKDAYS_PT[d.getDay()]
          const ddmm = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`

          return (
            <button key={iso} onClick={() => onChange(iso)}
              style={{
                flex: 1, minWidth: 80, maxWidth: 130,
                background: isSelected ? '#E6F7FF' : '#fff',
                border: isSelected ? '1px solid #1890FF' : '1px solid #f0f0f0',
                borderRadius: 2,
                padding: '10px 8px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                fontFamily: 'Roboto', textAlign: 'center',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#91D5FF' }}
              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0' }}
            >
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: isSelected ? '#1890FF' : 'rgba(0,0,0,0.45)',
                letterSpacing: 0.5,
              }}>
                {isToday ? 'HOJE' : weekday}
              </span>
              <span style={{
                fontSize: 13, fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#1890FF' : 'rgba(0,0,0,0.85)',
              }}>
                {ddmm}
              </span>
            </button>
          )
        })}
      </div>

      <button onClick={goNext} aria-label="Próxima semana"
        style={btn}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f0f0'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
        <Icon name="chevronRight" size={14} />
      </button>
    </div>
  )
}

const btn: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: 2,
  width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  color: 'rgba(0,0,0,0.65)',
}
