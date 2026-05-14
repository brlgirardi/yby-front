/**
 * Organization Service — integração com API pública Tupi.
 * URL Base: https://yby-dev.positivolabs.com.br/v1
 *
 * Endpoints:
 *   POST   /v1/merchants                                cria EC com address + bankAccounts + contact + contactPerson
 *   GET    /v1/merchants                                lista (cursor/limit/order_by/order)
 *   GET    /v1/merchants/{id}                           detalhe
 *   PUT    /v1/merchants/{id}                           update parcial (dbaName/corporateName/taxId/address/contact)
 *   POST   /v1/merchants/{id}/verification-codes        gera códigos pra ativação de equipamentos
 *
 * Em mock, persiste em MERCHANT_ONBOARDING_RECORDS (memória).
 * Em real, faz fetch + mapeia DTO Tupi (camelCase) → MerchantOnboardingRecord do front.
 */

import { apiMode, mockDelay, request } from './apiClient'
import {
  MERCHANT_ONBOARDING_RECORDS,
  type MerchantOnboardingRecord,
} from '@/mocks/sub/merchant-onboarding'
import type { MerchantFormData } from '@/features/subadquirente/v1/MerchantOnboarding/types'
import type {
  TupiCreateMerchantRequest,
  TupiMerchant,
  TupiPaginatedResponse,
  TupiListParams,
  TupiUpdateMerchantRequest,
  TupiVerificationCodeRequest,
  TupiVerificationCodesResponse,
} from './types/tupi.types'

const BASE = '/v1/merchants'

/* ─── Mappers MerchantFormData ↔ Tupi DTO ─────────────────────────────── */

function toCreateRequest(form: MerchantFormData): TupiCreateMerchantRequest {
  return {
    dbaName: form.razaoSocial,
    corporateName: form.razaoSocial,
    taxId: form.cnpj.replace(/\D/g, ''),
    merchantCategoryCode: form.mcc,
    address: {
      postalCode: form.cep.replace(/\D/g, ''),
      state: form.estado,
      city: form.cidade,
      neighborhood: '',
      street: form.endereco,
      number: form.numero,
      complement: form.complemento || undefined,
      country: 'BR',
    },
  }
}

function toUpdateRequest(form: Partial<MerchantFormData>): TupiUpdateMerchantRequest {
  const out: TupiUpdateMerchantRequest = {}
  if (form.razaoSocial !== undefined) {
    out.dbaName = form.razaoSocial
    out.corporateName = form.razaoSocial
  }
  if (form.cnpj !== undefined) out.taxId = form.cnpj.replace(/\D/g, '')
  if (
    form.cep !== undefined ||
    form.estado !== undefined ||
    form.cidade !== undefined ||
    form.endereco !== undefined ||
    form.numero !== undefined ||
    form.complemento !== undefined
  ) {
    out.address = {
      postalCode: (form.cep ?? '').replace(/\D/g, ''),
      state: form.estado ?? '',
      city: form.cidade ?? '',
      neighborhood: '',
      street: form.endereco ?? '',
      number: form.numero ?? '',
      complement: form.complemento || undefined,
      country: 'BR',
    }
  }
  return out
}

function fromTupiMerchant(m: TupiMerchant): MerchantOnboardingRecord {
  return {
    id: m.id,
    semCnpj: false,
    cnpj: m.taxId ?? '',
    razaoSocial: m.corporateName ?? m.dbaName ?? '',
    mcc: m.merchantCategoryCode ?? '',
    cep: m.address?.postalCode ?? '',
    estado: m.address?.state ?? '',
    cidade: m.address?.city ?? '',
    endereco: m.address?.street ?? '',
    numero: m.address?.number ?? '',
    complemento: m.address?.complement ?? '',
    // canais e terminais não vêm no /v1/merchants — preenchidos via providers/credentials e /v1/terminals.
    canais: { cp: { enabled: true, adquirentes: [] }, cnp: { enabled: true, adquirentes: [] } },
    terminais: { cp: [], cnp: [] },
  }
}

/* ─── API ──────────────────────────────────────────────────────────────── */

export async function createMerchant(form: MerchantFormData): Promise<MerchantOnboardingRecord> {
  if (apiMode === 'mock') {
    await mockDelay(600)
    const id = `MCH-${String(Object.keys(MERCHANT_ONBOARDING_RECORDS).length + 1).padStart(3, '0')}`
    const record = { ...fromTupiMerchant({ id } as TupiMerchant), ...form, id } as MerchantOnboardingRecord
    MERCHANT_ONBOARDING_RECORDS[id] = record
    return record
  }
  const m = await request<TupiMerchant>(BASE, {
    method: 'POST',
    data: toCreateRequest(form),
    allowWriteInReadOnly: true,
  })
  return fromTupiMerchant(m)
}

export async function listMerchants(params?: TupiListParams): Promise<MerchantOnboardingRecord[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return Object.values(MERCHANT_ONBOARDING_RECORDS)
  }
  const res = await request<TupiPaginatedResponse<TupiMerchant>>(BASE, {
    params: params as Record<string, string | number | boolean | undefined>,
  })
  return res.data.map(fromTupiMerchant)
}

export async function getMerchant(id: string): Promise<MerchantOnboardingRecord | null> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MERCHANT_ONBOARDING_RECORDS[id] ?? null
  }
  const m = await request<TupiMerchant>(`${BASE}/${id}`)
  return fromTupiMerchant(m)
}

export async function updateMerchant(
  id: string,
  patch: Partial<MerchantFormData>,
): Promise<MerchantOnboardingRecord> {
  if (apiMode === 'mock') {
    await mockDelay(400)
    const existing = MERCHANT_ONBOARDING_RECORDS[id]
    if (!existing) throw new Error(`Merchant ${id} não encontrado`)
    const updated = { ...existing, ...patch } as MerchantOnboardingRecord
    MERCHANT_ONBOARDING_RECORDS[id] = updated
    return updated
  }
  const m = await request<TupiMerchant>(`${BASE}/${id}`, {
    method: 'PUT',
    data: toUpdateRequest(patch),
    allowWriteInReadOnly: true,
  })
  return fromTupiMerchant(m)
}

export async function generateVerificationCodes(
  merchantId: string,
  body: TupiVerificationCodeRequest,
): Promise<TupiVerificationCodesResponse> {
  if (apiMode === 'mock') {
    await mockDelay(300)
    return {
      data: Array.from({ length: body.numberOfCodes }, (_, i) => ({
        code: `MOCK${(100000 + i).toString()}`,
        expiresAt: body.expiresAt ?? new Date(Date.now() + 24 * 3600_000).toISOString(),
      })),
    }
  }
  return request<TupiVerificationCodesResponse>(
    `${BASE}/${merchantId}/verification-codes`,
    { method: 'POST', data: body, allowWriteInReadOnly: true },
  )
}
