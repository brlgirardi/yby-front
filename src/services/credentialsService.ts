/**
 * Credentials Service — vínculos Merchant ↔ Provider (com MID/TID em authenticationData).
 * URL:
 *   POST /v1/credentials
 *   GET  /v1/credentials
 *
 * Notas:
 * - O contexto CP/CNP do canal não vem hoje no payload público — é inferido pelo
 *   provider associado (ex.: pagseguro=CP, getnet=CNP) ou via additionalData.
 *   Quando backend expor `context` explicitamente, refinar.
 * - `enabled` / `testMode` controlam ativação por credential.
 * - Mock continua usando AdquirenteCanal (id+adquirenteId+mid) do form local.
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  TupiCreateCredentialRequest,
  TupiCredential,
  TupiProviderName,
} from './types/tupi.types'

const BASE = '/v1/credentials'

export interface CreateCredentialInput {
  merchantId: string
  providerId: string
  providerName: TupiProviderName
  mid: string
  tid?: string
  status?: string
}

function toCreateRequest(input: CreateCredentialInput): TupiCreateCredentialRequest {
  return {
    merchantId: input.merchantId,
    providerId: input.providerId,
    providerName: input.providerName,
    status: input.status ?? 'connected',
    authenticationData: {
      merchantIdentifier: input.mid,
      ...(input.tid ? { terminalIdentifier: input.tid } : {}),
    },
  }
}

export async function listCredentials(merchantId?: string): Promise<TupiCredential[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  const all = await request<TupiCredential[]>(BASE)
  return merchantId ? all.filter((c) => c.merchantId === merchantId) : all
}

export async function createCredential(input: CreateCredentialInput): Promise<TupiCredential> {
  if (apiMode === 'mock') {
    await mockDelay(300)
    return {
      id: `cred_${Date.now()}`,
      subacquirerId: 'mock_sub',
      merchantId: input.merchantId,
      providerId: input.providerId,
      authenticationData: { merchantIdentifier: input.mid, terminalIdentifier: input.tid },
      testMode: true,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
  return request<TupiCredential>(BASE, {
    method: 'POST',
    data: toCreateRequest(input),
    allowWriteInReadOnly: true,
  })
}
