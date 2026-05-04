'use client'

import { Inbox } from 'lucide-react'
import { Button } from 'antd'

export interface EmptyStateProps {
  /** Ícone lucide ou node custom. Default: Inbox cinza 48px. */
  icon?: React.ReactNode
  /** Título principal (negrito, escuro). */
  title: string
  /** Descrição (cinza, 1-2 linhas idealmente). */
  description?: React.ReactNode
  /** CTA opcional. */
  action?: {
    label: string
    onClick: () => void
    /** Tipo do botão (default 'primary'). */
    type?: 'primary' | 'default'
    /** Ícone à esquerda do label. */
    icon?: React.ReactNode
  }
  /** Padding vertical do container (default 80). */
  paddingY?: number
  /** Largura máxima do bloco para legibilidade (default 460). */
  maxWidth?: number
}

/**
 * Empty state padrão Yby Front. Centraliza ícone + título + descrição + CTA opcional.
 *
 * Uso típico:
 * - "Nenhum custo configurado" (Pricing) com CTA "Configurar custos"
 * - "Sem dados nesta data" (Conciliação) sem CTA
 * - "Configure os custos primeiro" (Preços) com CTA "Ir para Custos"
 *
 * Heurística Nielsen #6: recognition over recall — explica o estado e mostra
 * o que o usuário pode fazer.
 *
 * a11y: `role="status"` para anunciar a leitor de tela; ícone é decorativo (`aria-hidden`).
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  paddingY = 80,
  maxWidth = 460,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${paddingY}px 0`,
        maxWidth,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div aria-hidden="true" style={{ marginBottom: 16, color: '#d9d9d9', display: 'flex' }}>
        {icon ?? <Inbox size={48} />}
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 6 }}>
        {title}
      </div>

      {description && (
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: action ? 20 : 0 }}>
          {description}
        </div>
      )}

      {action && (
        <Button
          type={action.type ?? 'primary'}
          icon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
