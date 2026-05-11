'use client'

import React from 'react'

interface BadgeProps {
  count: number
  /** Valor máximo exibido antes de mostrar "99+" (default 99) */
  max?: number
  /** Cor de fundo do badge (default #FF4D4F — erro/Dust Red) */
  color?: string
  /** Mostra ponto sem número (para notificação sem contagem) */
  dot?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

export default function Badge({
  count,
  max = 99,
  color = '#FF4D4F',
  dot = false,
  children,
  style,
}: BadgeProps) {
  const displayCount = count > max ? `${max}+` : String(count)
  const isVisible = dot || count > 0

  if (!children) {
    // Standalone badge
    if (!isVisible) return null
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: color,
          color: '#fff',
          borderRadius: dot ? '50%' : 99,
          fontSize: dot ? 0 : 10,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          lineHeight: 1,
          width: dot ? 8 : undefined,
          height: dot ? 8 : 16,
          minWidth: dot ? 8 : 16,
          padding: dot ? 0 : '0 4px',
          ...style,
        }}
      >
        {!dot && displayCount}
      </span>
    )
  }

  // Wrapped badge (over a child element)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', ...style }}>
      {children}
      {isVisible && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -6,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: color,
            color: '#fff',
            borderRadius: dot ? '50%' : 99,
            fontSize: dot ? 0 : 10,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            lineHeight: 1,
            width: dot ? 8 : undefined,
            height: dot ? 8 : 16,
            minWidth: dot ? 8 : 16,
            padding: dot ? 0 : '0 4px',
            border: '2px solid #fff',
            boxSizing: 'border-box',
          }}
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  )
}
