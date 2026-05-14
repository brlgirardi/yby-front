'use client'

import { useEffect, useState } from 'react'
import {
  getCostBlueprintTables,
  getCostItems,
  getInstallments,
  getPriceBlueprintTables,
  getPriceItems,
} from '@/services/pricingService'
import { useCurrentMerchantId } from '@/hooks/useCurrentMerchant'
import type {
  CostBlueprintTable, CostItem, Installment, PriceBlueprintTable, PriceItem,
} from '@/services/types/pricing.types'

export interface UsePricingResult {
  installments: Installment[]
  costTables: CostBlueprintTable[]
  costItems: CostItem[]
  priceTables: PriceBlueprintTable[]
  priceItems: PriceItem[]
  loading: boolean
  error: string | null
}

/**
 * Carrega tudo do módulo Pricing em paralelo. Read-only.
 */
export function usePricingData(): UsePricingResult {
  const merchantId = useCurrentMerchantId()
  const [installments, setInstallments] = useState<Installment[]>([])
  const [costTables, setCostTables] = useState<CostBlueprintTable[]>([])
  const [costItems, setCostItems] = useState<CostItem[]>([])
  const [priceTables, setPriceTables] = useState<PriceBlueprintTable[]>([])
  const [priceItems, setPriceItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      getInstallments(),
      getCostBlueprintTables({ merchant_id: merchantId }),
      getCostItems({ merchant_id: merchantId }),
      getPriceBlueprintTables({ merchant_id: merchantId }),
      getPriceItems(),
    ])
      .then(([insts, ctabs, citems, ptabs, pitems]) => {
        if (cancelled) return
        setInstallments(insts)
        setCostTables(ctabs)
        setCostItems(citems)
        setPriceTables(ptabs)
        setPriceItems(pitems)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao carregar pricing')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [merchantId])

  return { installments, costTables, costItems, priceTables, priceItems, loading, error }
}

/**
 * Mapa de display name dos adquirentes (6 reais da API pública /v1/providers).
 * Mantém em sync com ADQUIRENTES de @/mocks/sub/merchant-onboarding e providersService.
 */
export const ACQUIRER_NAMES: Record<string, string> = {
  cielo: 'Cielo',
  rede: 'Rede',
  stone: 'Stone',
  getnet: 'GetNet',
  adiq: 'Adiq',
  pagseguro: 'PagSeguro',
}

export function getAcquirerDisplayName(id: string): string {
  return ACQUIRER_NAMES[id.toLowerCase()] ?? id
}
