'use client'

import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { getReconciliationStatusLabel } from '@/lib/conciliation/statusUtils'

export interface ConciliationBadgeProps {
  statusText: string
  /** Em tela compacta, reduz para 96×48. Default 128×64. */
  size?: 'sm' | 'md'
  /** Texto opcional substituindo o label padrão (ex: "99% Conciliado"). */
  label?: string
}

type Variant = 'success' | 'warning' | 'help'

/**
 * Badge grande Tupi: bloco quadrado com ícone (Check / Warning / Help) + label.
 * Figma node 185364-61945:
 *   reconciled              → verde #237804 em #D9F7BE  (CheckCircle)
 *   mismatch / partially…   → amarelo #876800 em #FFFFB8 (AlertTriangle)
 *   not_reconciled          → cinza  #8C8C8C em #F5F5F5  (HelpCircle)
 */
const STYLE: Record<Variant, { color: string; bg: string; Icon: typeof CheckCircle2 }> = {
  success: { color: '#237804', bg: '#D9F7BE', Icon: CheckCircle2 },
  warning: { color: '#876800', bg: '#FFFFB8', Icon: AlertTriangle },
  help:    { color: '#595959', bg: '#F5F5F5', Icon: HelpCircle },
}

function variantFor(status: string): Variant {
  const n = status.toLowerCase()
  if (n === 'reconciled') return 'success'
  if (n === 'not_reconciled') return 'help'
  return 'warning'
}

export default function ConciliationBadge({ statusText, size = 'md', label }: ConciliationBadgeProps) {
  const v = variantFor(statusText)
  const { color, bg, Icon } = STYLE[v]
  const dim = size === 'md' ? { w: 128, h: 64 } : { w: 96, h: 48 }
  const text = label ?? getReconciliationStatusLabel(statusText)

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
      <span>{text}</span>
    </span>
  )
}
