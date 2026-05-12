'use client'

import { useEffect, useState } from 'react'
import { listSettlements } from '@/services/settlementService'
import type { Settlement, SettlementListParams } from '@/services/types/settlement.types'

export interface UseSettlementResult {
  settlements: Settlement[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useSettlementData(params?: SettlementListParams): UseSettlementResult {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    listSettlements(params)
      .then(data => { if (!cancelled) setSettlements(data) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar liquidações') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, params?.status, params?.date, params?.page, params?.limit])

  return { settlements, loading, error, reload: () => setTick(t => t + 1) }
}
