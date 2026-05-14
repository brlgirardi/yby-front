/**
 * Reference Service — dados de referência (bancos, MCCs, faixas de faturamento, CNAEs).
 *
 * Fonte real: yby-organization-api
 *   GET /api/public/banks
 *   GET /api/public/merchant-categories
 *   GET /api/public/monthly-revenue-ranges
 *   GET /api/admin/economic_activities  (paginado)
 *
 * Em modo mock, devolve as fixtures locais que já existiam em
 * src/mocks/sub/merchant-onboarding.ts (mantém compatibilidade com
 * os AppSelects existentes do Onboarding EC).
 */

import { apiMode, mockDelay, request } from './apiClient'
import {
  BANCOS as MOCK_BANCOS,
  CNAES as MOCK_CNAES,
  FATURAMENTOS as MOCK_FATURAMENTOS,
  MCCS as MOCK_MCCS,
  type Banco,
  type Option,
} from '@/mocks/sub/merchant-onboarding'

/* ─── Tipos backend (organization-api reference data) ──────────────────── */

interface BackendReferenceRecord {
  id?: string
  code?: string
  name?: string
  description?: string
}

interface BankBackend extends BackendReferenceRecord {
  /** Código COMPE. */
  code?: string
  name?: string
}

interface MerchantCategoryBackend extends BackendReferenceRecord {
  /** MCC code. */
  code?: string
  description?: string
}

interface MonthlyRevenueRangeBackend extends BackendReferenceRecord {
  code?: string
  label?: string
}

interface EconomicActivityBackend extends BackendReferenceRecord {
  /** Código CNAE. */
  code?: string
  description?: string
}

/* ─── Helpers de mapeamento backend → Option ──────────────────────────── */

function mapBank(b: BankBackend): Banco {
  return {
    value: b.id ?? b.code ?? '',
    label: b.name ?? b.code ?? '',
    codigo: b.code ?? '',
  }
}

function mapCategory(c: MerchantCategoryBackend): Option {
  return {
    value: c.code ?? c.id ?? '',
    label: c.description ? `${c.code ?? ''} — ${c.description}` : c.code ?? '',
  }
}

function mapRange(r: MonthlyRevenueRangeBackend): Option {
  return {
    value: r.code ?? r.id ?? '',
    label: r.label ?? r.code ?? '',
  }
}

function mapEconomicActivity(e: EconomicActivityBackend): Option {
  return {
    value: e.code ?? e.id ?? '',
    label: e.description ? `${e.code ?? ''} — ${e.description}` : e.code ?? '',
  }
}

/* ─── API ──────────────────────────────────────────────────────────────── */

export async function getBanks(): Promise<Banco[]> {
  if (apiMode === 'mock') {
    await mockDelay(120)
    return MOCK_BANCOS
  }
  const list = await request<BankBackend[]>('/api/public/banks')
  return list.map(mapBank)
}

export async function getMerchantCategories(): Promise<Option[]> {
  if (apiMode === 'mock') {
    await mockDelay(120)
    return MOCK_MCCS
  }
  const list = await request<MerchantCategoryBackend[]>('/api/public/merchant-categories')
  return list.map(mapCategory)
}

export async function getMonthlyRevenueRanges(): Promise<Option[]> {
  if (apiMode === 'mock') {
    await mockDelay(120)
    return MOCK_FATURAMENTOS
  }
  const list = await request<MonthlyRevenueRangeBackend[]>('/api/public/monthly-revenue-ranges')
  return list.map(mapRange)
}

/**
 * CNAEs vêm do endpoint admin paginado. Em DEV o yby-ui usa um cache estático
 * (`/cnae-cache.json`) porque a API só devolve 20 por página. Aqui devolvemos
 * a lista atual da primeira página em modo real — se precisar paginação completa,
 * implementar loop ou trocar pra endpoint público quando disponível.
 */
export async function getEconomicActivities(): Promise<Option[]> {
  if (apiMode === 'mock') {
    await mockDelay(120)
    return MOCK_CNAES
  }
  const list = await request<EconomicActivityBackend[]>('/api/admin/economic_activities', {
    params: { limit: 200 },
  })
  return list.map(mapEconomicActivity)
}
