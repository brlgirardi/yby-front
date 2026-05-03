'use client'

import { useState } from 'react'
import type { InterchangeRateFilters } from '@/services/types/interchangeRate.types'

export const DEFAULT_FILTERS: InterchangeRateFilters = {
  searchTerm: '',
  cardBrand: 'Todas as bandeiras',
  cardProduct: 'Todos os produtos',
  personType: 'Todos os tipos',
  cardEntry: 'Todas as entradas',
  sector: 'Todos os segmentos',
}

export const CARD_BRANDS_OPTIONS = [
  { label: 'Todas as bandeiras', value: 'Todas as bandeiras' },
  { label: 'Mastercard', value: 'Mastercard' },
  { label: 'Visa', value: 'Visa' },
  { label: 'Elo', value: 'Elo' },
  { label: 'American Express', value: 'American Express' },
]

export const TYPE_OPTIONS = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Doméstico', value: 'Doméstico' },
  { label: 'Internacional', value: 'Internacional' },
]

export const PJ_PF_OPTIONS = [
  { label: 'Todos os tipos', value: 'Todos os tipos' },
  { label: 'PF', value: 'PF' },
  { label: 'PJ', value: 'PJ' },
]

export const CARD_PRODUCTS_OPTIONS = [
  { label: 'Todos os produtos', value: 'Todos os produtos' },
  { label: 'Crédito', value: 'Crédito' },
  { label: 'Débito', value: 'Débito' },
  { label: 'Pré-pago', value: 'Pré-pago' },
]

export const CARD_ENTRY_OPTIONS = [
  { label: 'Todas as entradas', value: 'Todas as entradas' },
  { label: 'Chip', value: 'Chip' },
  { label: 'Contactless', value: 'Contactless' },
  { label: 'Magnético', value: 'Magnético' },
]

export const SECTOR_OPTIONS = [
  { label: 'Todos os segmentos', value: 'Todos os segmentos' },
  { label: 'E-commerce', value: 'E-commerce' },
  { label: 'Corporativo', value: 'Corporativo' },
  { label: 'Governo', value: 'Governo' },
]

export function useInterchangeRateFilters(initial: Partial<InterchangeRateFilters> = {}) {
  const [filters, setFilters] = useState<InterchangeRateFilters>({ ...DEFAULT_FILTERS, ...initial })

  return {
    filters,
    setSearchTerm: (searchTerm: string) => setFilters(f => ({ ...f, searchTerm })),
    setCardBrand: (cardBrand: string) => setFilters(f => ({ ...f, cardBrand })),
    setCardProduct: (cardProduct: string) => setFilters(f => ({ ...f, cardProduct })),
    setPersonType: (personType: string) => setFilters(f => ({ ...f, personType })),
    setCardEntry: (cardEntry: string) => setFilters(f => ({ ...f, cardEntry })),
    setSector: (sector: string) => setFilters(f => ({ ...f, sector })),
    resetFilters: () => setFilters(DEFAULT_FILTERS),
  }
}
