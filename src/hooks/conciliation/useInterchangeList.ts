'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchAcquirerIncomingOutgoingByGroupCode } from '@/services/acquirerReconciliationService'
import type {
  AcquirerIncomingOutgoingGroup,
  InterchangeRecord,
} from '@/services/types/brandDetail.types'

const isGroupConciliated = (group: AcquirerIncomingOutgoingGroup): boolean => {
  return (
    group.metadata.source_a.transaction_count === group.metadata.source_b.transaction_count &&
    group.metadata.source_a.tpv === group.metadata.source_b.tpv &&
    group.metadata.source_a.itc === group.metadata.source_b.itc
  )
}

const mapGroupToRecord = (group: AcquirerIncomingOutgoingGroup): InterchangeRecord => {
  const conciliated = isGroupConciliated(group)
  return {
    consolidationId: group.consolidation_id,
    interchangeCode: group.group_code,
    conciliationRate: conciliated ? 100 : 0,
    transactions: { sourceA: group.metadata.source_a.transaction_count, sourceB: group.metadata.source_b.transaction_count },
    tpv:          { sourceA: group.metadata.source_a.tpv,             sourceB: group.metadata.source_b.tpv             },
    discounts:    { sourceA: group.metadata.source_a.itc,             sourceB: group.metadata.source_b.itc             },
  }
}

/**
 * Lista de IRDs (group codes) consolidados para uma combinação use_config_id × data.
 * Espelha o `useInterchangeList` do branch LGR-264-recon-acquirer.
 */
export function useInterchangeList(useConfigId: string, date: string) {
  const [groups, setGroups] = useState<AcquirerIncomingOutgoingGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!useConfigId || !date) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchAcquirerIncomingOutgoingByGroupCode(date, useConfigId)
      .then(res => {
        if (cancelled) return
        const flat = res.flatMap(item => item.groups)
        setGroups(flat)
      })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erro') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [useConfigId, date])

  const records = useMemo(() => groups.map(mapGroupToRecord), [groups])

  return { records, loading, error }
}
