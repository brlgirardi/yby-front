/**
 * Organization Service — integração com yby-organization-api.
 *
 * Endpoints reais:
 *   POST /api/onboarding              cria Organization{Type:merchant} + admin user
 *   GET  /api/organizations?type=...  lista (a confirmar)
 *   GET  /api/organizations/{id}      detalhe (a confirmar)
 *   PUT  /api/organizations/{id}      update (a confirmar)
 *   DELETE /api/organizations/{id}    soft-delete (a confirmar)
 *
 * Modelagem backend (referência):
 *   OrganizationData {
 *     Type: 'acquirer'|'subacquirer'|'independent_sales_organization'|'merchant'
 *     TaxID, DBAName, CorporateName, Slug, Enabled,
 *     MerchantCategoryCode, EconomicActivityCode,
 *     IDPOrganizationID, IDPDomain
 *   }
 *   OnboardingRequest { Admin, Company }
 *
 * Em modo mock, persiste em MERCHANT_ONBOARDING_RECORDS (memória) para
 * fluxo create+view+edit funcionar sem backend.
 */

import { apiMode, mockDelay, request } from './apiClient'
import {
  MERCHANT_ONBOARDING_RECORDS,
  type MerchantOnboardingRecord,
} from '@/mocks/sub/merchant-onboarding'
import type { MerchantFormData } from '@/features/subadquirente/v1/MerchantOnboarding/types'

/* ─── Tipos do contrato backend (espelho de yby-organization-api) ───── */

export type OrganizationType =
  | 'acquirer'
  | 'subacquirer'
  | 'independent_sales_organization'
  | 'merchant'

export interface OnboardingAdminData {
  name: string
  email: string
  phone: string
  password: string
  taxId: string
}

export interface OnboardingCompanyData {
  name: string
  taxId: string
  domain?: string
  economicActivityId?: string
  /** Sub-adquirente pai (para criação de merchant). */
  parentId?: string
  type: OrganizationType
}

export interface OnboardingRequest {
  admin: OnboardingAdminData
  company: OnboardingCompanyData
}

export interface OnboardingResponse {
  userId?: string
  organizationId?: string
  idpUserId?: string
  idpOrganizationId?: string
}

/* ─── Mapper: MerchantFormData (Yby Front) → OnboardingRequest (backend) ─ */

function mapMerchantFormToOnboarding(
  form: MerchantFormData,
  ctx: { parentSubacquirerId?: string; admin: OnboardingAdminData },
): OnboardingRequest {
  return {
    admin: ctx.admin,
    company: {
      name: form.razaoSocial,
      taxId: form.cnpj.replace(/\D/g, ''),
      // MCC vai como economicActivityId? Não — economicActivityId é o ID do CNAE
      // separado. Backend tem ambos (MerchantCategoryCode + EconomicActivityCode)
      // mas o OnboardingRequest atual só aceita economicActivityId.
      // → quando virar real, alinhar com backend se MCC entra em update separado.
      type: 'merchant',
      parentId: ctx.parentSubacquirerId,
    },
  }
}

/* ─── API ──────────────────────────────────────────────────────────────── */

/**
 * Cria novo EC (merchant). Em modo mock só simula; em modo real envia
 * POST /api/onboarding para o organization-api.
 *
 * Importante: o payload de criação NÃO cobre todos os campos do
 * MerchantFormData (address, contact, MCC). Esses provavelmente são
 * preenchidos via PUT /api/organizations/{id} pós-onboard ou em endpoints
 * separados. Confirmar com backend antes de plugar em produção.
 */
export async function createMerchant(
  form: MerchantFormData,
  ctx: { parentSubacquirerId?: string; admin: OnboardingAdminData },
): Promise<OnboardingResponse> {
  if (apiMode === 'mock') {
    await mockDelay(600)
    const id = `MCH-${String(Object.keys(MERCHANT_ONBOARDING_RECORDS).length + 1).padStart(3, '0')}`
    return { organizationId: id }
  }
  const payload = mapMerchantFormToOnboarding(form, ctx)
  return request<OnboardingResponse>('/api/onboarding', {
    method: 'POST',
    data: payload,
    allowWriteInReadOnly: true,
  })
}

/**
 * Lista merchants do sub-adquirente logado. Endpoint a confirmar com backend.
 */
export async function listMerchants(params?: { parentId?: string }): Promise<MerchantOnboardingRecord[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return Object.values(MERCHANT_ONBOARDING_RECORDS)
  }
  return request<MerchantOnboardingRecord[]>('/api/organizations', {
    params: { type: 'merchant', ...params },
  })
}

/** Detalhe de merchant por id. */
export async function getMerchant(id: string): Promise<MerchantOnboardingRecord | null> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MERCHANT_ONBOARDING_RECORDS[id] ?? null
  }
  return request<MerchantOnboardingRecord>(`/api/organizations/${id}`)
}

/** Update de merchant (campos editáveis pós-criação). */
export async function updateMerchant(
  id: string,
  patch: Partial<MerchantFormData>,
): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(400)
    const existing = MERCHANT_ONBOARDING_RECORDS[id]
    if (!existing) throw new Error(`Merchant ${id} não encontrado`)
    MERCHANT_ONBOARDING_RECORDS[id] = { ...existing, ...patch } as MerchantOnboardingRecord
    return
  }
  await request<void>(`/api/organizations/${id}`, {
    method: 'PUT',
    data: patch,
    allowWriteInReadOnly: true,
  })
}
