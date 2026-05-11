'use client'
// Drawer lateral Tupi — padrão usado em financial/page.tsx (SUB).
// Extraído pra ser shared entre SUB e EC.
//
// Estrutura: overlay 0.45 + painel direito (default 480px) com header
// (título + close), body scrollable e footer opcional.
//
// Atomic Design: Molecule.

import Icon from '@/components/atoms/Icon'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  width?: number
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function Drawer({ open, onClose, title, width = 480, children, footer }: DrawerProps) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
      <div
        style={{
          position: 'relative',
          width,
          height: '100%',
          background: '#fff',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16, color: 'rgba(0,0,0,0.85)' }}>{title}</span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>{children}</div>
        {footer && (
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: 12,
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
