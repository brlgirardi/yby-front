'use client'

import { useState } from 'react'
import Loading from '@/components/shared/Loading'
import { formatCurrency } from '@/lib/conciliation/formatters'
import type { TransactionDetail } from '@/services/types/brandDetail.types'

export interface TransactionsTableProps {
  transactions: TransactionDetail[]
  variant?: 'non-conciliated' | 'conciliated'
  loading?: boolean
  pageSize?: number
}

/**
 * Lista de transações dentro de um IRD — mostradas no drawer de detalhe.
 * Cada linha: NSU, Terminal ID, Valor, ITC apurado.
 *
 * Espelha `TransactionsTable` do branch LGR-264-recon-acquirer.
 */
export default function TransactionsTable({
  transactions,
  variant = 'non-conciliated',
  loading = false,
  pageSize = 10,
}: TransactionsTableProps) {
  const [page, setPage] = useState(1)
  const isConciliated = variant === 'conciliated'
  const bg = isConciliated ? '#F6FFED' : '#FFFBE6'

  if (loading) return <Loading paddingY={20} />
  if (transactions.length === 0) return <div style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Sem transações.</div>

  const totalPages = Math.ceil(transactions.length / pageSize)
  const visible = transactions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '4px 16px', fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
        <span>Data/Hora</span>
        <span>Terminal ID</span>
        <span>NSU</span>
        <span style={{ textAlign: 'right' }}>Valor</span>
        <span style={{ textAlign: 'right' }}>ITC apurado</span>
      </div>

      {visible.map((t, i) => (
        <div key={`${t.nsu}_${t.terminalId}_${i}`}
          style={{
            background: bg, borderRadius: 2,
            padding: '12px 16px',
            display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: 8,
            fontSize: 12, color: 'rgba(0,0,0,0.85)',
          }}>
          <span style={{ color: 'rgba(0,0,0,0.65)' }}>
            {t.transactionDate ? new Date(t.transactionDate).toLocaleString('pt-BR') : '—'}
          </span>
          <span style={{ fontFamily: 'Roboto Mono' }}>{t.terminalId ?? '—'}</span>
          <span style={{ fontFamily: 'Roboto Mono' }}>{t.nsu ?? '—'}</span>
          <span style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(t.amount)}</span>
          <span style={{ textAlign: 'right', fontWeight: 600, color: '#1890FF' }}>{formatCurrency(t.calculatedItc)}</span>
        </div>
      ))}

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '8px 16px', fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={pgBtn(page === 1)}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={pgBtn(page === totalPages)}>Próxima</button>
        </div>
      )}
    </div>
  )
}

const pgBtn = (disabled: boolean): React.CSSProperties => ({
  background: '#fff', border: '1px solid #d9d9d9', borderRadius: 2,
  padding: '4px 12px', fontSize: 12, fontFamily: 'Roboto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
})
