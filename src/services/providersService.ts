/**
 * Providers Service — adquirentes disponíveis (Cielo / Rede / Stone / Getnet / Adiq / PagSeguro).
 * URL: GET /v1/providers
 *
 * Em mock devolve a lista local de ADQUIRENTES de src/mocks/sub/merchant-onboarding.ts.
 */

import { apiMode, mockDelay, request } from './apiClient'
import { ADQUIRENTES } from '@/mocks/sub/merchant-onboarding'
import type { TupiProvider } from './types/tupi.types'

export interface ProviderOption {
  value: string
  label: string
  /** Quando vier do backend, expõe o nome (pagseguro/cielo/...) pra usar em POST /credentials. */
  name?: string
}

export async function getProviders(): Promise<ProviderOption[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return ADQUIRENTES
  }
  const list = await request<TupiProvider[]>('/v1/providers')
  return list.map((p) => ({
    value: p.id,
    label: p.name?.charAt(0).toUpperCase() + (p.name?.slice(1) ?? ''),
    name: p.name,
  }))
}
