// src/components/atoms/OpTypeTag.tsx
'use client'

/**
 * Tag de tipo de operação (Crédito / Débito) consistente com o StatusTag do DS.
 *
 * Decisão cromática (Pixel UX spec):
 *  - Crédito  → info (azul DayBreak): entrada de valor é neutro-positivo,
 *               não confundir com `success` que é status terminal.
 *  - Débito   → orange (laranja Sunset): atenção sem alarmar — vermelho fica
 *               reservado para erro real, evitando "wolf cry" em coluna densa.
 */

export type OpType = 'Credit' | 'Debit'

const TYPE_MAP: Record<OpType, { label: string; classes: string }> = {
  Credit: {
    label: 'Crédito',
    classes: 'bg-info-bg text-info border-info-border',
  },
  Debit: {
    label: 'Débito',
    classes: 'bg-orange-bg text-orange border-orange-border',
  },
}

interface OpTypeTagProps {
  type: string
}

export default function OpTypeTag({ type }: OpTypeTagProps) {
  const def = TYPE_MAP[type as OpType]
  if (!def) {
    return (
      <span className="inline-flex items-center px-2 border border-border-default text-text-secondary rounded-xs text-sm leading-5 font-sans whitespace-nowrap">
        {type}
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center px-2 border rounded-xs text-sm leading-5 font-sans whitespace-nowrap ${def.classes}`}
    >
      {def.label}
    </span>
  )
}
