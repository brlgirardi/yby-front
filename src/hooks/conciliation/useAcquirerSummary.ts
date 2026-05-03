'use client'

import { useEffect, useState } from 'react'
import { fetchAcquirerSummary, summaryToBrandData } from '@/services/acquirerReconciliationService'
import type { AcquirerSummary, BrandData } from '@/services/types/acquirerSummary.types'

export interface UseAcquirerSummaryResult {
  brand: BrandData[]
  raw: AcquirerSummary[]
  loading: boolean
  error: string | null
}

/**
 * Carrega o sumário de conciliação de adquirentes para uma data.
 * Espelha o `useAcquirerSummary` do yby-ui Tupi.
 */
export function useAcquirerSummary(date: string): UseAcquirerSummaryResult {
  const [raw, setRaw] = useState<AcquirerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchAcquirerSummary(date)
      .then(res => {
        if (cancelled) return
        const arr = Array.isArray(res) ? res : [res]
        setRaw(arr)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar conciliação')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [date])

  return {
    raw,
    brand: raw.map(summaryToBrandData),
    loading,
    error,
  }
}
