'use client'

export type TagVariant =
  | 'Aprovado'
  | 'Aprovada'
  | 'Pago'
  | 'Liquidado'
  | 'Quitado'
  | 'Recuperado'
  | 'Pendente'
  | 'Em aberto'
  | 'A recuperar'
  | 'Previsto'
  | 'Recusado'
  | 'Recusada'
  | 'Cancelado'
  | 'Cancelada'
  | 'Estorno'
  | 'Estornada'
  | 'Em análise'
  | 'Ativo'
  | 'Suspenso'
  | 'Inativo'
  | 'Antecipado'
  | 'Chargeback'
  | 'Erro'
  | 'Info'

type IconType = 'check' | 'info' | 'x' | 'minus' | 'alert'

const STATUS_MAP: Record<string, { bg: string; color: string; border: string; icon: IconType }> = {
  // Sucesso — Polar Green
  Aprovado:     { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Aprovada:     { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Pago:         { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Ativo:        { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Liquidado:    { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Quitado:      { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },
  Recuperado:   { bg: '#F6FFED', color: '#237804', border: '#D9F7BE', icon: 'check' },

  // Warning — Calendula Gold
  Pendente:       { bg: '#FFFBE6', color: '#874D00', border: '#FFE58F', icon: 'info'  },
  'Em aberto':    { bg: '#FFFBE6', color: '#874D00', border: '#FFE58F', icon: 'info'  },
  'A recuperar':  { bg: '#FFFBE6', color: '#874D00', border: '#FFE58F', icon: 'info'  },
  Suspenso:       { bg: '#FFFBE6', color: '#874D00', border: '#FFE58F', icon: 'alert' },
  Antecipado:     { bg: '#FFF7E6', color: '#874D00', border: '#FFD591', icon: 'info'  },

  // Erro — Dust Red
  Recusado:     { bg: '#FFF1F0', color: '#820014', border: '#FFCCC7', icon: 'x'     },
  Recusada:     { bg: '#FFF1F0', color: '#820014', border: '#FFCCC7', icon: 'x'     },
  Chargeback:   { bg: '#FFF1F0', color: '#820014', border: '#FFCCC7', icon: 'x'     },
  Erro:         { bg: '#FFF1F0', color: '#820014', border: '#FFCCC7', icon: 'x'     },

  // Neutro
  Cancelado:    { bg: '#F5F5F5', color: 'rgba(0,0,0,0.45)', border: '#D9D9D9', icon: 'minus' },
  Cancelada:    { bg: '#F5F5F5', color: 'rgba(0,0,0,0.45)', border: '#D9D9D9', icon: 'minus' },
  Estorno:      { bg: '#FFF7E6', color: '#874D00', border: '#FFD591', icon: 'alert' },
  Estornada:    { bg: '#FFF7E6', color: '#874D00', border: '#FFD591', icon: 'alert' },
  Inativo:      { bg: '#F5F5F5', color: 'rgba(0,0,0,0.45)', border: '#D9D9D9', icon: 'minus' },

  // Info — DayBreak Blue
  'Em análise': { bg: '#E6F7FF', color: '#003A8C', border: '#91D5FF', icon: 'info'  },
  Info:         { bg: '#E6F7FF', color: '#003A8C', border: '#91D5FF', icon: 'info'  },
  Previsto:     { bg: '#E6F7FF', color: '#003A8C', border: '#91D5FF', icon: 'info'  },
}

// Circle-style icons — stroke="currentColor" herda a cor do texto do span pai
const ICONS: Record<IconType, React.ReactNode> = {
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  info: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  minus: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  alert: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

interface TagProps {
  status: string
  /** Override do label exibido (se diferente do status key) */
  label?: string
  /**
   * Exibe ícone antes do texto.
   * @default true — segue o padrão Figma (círculo com símbolo semântico)
   */
  showIcon?: boolean
}

export default function Tag({ status, label, showIcon = true }: TagProps) {
  const s = STATUS_MAP[status] ?? STATUS_MAP['Pendente']
  const icon = ICONS[s.icon]

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 2,
        padding: showIcon ? '1px 7px 1px 5px' : '0 7px',
        fontSize: 12,
        lineHeight: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && icon}
      {label ?? status}
    </span>
  )
}
