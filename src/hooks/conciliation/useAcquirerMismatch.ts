'use client'

import { useEffect, useState } from 'react'
import { fetchAcquirerMismatch } from '@/services/acquirerReconciliationService'
import type { AcquirerMismatchCaptureOutgoingResponse } from '@/services/types/brandDetail.types'

export interface UseAcquirerMismatchResult {
  data: AcquirerMismatchCaptureOutgoingResponse | null
  loading: boolean
  error: string | null
}

export function useAcquirerMismatch(date: string, useConfigId: string): UseAcquirerMismatchResult {
  const [data, setData] = useState<AcquirerMismatchCaptureOutgoingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date || !useConfigId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchAcquirerMismatch(date, useConfigId)
      .then(res => { if (!cancelled) setData(res) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [date, useConfigId])

  return { data, loading, error }
}
