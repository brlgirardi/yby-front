'use client'

import Tooltip from '@/components/shared/Tooltip'

export interface MetricProps {
  label: string
  /** Tooltip explicativo (jargão Tupi). */
  tooltip?: string
  /** Valor principal (origem A / capture). */
  valuePrimary: React.ReactNode
  /** Valor secundário (origem B / outgoing). Pode ser omitido. */
  valueSecondary?: React.ReactNode
  /** Valores numéricos para colorir divergência em vermelho. */
  firstValue?: number
  secondValue?: number
}

/**
 * Métrica Tupi — label pequeno em cima, dois valores empilhados embaixo.
 * Quando os dois valores numéricos divergem, o secundário fica vermelho.
 *
 * Espelha `Metric` do branch LGR-264-recon-acquirer.
 */
export default function Metric({
  label, tooltip,
  valuePrimary, valueSecondary,
  firstValue, secondValue,
}: MetricProps) {
  const diverges = firstValue !== undefined && secondValue !== undefined && firstValue !== secondValue

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
        {tooltip && <Tooltip text={tooltip} delay={1000}><span /></Tooltip>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>{valuePrimary}</div>
      {valueSecondary !== undefined && valueSecondary !== null && (
        <div style={{ fontSize: 13, fontWeight: 500, color: diverges ? '#FF4D4F' : 'rgba(0,0,0,0.85)', marginTop: 4 }}>
          {valueSecondary}
        </div>
      )}
    </div>
  )
}
