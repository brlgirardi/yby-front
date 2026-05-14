/**
 * Terminals Service — POS/Maquininhas.
 * URL:
 *   POST   /v1/terminals               { merchantId, serialNumber }
 *   GET    /v1/terminals               lista
 *   GET    /v1/terminals/{id}          detalhe
 *   PUT    /v1/terminals/{id}          update (serialNumber/enabled)
 *
 * Em mock, retornos vazios — nossos terminais no front hoje vivem dentro do
 * MerchantFormData.terminais (estrutura customizada com vínculos adquirente+TID).
 * Quando virar real, o vínculo adquirente+TID provavelmente migra para `/v1/credentials`
 * (cada Credential tem `terminalIdentifier` em authenticationData).
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  TupiCreateTerminalRequest,
  TupiPaginatedResponse,
  TupiTerminal,
  TupiListParams,
  TupiUpdateTerminalRequest,
} from './types/tupi.types'

const BASE = '/v1/terminals'

export async function createTerminal(body: TupiCreateTerminalRequest): Promise<TupiTerminal> {
  if (apiMode === 'mock') {
    await mockDelay(300)
    return {
      id: `term_${Date.now()}`,
      merchantId: body.merchantId,
      serialNumber: body.serialNumber.toUpperCase(),
      verificationCode: String(Math.floor(100000 + Math.random() * 900000)),
      verificationCodeExpiresAt: new Date(Date.now() + 24 * 3600_000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  return request<TupiTerminal>(BASE, {
    method: 'POST',
    data: body,
    allowWriteInReadOnly: true,
  })
}

export async function listTerminals(params?: TupiListParams): Promise<TupiTerminal[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  const res = await request<TupiPaginatedResponse<TupiTerminal>>(BASE, {
    params: params as Record<string, string | number | boolean | undefined>,
  })
  return res.data
}

export async function getTerminal(id: string): Promise<TupiTerminal | null> {
  if (apiMode === 'mock') {
    await mockDelay()
    return null
  }
  return request<TupiTerminal>(`${BASE}/${id}`)
}

export async function updateTerminal(id: string, body: TupiUpdateTerminalRequest): Promise<TupiTerminal> {
  if (apiMode === 'mock') {
    await mockDelay(200)
    return {
      id,
      merchantId: '',
      serialNumber: body.serialNumber ?? '',
      enabled: body.enabled,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  return request<TupiTerminal>(`${BASE}/${id}`, {
    method: 'PUT',
    data: body,
    allowWriteInReadOnly: true,
  })
}
