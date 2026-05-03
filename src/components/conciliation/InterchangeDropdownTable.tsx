'use client'

import Icon from '@/components/shared/Icon'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { InterchangeRecord } from '@/services/types/brandDetail.types'

export interface InterchangeDropdownTableProps {
  records: InterchangeRecord[]
  variant: 'divergent' | 'conciliated'
  onRowClick?: (record: InterchangeRecord) => void
}

/**
 * Tabela de IRDs (group codes) consolidados, agrupados por status.
 * Layout: linha por IRD com bloco "Incoming" (capture) + "Outgoing" (registradora)
 * lado a lado. Click leva ao drawer de detalhes (transações divergentes do IRD).
 *
 * Espelha `InterchangeDropdownTable` do branch LGR-264-recon-acquirer.
 */
export default function InterchangeDropdownTable({ records, variant, onRowClick }: InterchangeDropdownTableProps) {
  if (records.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>Sem registros.</div>
  }

  const isDivergent = variant === 'divergent'
  const bg = isDivergent ? '#FFFBE6' : '#F6FFED'
  const accent = isDivergent ? '#FF4D4F' : '#237804'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 24px 1fr 1fr', gap: 0, fontSize: 11, color: 'rgba(0,0,0,0.45)', padding: '4px 8px' }}>
        <span>Dados do intercâmbio</span>
        <span />
        <span>Incoming (capture)</span>
        <span>Outgoing (registradora)</span>
      </div>

      {records.map(record => (
        <button
          key={record.consolidationId}
          onClick={() => onRowClick?.(record)}
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 24px 1fr 1fr 24px',
            gap: 0, alignItems: 'stretch',
            background: 'transparent', border: 'none', padding: 0,
            cursor: onRowClick ? 'pointer' : 'default',
            fontFamily: 'Roboto', textAlign: 'left',
          }}
        >
          {/* Bloco IRD */}
          <div style={{ ...cell(bg), fontSize: 13, color: 'rgba(0,0,0,0.85)' }}>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>IRD</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{record.interchangeCode}</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
              <span style={{ fontFamily: 'Roboto Mono' }}>{record.consolidationId}</span>
            </div>
          </div>

          <div />

          {/* Incoming (source A / capture) */}
          <SourceBlock
            bg={bg}
            transactions={record.transactions.sourceA}
            tpv={record.tpv.sourceA}
            itc={record.discounts.sourceA}
            color={accent}
            divergent={isDivergent}
          />

          {/* Outgoing (source B / registradora) */}
          <SourceBlock
            bg={bg}
            transactions={record.transactions.sourceB}
            tpv={record.tpv.sourceB}
            itc={record.discounts.sourceB}
            color={accent}
            divergent={isDivergent}
            withDivider
          />

          {/* Chevron */}
          <div style={{ ...cell(bg), display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 0 }}>
            <Icon name="chevronRight" size={12} color="rgba(0,0,0,0.45)" />
          </div>
        </button>
      ))}
    </div>
  )
}

interface SourceBlockProps {
  bg: string
  transactions: number
  tpv: number
  itc: number
  color: string
  divergent: boolean
  withDivider?: boolean
}

function SourceBlock({ bg, transactions, tpv, itc, color, divergent, withDivider }: SourceBlockProps) {
  return (
    <div style={{
      ...cell(bg),
      borderLeft: withDivider ? '1px solid rgba(0,0,0,0.06)' : undefined,
      paddingLeft: withDivider ? 18 : 16,
      display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12,
    }}>
      <Stat label="Transações" value={transactions.toLocaleString('pt-BR')} color={divergent ? color : '#237804'} />
      <Stat label="TPV"         value={formatCurrency(tpv)}                color={divergent ? color : '#237804'} />
      <Stat label="ITC"         value={formatCurrency(itc)}                color={divergent ? color : '#237804'} />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'rgba(0,0,0,0.65)' }}>{label}:</span>
      <span style={{ color, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

const cell = (bg: string): React.CSSProperties => ({
  background: bg,
  borderRadius: 2,
  padding: '14px 16px',
})
