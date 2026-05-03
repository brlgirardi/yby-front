'use client'

import { useEffect, useState } from 'react'
import { fetchAcquirerMismatchByConsolidationId } from '@/services/acquirerReconciliationService'
import type {
  AcquirerMismatchResponse,
  InterchangeDetailData,
  MismatchSourceSummaryAPI,
  MismatchTransactionAPI,
  TransactionDetail,
} from '@/services/types/brandDetail.types'
import { normalizeConciliationRate } from '@/lib/conciliation/statusUtils'

const toNumber = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const mapTx = (t: MismatchTransactionAPI): TransactionDetail => ({
  nsu: t.nsu,
  terminalId: t.terminal_id,
  amount: toNumber(t.amount),
  calculatedItc: toNumber(t.calculated_itc),
})

const mapSource = (s: MismatchSourceSummaryAPI) => ({
  transactionCount: s.transaction_count,
  tpv: s.tpv,
  itc: s.itc,
})

const mapResponse = (r: AcquirerMismatchResponse): InterchangeDetailData => ({
  groupCode: r.group_code,
  sourceA: mapSource(r.source_a),
  sourceB: mapSource(r.source_b),
  consolidationRate: normalizeConciliationRate(r.consolidation_rate),
  nonConciliatedTransactions: (r.details_transactions?.divergent_transactions ?? []).map(mapTx),
  conciliatedTransactions: (r.details_transactions?.conciliated_transactions ?? []).map(mapTx),
})

/**
 * Carrega o detalhe transação-a-transação de um IRD/group_code.
 * Só dispara o fetch quando `enabled=true` (drawer aberto).
 */
export function useInterchangeDetail(consolidationId: string | null, enabled = true) {
  const [data, setData] = useState<InterchangeDetailData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !consolidationId) {
      setData(null); setError(null); setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchAcquirerMismatchByConsolidationId(consolidationId)
      .then(res => { if (!cancelled) setData(mapResponse(res)) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [consolidationId, enabled])

  return { data, loading, error }
}
