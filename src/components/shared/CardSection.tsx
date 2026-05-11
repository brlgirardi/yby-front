'use client'
// CardSection — padrão visual de bloco do design system Yby.
//
// Estrutura: header com ícone + título + (opcional) extra à direita,
// linha divisória horizontal, body com padding consistente. Usado em
// dashboards, telas de detalhe, drawers, etc. Reage ao tema (Tupi/Vero).
//
// Substitui blocos `<div style={...}>...<div borderBottom>...</div>...</div>`
// repetidos em N telas — agora basta `<CardSection title="..." icon="...">`.

import React from 'react'
import Icon from '@/components/atoms/Icon'
import { useTheme } from '@/stores/themeStore'

export interface CardSectionProps {
  /** Título obrigatório (semântica visual + a11y). */
  title: string
  /** Ícone Lucide opcional, renderizado à esquerda do título. */
  icon?: string
  /** Subtítulo descritivo que aparece abaixo do título no header. */
  subtitle?: string
  /** Conteúdo livre à direita do header (filtros, ações, toggles). */
  extra?: React.ReactNode
  /** Conteúdo do bloco. */
  children?: React.ReactNode
  /** Remove o padding interno do body (útil para tabelas/charts edge-to-edge). */
  noBodyPadding?: boolean
  /** Override de cor do ícone (default: theme.primary). */
  iconColor?: string
  /** Style/className opcionais do container externo. */
  style?: React.CSSProperties
  className?: string
}

export default function CardSection({
  title,
  icon,
  subtitle,
  extra,
  children,
  noBodyPadding = false,
  iconColor,
  style,
  className,
}: CardSectionProps) {
  const theme = useTheme()
  const finalIconColor = iconColor ?? theme.primary

  return (
    <section
      className={className}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <header
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {icon && <Icon name={icon} size={16} color={finalIconColor} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', lineHeight: '20px' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
      </header>

      <div style={{ padding: noBodyPadding ? 0 : 20, flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </section>
  )
}
