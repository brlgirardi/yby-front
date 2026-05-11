'use client'

/**
 * Input numérico no padrão Tupi: aceita apenas dígitos e desloca a vírgula
 * automaticamente. Digitação 1 → 0,01 → 0,10 → 1,00 → 10,00.
 *
 * Usado nas tabelas de Custos e Preços para evitar erros de digitação com
 * vírgula/ponto. Espelha o componente `ShiftInput` do branch feat/pricing.
 */
type ShiftInputProps = {
  value: number
  onChange: (v: number) => void
  /** width customizada. Default 100%. */
  width?: number | string
  /** Sufixo visual (ex: "%"). Default sem sufixo. */
  suffix?: string
  /** Bloquear edição. */
  disabled?: boolean
}

export default function ShiftInput({
  value, onChange, width = '100%', suffix, disabled,
}: ShiftInputProps) {
  const display = value.toFixed(2).replace('.', ',')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = Math.max(0, parseFloat((Math.floor(value * 10) / 100).toFixed(2)))
      onChange(next)
      return
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const next = parseFloat(((value * 10) + parseInt(e.key) / 100).toFixed(2))
    onChange(next)
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', width, position: 'relative' }}>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        readOnly
        disabled={disabled}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        style={{
          width: '100%',
          border: '1px solid #d9d9d9',
          borderRadius: 2,
          padding: suffix ? '4px 28px 4px 8px' : '4px 8px',
          fontSize: 13,
          outline: 'none',
          background: disabled ? '#fafafa' : '#fff',
          color: disabled ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.85)',
          fontFamily: 'Roboto',
          textAlign: 'left',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={e => { if (!disabled) (e.target as HTMLInputElement).style.border = '1px solid #1890FF' }}
        onBlur={e => (e.target as HTMLInputElement).style.border = '1px solid #d9d9d9'}
      />
      {suffix && (
        <span style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, color: 'rgba(0,0,0,0.45)', pointerEvents: 'none',
        }}>{suffix}</span>
      )}
    </span>
  )
}
