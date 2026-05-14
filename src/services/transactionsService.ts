/**
 * Transactions Service — sumários de transação.
 * URL:
 *   GET /v1/transactions/summaries
 *   GET /v1/transactions/summaries/{id}
 *
 * Em mock, retorna fixture vazia/básica (telas atuais usam outros mocks de dashboard).
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  TupiListParams,
  TupiPaginatedResponse,
  TupiTransactionSummary,
} from './types/tupi.types'

const BASE = '/v1/transactions/summaries'

export async function listTransactionSummaries(params?: TupiListParams): Promise<TupiTransactionSummary[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  const res = await request<TupiPaginatedResponse<TupiTransactionSummary>>(BASE, {
    params: params as Record<string, string | number | boolean | undefined>,
  })
  return res.data
}

export async function getTransactionSummary(id: string): Promise<TupiTransactionSummary | null> {
  if (apiMode === 'mock') {
    await mockDelay()
    return null
  }
  return request<TupiTransactionSummary>(`${BASE}/${id}`)
}
