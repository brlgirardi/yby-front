'use client'

import Tooltip from '@/components/shared/Tooltip'

export interface MetricProps {
  /** Rótulo principal (ex: "Transações", "Volume", "ITC"). */
  label: string
  /** Tooltip explicativo (jargão Tupi). */
  tooltip?: string
  /** Valor da origem A (Capture). */
  valuePrimary: string
  /** Valor da origem B (Outgoing). */
  valueSecondary: string
  /** Rótulo da origem A. Default "Captura". */
  primaryLabel?: string
  /** Rótulo da origem B. Default "Outgoing". */
  secondaryLabel?: string
  /** Valores numéricos para colorir divergência. */
  firstValue?: number
  secondValue?: number
}

/**
 * Métrica dual capture vs outgoing — bloco usado nos cards de conciliação.
 * Vocabulário Tupi: source_a (capture) × source_b (outgoing).
 *
 * Quando os dois valores divergem, o segundo é destacado em vermelho.
 */
export default function Metric({
  label, tooltip, valuePrimary, valueSecondary,
  primaryLabel = 'Captura', secondaryLabel = 'Outgoing',
  firstValue, secondValue,
}: MetricProps) {
  const diverges = firstValue !== undefined && secondValue !== undefined && firstValue !== secondValue

  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', fontWeight: 500 }}>{label}</span>
        {tooltip && (
          <Tooltip text={tooltip} delay={1000}>
            <span />
          </Tooltip>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', minWidth: 56 }}>{primaryLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{valuePrimary}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', minWidth: 56 }}>{secondaryLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: diverges ? '#FF4D4F' : 'rgba(0,0,0,0.85)' }}>
            {valueSecondary}
          </span>
        </div>
      </div>
    </div>
  )
}
