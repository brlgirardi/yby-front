/**
 * Service de conciliação por adquirente — espelhado do yby-ui Tupi.
 *
 * Endpoints reais (yby-ui usa BASE_API_URL/yby-reconciliation):
 *   GET /public/report/recon/acquirer/summary/capture-outgoing?consolidation_date_eq=YYYY-MM-DD
 *   GET /public/report/recon/acquirer/mismatch/capture-outgoing?use_config_id_eq=...&consolidation_date_eq=...
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  AcquirerSummary,
  AcquirerSummaryResponse,
  BrandData,
} from './types/acquirerSummary.types'
import type { AcquirerMismatchCaptureOutgoingResponse } from './types/brandDetail.types'

const MOCK_DATE = '2026-04-24'

const MOCK_SUMMARY: AcquirerSummary[] = [
  {
    use_config_id: 'cfg_visa_credit',
    consolidation_id: 'cons_001',
    date: MOCK_DATE,
    metadata: {
      brand: 'visa',
      source_a: { transaction_count: 1240, tpv: 285430.50, itc: 5708.61 },
      source_b: { transaction_count: 1240, tpv: 285430.50, itc: 5708.61 },
    },
    status: 'reconciled',
  },
  {
    use_config_id: 'cfg_mastercard_credit',
    consolidation_id: 'cons_002',
    date: MOCK_DATE,
    metadata: {
      brand: 'mastercard',
      source_a: { transaction_count: 892, tpv: 198320.00, itc: 4561.36 },
      source_b: { transaction_count: 884, tpv: 197850.00, itc: 4549.55 },
    },
    status: 'mismatch',
  },
  {
    use_config_id: 'cfg_elo_debit',
    consolidation_id: 'cons_003',
    date: MOCK_DATE,
    metadata: {
      brand: 'elo',
      source_a: { transaction_count: 412, tpv: 76420.00, itc: 916.72 },
      source_b: { transaction_count: 410, tpv: 76200.00, itc: 914.40 },
    },
    status: 'partially_reconciled',
  },
  {
    use_config_id: 'cfg_amex_credit',
    consolidation_id: 'cons_004',
    date: MOCK_DATE,
    metadata: {
      brand: 'amex',
      source_a: { transaction_count: 124, tpv: 42180.00, itc: 1265.40 },
      source_b: { transaction_count: 124, tpv: 42180.00, itc: 1265.40 },
    },
    status: 'reconciled',
  },
]

const MOCK_MISMATCH: AcquirerMismatchCaptureOutgoingResponse = {
  has_reconciliation: true,
  summary: MOCK_SUMMARY[1], // mastercard mismatch
  divergent_transactions: [
    [
      {
        type: 'capture',
        data: [
          { amount: '450.00', bin: '516292', calculated_ird: 'A', calculated_itc: '9.00',  outgoing_ird: '<nil>', terminal_id: 'POS-A-9821', transaction_date: '2026-04-24T10:14:00Z' },
          { amount: '120.50', bin: '516292', calculated_ird: 'A', calculated_itc: '2.41',  outgoing_ird: '<nil>', terminal_id: 'POS-A-9821', transaction_date: '2026-04-24T11:02:00Z' },
        ],
      },
      {
        type: 'outgoing',
        data: [
          { amount: '450.00', bin: '516292', calculated_ird: '<nil>', calculated_itc: '<nil>', outgoing_ird: 'B', terminal_id: 'POS-A-9821', transaction_date: '2026-04-24T10:14:00Z' },
          { amount: '95.00',  bin: '545001', calculated_ird: '<nil>', calculated_itc: '<nil>', outgoing_ird: 'A', terminal_id: 'POS-B-1130', transaction_date: '2026-04-24T15:48:00Z' },
        ],
      },
    ],
  ],
}

/**
 * Normaliza AcquirerSummary (snake_case Tupi) → BrandData (camelCase para UI).
 */
export function summaryToBrandData(s: AcquirerSummary): BrandData {
  const a = s.metadata.source_a
  const b = s.metadata.source_b
  const totalA = a.tpv || 0
  const totalB = b.tpv || 0
  const denom = Math.max(totalA, totalB) || 1
  const matched = Math.min(totalA, totalB)
  const rate = (matched / denom) * 100

  return {
    id: `${s.consolidation_id}_${s.use_config_id}`,
    useConfigId: s.use_config_id,
    consolidationId: s.consolidation_id,
    name: s.metadata.brand,
    conciliationRate: Number.isFinite(rate) ? rate : 0,
    status: s.status,
    transactions: { sourceA: a.transaction_count, sourceB: b.transaction_count },
    tpv: { sourceA: a.tpv, sourceB: b.tpv },
    itc: { sourceA: a.itc, sourceB: b.itc },
  }
}

export async function fetchAcquirerSummary(date: string): Promise<AcquirerSummaryResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_SUMMARY.map(s => ({ ...s, date }))
  }
  return request<AcquirerSummaryResponse>('/public/report/recon/acquirer/summary/capture-outgoing', {
    params: { consolidation_date_eq: date },
  })
}

export async function fetchAcquirerMismatch(
  date: string,
  useConfigId: string,
): Promise<AcquirerMismatchCaptureOutgoingResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    void useConfigId // mock ignora o filtro por enquanto
    return MOCK_MISMATCH
  }
  return request<AcquirerMismatchCaptureOutgoingResponse>(
    '/public/report/recon/acquirer/mismatch/capture-outgoing',
    { params: { consolidation_date_eq: date, use_config_id_eq: useConfigId } },
  )
}
