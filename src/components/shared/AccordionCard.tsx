'use client'
// Accordion card Tupi — header branco (hover #fafafa) + body cinza expandido.
// Pattern espelha o `AcquirerCostCard` da pricing SUB. Use em qualquer lugar
// que precise de "card colapsável" no padrão TUPI.
//
// Atomic Design: Molecule.

import { useState } from 'react'
import Icon from '@/components/atoms/Icon'

export interface AccordionCardProps {
  /** Conteúdo do header — pode ser string ou ReactNode (ícone + label + tags) */
  header: React.ReactNode
  /** Texto auxiliar à direita do chevron (ex: "12 linhas configuradas") */
  meta?: React.ReactNode
  /** Conteúdo expandido — body com bg #fafafa */
  children: React.ReactNode
  /** Aberto por default */
  defaultOpen?: boolean
}

export default function AccordionCard({ header, meta, children, defaultOpen = true }: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Roboto',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#fafafa')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#fff')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {header}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          {meta}
          <Icon name={open ? 'chevronUp' : 'chevronDown'} size={14} />
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa', padding: '12px 20px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
