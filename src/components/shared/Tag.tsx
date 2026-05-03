'use client'

export type TagVariant =
  | 'Aprovado'   | 'Aprovada'
  | 'Pago'
  | 'Liquidado'  | 'Quitado' | 'Recuperado'
  | 'Repassado'  | 'Publicado'
  | 'Pendente'   | 'Em processamento' | 'Em análise'
  | 'Em aberto'  | 'A recuperar' | 'Previsto' | 'Antecipado' | 'Agendado'
  | 'Recusado'   | 'Recusada'
  | 'Cancelado'  | 'Cancelada' | 'Inativo'
  | 'Estorno'    | 'Estornada' | 'Suspenso' | 'Parcialmente liquidado' | 'Reprovado'
  | 'Chargeback' | 'Crédito bloqueado' | 'Bloqueado' | 'Erro'
  | 'Ativo'
  | 'Info'
  // ─── Conciliação / Reconciliation (vocabulário Tupi) ───
  | 'Reconciliado' | 'Conciliado'
  | 'Parc. Conciliado' | 'Parcialmente conciliado'
  | 'Divergência' | 'Não Conciliado' | 'Mismatch'

/**
 * Sistema de status semântico — 5 níveis (Rauch + Pixel)
 *
 *   success    — operação concluída, nada a fazer        — VERDE
 *   processing — sistema executando, usuário aguarda     — AZUL
 *   future     — evento previsto/agendado, sem ação      — CINZA-ROXO
 *   warning    — REQUER atenção/decisão do usuário        — AMARELO
 *   error      — falha ou bloqueio definitivo            — VERMELHO
 *   neutral    — operação encerrada sem efeito           — CINZA
 */
type SemanticTone = 'success' | 'processing' | 'future' | 'warning' | 'error' | 'neutral'

const TONE_PALETTE: Record<SemanticTone, { bg: string; color: string; border: string }> = {
  success:    { bg: '#F6FFED', color: '#237804',         border: '#B7EB8F' }, // Polar Green
  processing: { bg: '#E6F7FF', color: '#003A8C',         border: '#91D5FF' }, // DayBreak Blue
  future:     { bg: '#F9F0FF', color: '#531DAB',         border: '#D3ADF7' }, // Geek Purple — temporal
  warning:    { bg: '#FFFBE6', color: '#874D00',         border: '#FFE58F' }, // Calendula Gold
  error:      { bg: '#FFF1F0', color: '#820014',         border: '#FFCCC7' }, // Dust Red
  neutral:    { bg: '#F5F5F5', color: 'rgba(0,0,0,0.55)', border: '#D9D9D9' }, // Cinza
}

type IconType = 'check' | 'loader' | 'clock' | 'alert' | 'x' | 'minus' | 'info'

const STATUS_MAP: Record<string, { tone: SemanticTone; icon: IconType }> = {
  // ─── SUCCESS — operação concluída ───
  Aprovado:     { tone: 'success', icon: 'check' },
  Aprovada:     { tone: 'success', icon: 'check' },
  Pago:         { tone: 'success', icon: 'check' },
  Liquidado:    { tone: 'success', icon: 'check' },
  Quitado:      { tone: 'success', icon: 'check' },
  Recuperado:   { tone: 'success', icon: 'check' },
  Repassado:    { tone: 'success', icon: 'check' },
  Publicado:    { tone: 'success', icon: 'check' },
  Ativo:        { tone: 'success', icon: 'check' },

  // Conciliação Tupi: estado terminal positivo
  Reconciliado: { tone: 'success', icon: 'check' },
  Conciliado:   { tone: 'success', icon: 'check' },

  // ─── PROCESSING — sistema executando, usuário aguarda ───
  Pendente:           { tone: 'processing', icon: 'loader' },
  'Em processamento': { tone: 'processing', icon: 'loader' },
  'Em análise':       { tone: 'processing', icon: 'loader' },

  // ─── FUTURE — evento agendado/previsto, temporal ───
  Previsto:     { tone: 'future', icon: 'clock' },
  Agendado:     { tone: 'future', icon: 'clock' },
  'A recuperar':{ tone: 'future', icon: 'clock' },
  'Em aberto':  { tone: 'future', icon: 'clock' },
  Antecipado:   { tone: 'future', icon: 'clock' },

  // ─── WARNING — exige atenção/ação do usuário ───
  'Parcialmente liquidado':  { tone: 'warning', icon: 'alert' },
  'Parc. Conciliado':        { tone: 'warning', icon: 'alert' },
  'Parcialmente conciliado': { tone: 'warning', icon: 'alert' },
  Suspenso:                  { tone: 'warning', icon: 'alert' },
  Estorno:                   { tone: 'warning', icon: 'alert' },
  Estornada:                 { tone: 'warning', icon: 'alert' },

  // ─── ERROR — falha/bloqueio definitivo ───
  Recusado:             { tone: 'error', icon: 'x' },
  Recusada:             { tone: 'error', icon: 'x' },
  Reprovado:            { tone: 'error', icon: 'x' },
  Chargeback:           { tone: 'error', icon: 'x' },
  'Crédito bloqueado':  { tone: 'error', icon: 'x' },
  Bloqueado:            { tone: 'error', icon: 'x' },
  Erro:                 { tone: 'error', icon: 'x' },

  // Conciliação Tupi: divergência / não conciliado → ação requerida
  'Divergência':        { tone: 'error', icon: 'alert' },
  'Não Conciliado':     { tone: 'error', icon: 'alert' },
  Mismatch:             { tone: 'error', icon: 'alert' },

  // ─── NEUTRAL — encerrado sem efeito ───
  Cancelado:    { tone: 'neutral', icon: 'minus' },
  Cancelada:    { tone: 'neutral', icon: 'minus' },
  Inativo:      { tone: 'neutral', icon: 'minus' },

  // ─── INFO genérico (fallback) ───
  Info:         { tone: 'processing', icon: 'info' },
}

// Ícones — todos no mesmo viewBox 24×24, stroke=currentColor, mesma weight 2.5
const ICONS: Record<IconType, React.ReactNode> = {
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  loader: (
    // Spinner animado — círculo com gap rotacionando (sinal claro de "está rolando")
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
  clock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  alert: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
  info: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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
  const def = STATUS_MAP[status] ?? STATUS_MAP['Info']
  const palette = TONE_PALETTE[def.tone]
  const icon = ICONS[def.icon]

  return (
    <span
      style={{
        background: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
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
