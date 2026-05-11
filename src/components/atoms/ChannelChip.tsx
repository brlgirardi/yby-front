'use client'
// Chip de canal de venda — padrão Tupi (bg cinza #F2F2F7 + ícone Lucide + texto).
// Reusado em: transactions SUB, EC Cobranças, EC Extrato e onde mais aparecer canal.
//
// Atomic Design: Domain (componente de negócio).

import Icon from './Icon'
import Tooltip from './Tooltip'

export type Channel = 'pos' | 'link' | 'ecommerce'

interface ChannelChipProps {
  channel: Channel
  /** ID da maquininha — quando presente em canal POS, mostra "POS-{id}" */
  posId?: string
  /** Truncar label longa após N chars (default 12) */
  maxLength?: number
}

const CHANNEL_META: Record<Channel, { icon: string; label: string; tip: string }> = {
  pos:       { icon: 'pos',          label: 'POS',       tip: 'POS — transação capturada em maquininha física no estabelecimento.' },
  link:      { icon: 'externalLink', label: 'Link',      tip: 'Link de pagamento — checkout enviado por mensagem/email.' },
  ecommerce: { icon: 'shoppingCart', label: 'Ecommerce', tip: 'Ecommerce — checkout integrado no site do estabelecimento.' },
}

export default function ChannelChip({ channel, posId, maxLength = 12 }: ChannelChipProps) {
  const meta = CHANNEL_META[channel]
  const label = channel === 'pos' && posId ? `POS-${posId}` : meta.label
  const truncated = label.length > maxLength ? label.slice(0, maxLength - 1) + '…' : label

  return (
    <Tooltip text={`${meta.tip}${posId ? `\nID da maquininha: ${posId}` : ''}`} bare>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#F2F2F7',
          borderRadius: 2,
          padding: '2px 7px',
          fontSize: 12,
          color: 'rgba(0,0,0,0.85)',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={meta.icon} size={14} color="rgba(0,0,0,0.65)" />
        <span>{truncated}</span>
      </span>
    </Tooltip>
  )
}
