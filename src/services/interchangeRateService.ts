import { apiMode, mockDelay, request } from './apiClient'
import type {
  InterchangeRateBrandSummary,
  InterchangeRateRecord,
} from './types/interchangeRate.types'

const MOCK_BRANDS: InterchangeRateBrandSummary[] = [
  { id: '1', brand: 'Mastercard',       configs: 12, updatedAt: '15/01/2026' },
  { id: '2', brand: 'Visa',             configs: 13, updatedAt: '14/01/2026' },
  { id: '3', brand: 'Elo',              configs: 11, updatedAt: '13/01/2026' },
  { id: '4', brand: 'American Express', configs: 10, updatedAt: '10/01/2026' },
]

const MOCK_RECORDS: InterchangeRateRecord[] = [
  // Visa — Crédito
  { id: 'ir_001', cardBrand: 'Visa',       type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 1.45, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_002', cardBrand: 'Visa',       type: 'Doméstico',     cardTier: 'Premium',   personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 1.85, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_003', cardBrand: 'Visa',       type: 'Doméstico',     cardTier: 'Corporate', personType: 'PJ', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'Corporativo',  rate: 2.20, fixedFee: 0.15, effectiveDate: '2026-01-01' },
  { id: 'ir_004', cardBrand: 'Visa',       type: 'Internacional', cardTier: 'Standard',  personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 2.10, fixedFee: 0.20, effectiveDate: '2026-01-01' },
  // Visa — Débito
  { id: 'ir_005', cardBrand: 'Visa',       type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Débito',   cardEntry: 'Contactless', sector: 'E-commerce',   rate: 0.50, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_006', cardBrand: 'Visa',       type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Débito',   cardEntry: 'Magnético',   sector: 'E-commerce',   rate: 0.55, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  // Mastercard — Crédito
  { id: 'ir_007', cardBrand: 'Mastercard', type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 1.50, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_008', cardBrand: 'Mastercard', type: 'Doméstico',     cardTier: 'Premium',   personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 1.95, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_009', cardBrand: 'Mastercard', type: 'Internacional', cardTier: 'Premium',   personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 2.30, fixedFee: 0.20, effectiveDate: '2026-01-01' },
  { id: 'ir_010', cardBrand: 'Mastercard', type: 'Doméstico',     cardTier: 'Corporate', personType: 'PJ', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'Corporativo',  rate: 2.40, fixedFee: 0.15, effectiveDate: '2026-01-01' },
  // Elo
  { id: 'ir_011', cardBrand: 'Elo',        type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 1.30, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  { id: 'ir_012', cardBrand: 'Elo',        type: 'Doméstico',     cardTier: 'Standard',  personType: 'PF', cardProduct: 'Débito',   cardEntry: 'Chip',        sector: 'E-commerce',   rate: 0.45, fixedFee: 0.10, effectiveDate: '2026-01-01' },
  // Amex
  { id: 'ir_013', cardBrand: 'American Express', type: 'Doméstico', cardTier: 'Premium', personType: 'PF', cardProduct: 'Crédito',  cardEntry: 'Chip',        sector: 'E-commerce',   rate: 2.95, fixedFee: 0.20, effectiveDate: '2026-01-01' },
  { id: 'ir_014', cardBrand: 'American Express', type: 'Doméstico', cardTier: 'Corporate', personType: 'PJ', cardProduct: 'Crédito', cardEntry: 'Chip',        sector: 'Corporativo',  rate: 3.20, fixedFee: 0.25, effectiveDate: '2026-01-01' },
]

export async function fetchInterchangeRateBrandSummary(): Promise<InterchangeRateBrandSummary[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_BRANDS
  }
  return request<InterchangeRateBrandSummary[]>('/interchange-rate/brands')
}

export async function fetchInterchangeRates(brand?: string): Promise<InterchangeRateRecord[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    if (!brand) return MOCK_RECORDS
    return MOCK_RECORDS.filter(r => r.cardBrand === brand)
  }
  return request<InterchangeRateRecord[]>('/interchange-rate', {
    params: brand ? { card_brand: brand } : undefined,
  })
}
