'use client'

import { useState } from 'react'

export interface ConciliationFilters {
  searchTerm: string
  statusFilter: string
  brandFilter: string
}

export const DEFAULT_FILTERS: ConciliationFilters = {
  searchTerm: '',
  statusFilter: 'Todos',
  brandFilter: 'Todas',
}

export const STATUS_OPTIONS = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Reconciliado', value: 'reconciled' },
  { label: 'Parc. Conciliado', value: 'partially_reconciled' },
  { label: 'Divergência', value: 'mismatch' },
  { label: 'Não Conciliado', value: 'not_reconciled' },
]

export const BRAND_OPTIONS = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'Elo', value: 'elo' },
  { label: 'American Express', value: 'amex' },
]

/**
 * Hook de filtros de conciliação. Mantém estado local e expõe setters.
 * Espelha `useConciliationFilters` do yby-ui Tupi.
 */
export function useConciliationFilters(initial: Partial<ConciliationFilters> = {}) {
  const [filters, setFilters] = useState<ConciliationFilters>({ ...DEFAULT_FILTERS, ...initial })

  return {
    filters,
    setSearchTerm: (searchTerm: string) => setFilters(f => ({ ...f, searchTerm })),
    setStatusFilter: (statusFilter: string) => setFilters(f => ({ ...f, statusFilter })),
    setBrandFilter: (brandFilter: string) => setFilters(f => ({ ...f, brandFilter })),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
  }
}

/**
 * Aplica os filtros sobre uma lista de BrandData.
 */
export function applyConciliationFilters<T extends { name: string; status?: string }>(
  data: T[],
  filters: ConciliationFilters,
): T[] {
  return data.filter(d => {
    if (filters.searchTerm && !d.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    if (filters.statusFilter !== 'Todos' && d.status !== filters.statusFilter) return false
    if (filters.brandFilter !== 'Todas' && d.name.toLowerCase() !== filters.brandFilter.toLowerCase()) return false
    return true
  })
}
