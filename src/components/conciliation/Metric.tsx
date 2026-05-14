'use client'

import Tooltip from '@/components/atoms/Tooltip'
import Icon from '@/components/atoms/Icon'

export type MetricRowKind = 'reconciled' | 'mismatch' | 'notReconciled'

export interface MetricRow {
  kind: MetricRowKind
  value: React.ReactNode
}

export interface MetricProps {
  label: string
  /** Tooltip explicativo (jargão Tupi). */
  tooltip?: string
  /**
   * Nova API: até 3 linhas, cada uma com ícone+cor próprios.
   * Quando definida, ignora valuePrimary/valueSecondary.
   */
  rows?: MetricRow[]
  /** Legacy: valor principal (origem A / capture). */
  valuePrimary?: React.ReactNode
  /** Legacy: valor secundário (origem B / outgoing). */
  valueSecondary?: React.ReactNode
  /** Legacy: valores numéricos para colorir divergência em vermelho. */
  firstValue?: number
  secondValue?: number
}

const ROW_STYLE: Record<MetricRowKind, { icon: 'checkCircle' | 'circleX' | 'circleHelp'; color: string }> = {
  reconciled:    { icon: 'checkCircle', color: 'rgba(0,0,0,0.85)' },
  mismatch:      { icon: 'circleX',     color: '#F5222D' },
  notReconciled: { icon: 'circleHelp',  color: 'rgba(0,0,0,0.45)' },
}

function Row({ row }: { row: MetricRow }) {
  const style = ROW_STYLE[row.kind]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
      <Icon name={style.icon} size={14} color={style.color} />
      <span style={{ fontSize: 12, fontWeight: 400, color: style.color, lineHeight: '22px' }}>
        {row.value}
      </span>
    </div>
  )
}

/**
 * Métrica Tupi — label pequeno em cima, até 3 linhas com ícone (✓/✗/?) embaixo.
 *
 * Estados das linhas (Figma 185364-61945):
 *  - reconciled   ✓ neutro
 *  - mismatch     ✗ vermelho (#F5222D)
 *  - notReconciled ? cinza  (faltou arquivo / dado ausente)
 */
export default function Metric({
  label,
  tooltip,
  rows,
  valuePrimary,
  valueSecondary,
  firstValue,
  secondValue,
}: MetricProps) {
  // Modo novo (rows) — usado pelas telas atualizadas
  if (rows && rows.length > 0) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
          {tooltip && <Tooltip text={tooltip} delay={1000}><span /></Tooltip>}
        </div>
        {rows.map((r, i) => <Row key={i} row={r} />)}
      </div>
    )
  }

  // Modo legacy — mantido para callers antigos (BrandDetail, etc.)
  const diverges =
    firstValue !== undefined && secondValue !== undefined && firstValue !== secondValue

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
        {tooltip && <Tooltip text={tooltip} delay={1000}><span /></Tooltip>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>{valuePrimary}</div>
      {valueSecondary !== undefined && valueSecondary !== null && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: diverges ? '#FF4D4F' : 'rgba(0,0,0,0.85)',
            marginTop: 4,
          }}
        >
          {valueSecondary}
        </div>
      )}
    </div>
  )
}
