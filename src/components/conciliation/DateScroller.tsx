'use client'

import { useMemo } from 'react'
import Icon from '@/components/shared/Icon'

export type DateScrollerMode = 'past' | 'centered'

export interface DateScrollerProps {
  /** Data selecionada (YYYY-MM-DD). */
  value: string
  onChange: (date: string) => void
  /**
   * Quantos dias mostrar.
   * Em mode='centered' é range×2+1 (selecionado no meio).
   * Em mode='past' é o total de dias mostrados (HOJE na direita).
   * Default 3 (= 7 dias).
   */
  range?: number
  /**
   * 'past'     — HOJE sempre na ponta direita; sem datas futuras (default — domínio Conciliação)
   * 'centered' — selecionado no centro, range dias antes + range dias depois (Tupi original)
   */
  mode?: DateScrollerMode
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
 * Seletor de data horizontal — 7 cards.
 *
 * - mode='past' (default): HOJE sempre à direita, sem futuros (Conciliação não tem
 *   transações futuras). HOJE recebe destaque saturado quando selecionado.
 * - mode='centered': comportamento original Tupi (range antes + selecionado + range depois).
 *
 * Setas: '<' anda 7 dias atrás. '>' em mode='past' fica oculto quando já estamos em HOJE.
 */
export default function DateScroller({ value, onChange, range = 3, mode = 'past' }: DateScrollerProps) {
  const selected = useMemo(() => parseISO(value), [value])
  const today = todayLocal()

  const dates = useMemo(() => {
    const arr: Date[] = []
    if (mode === 'past') {
      // 7 dias terminando em HOJE (independe da data selecionada)
      const totalDays = range * 2 + 1
      for (let i = totalDays - 1; i >= 0; i--) {
        arr.push(shiftDays(today, -i))
      }
    } else {
      // centered: range antes + selecionado + range depois
      for (let i = -range; i <= range; i++) arr.push(shiftDays(selected, i))
    }
    return arr
  }, [selected, range, mode, today])

  const isAtToday = sameDay(selected, today)

  const goPrev = () => onChange(toISO(shiftDays(selected, -7)))
  const goNext = () => {
    if (mode === 'past' && isAtToday) return // bloqueio: não navega futuro
    const candidate = shiftDays(selected, 7)
    // em past, clamp em hoje
    if (mode === 'past' && candidate > today) {
      onChange(toISO(today))
      return
    }
    onChange(toISO(candidate))
  }

  const showNext = mode !== 'past' || !isAtToday

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

          // HIERARQUIA VISUAL (Pixel):
          // - HOJE selecionado: fundo azul saturado + texto branco (mais forte)
          // - HOJE não selecionado: contorno azul + label "HOJE" colorido
          // - Selecionado (não HOJE): fundo claro + contorno azul
          // - Padrão: branco + contorno cinza
          const todaySelected = isSelected && isToday
          const todayUnselected = isToday && !isSelected
          const otherSelected = isSelected && !isToday

          let bg = '#fff'
          let borderColor = '#f0f0f0'
          let labelColor = 'rgba(0,0,0,0.45)'
          let dateColor = 'rgba(0,0,0,0.85)'
          let dateWeight: 500 | 700 = 500

          if (todaySelected) {
            bg = '#1890FF'
            borderColor = '#1890FF'
            labelColor = '#fff'
            dateColor = '#fff'
            dateWeight = 700
          } else if (todayUnselected) {
            bg = '#fff'
            borderColor = '#1890FF'
            labelColor = '#1890FF'
            dateColor = '#1890FF'
            dateWeight = 700
          } else if (otherSelected) {
            bg = '#E6F7FF'
            borderColor = '#1890FF'
            labelColor = '#1890FF'
            dateColor = '#1890FF'
            dateWeight = 700
          }

          return (
            <button key={iso} onClick={() => onChange(iso)}
              aria-pressed={isSelected}
              style={{
                flex: 1, minWidth: 80, maxWidth: 130,
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                padding: '10px 8px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                fontFamily: 'Roboto', textAlign: 'center',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLElement).style.borderColor = '#91D5FF' }}
              onMouseLeave={e => { if (!isSelected && !isToday) (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0' }}
            >
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: labelColor,
                letterSpacing: 0.5,
              }}>
                {isToday ? 'HOJE' : weekday}
              </span>
              <span style={{
                fontSize: 13, fontWeight: dateWeight,
                color: dateColor,
              }}>
                {ddmm}
              </span>
            </button>
          )
        })}
      </div>

      {showNext ? (
        <button onClick={goNext} aria-label="Próxima semana"
          style={btn}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f0f0'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
          <Icon name="chevronRight" size={14} />
        </button>
      ) : (
        // Mantém o slot ocupado para não "pular" a régua
        <span aria-hidden="true" style={{ width: 32, height: 32, flexShrink: 0 }} />
      )}
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
