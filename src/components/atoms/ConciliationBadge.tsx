'use client'

import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { getReconciliationStatusLabel } from '@/lib/conciliation/statusUtils'

export interface ConciliationBadgeProps {
  statusText: string
  /** Em tela compacta, reduz para 96×48. Default 128×64. */
  size?: 'sm' | 'md'
}

/**
 * Badge grande Tupi: bloco quadrado com ícone (Check / Warning) + label.
 * Verde para "reconciled", amarelo para qualquer outro estado divergente.
 *
 * Espelha `ConciliationBadge` do branch LGR-264-recon-acquirer.
 */
export default function ConciliationBadge({ statusText, size = 'md' }: ConciliationBadgeProps) {
  const normalized = statusText.toLowerCase()
  const isReconciled = normalized === 'reconciled'
  const color = isReconciled ? '#237804' : '#874D00'
  const bg = isReconciled ? '#D9F7BE' : '#FFFFB8'
  const Icon = isReconciled ? CheckCircle2 : AlertTriangle
  const label = getReconciliationStatusLabel(statusText)
  const dim = size === 'md' ? { w: 128, h: 64 } : { w: 96, h: 48 }

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: dim.w,
        height: dim.h,
        borderRadius: 2,
        padding: '6px 8px',
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: '14px',
        textAlign: 'center',
      }}
    >
      <Icon size={16} color={color} />
      <span>{label}</span>
    </span>
  )
}
