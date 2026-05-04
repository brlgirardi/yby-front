'use client'

import { Spin } from 'antd'

export interface LoadingProps {
  /** Texto opcional abaixo do spinner. */
  message?: string
  /** Tamanho do spinner. Default 'default' (24px). */
  size?: 'small' | 'default' | 'large'
  /** Padding vertical do container. Default 40. */
  paddingY?: number
  /** Renderiza inline (sem block flex). Útil em botões/células de tabela. */
  inline?: boolean
}

/**
 * Loading state padrão Yby Front. Spinner antd centralizado com texto opcional.
 *
 * Quando você precisa de feedback de carregamento estruturado (não skeleton),
 * use este componente. Para carregamentos longos com forma conhecida, prefira
 * skeletons (PricingSkeleton, ConciliationSkeleton).
 *
 * a11y: o Spin antd já tem `aria-busy`; quando há `message`, ela é anunciada
 * (via aria-live default do antd).
 */
export default function Loading({
  message,
  size = 'default',
  paddingY = 40,
  inline = false,
}: LoadingProps) {
  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Spin size={size} />
        {message && <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>{message}</span>}
      </span>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: `${paddingY}px 0`,
      }}
    >
      <Spin size={size} />
      {message && (
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>
          {message}
        </div>
      )}
    </div>
  )
}
