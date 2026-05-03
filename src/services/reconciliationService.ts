import { apiMode, mockDelay, request } from './apiClient'
import type {
  ReconciliationByGroupCodeResponse,
  ReconciliationMismatchArnsResponse,
  ReconciliationSummaryResponse,
} from './types/reconciliation.types'

const MOCK_SUMMARY: ReconciliationSummaryResponse = [
  { id: 'rec_001', date: '2026-04-24', status: 'reconciled', metadata: { brand: ['visa', 'mastercard'], totalAmount: 287420.55 } },
  { id: 'rec_002', date: '2026-04-23', status: 'mismatch',   metadata: { brand: ['elo', 'visa'],        totalAmount: 142308.10 } },
  { id: 'rec_003', date: '2026-04-22', status: 'reconciled', metadata: { brand: ['mastercard'],         totalAmount:  98602.00 } },
  { id: 'rec_004', date: '2026-04-21', status: 'reconciled', metadata: { brand: ['visa', 'elo'],        totalAmount: 211004.85 } },
  { id: 'rec_005', date: '2026-04-20', status: 'mismatch',   metadata: { brand: ['hipercard'],          totalAmount:  18302.00 } },
]

const MOCK_BY_GROUP: ReconciliationByGroupCodeResponse = [
  {
    use_config_id: 'cfg_visa_credit',
    name: 'Visa — Crédito',
    groups: [
      { consolidation_id: 'rec_002', group_code: 'VC-001', transaction_count_source_a: 412, transaction_count_source_b: 410, itc_source_a: 0.018, itc_source_b: 0.018, amount_source_a: 88420.10, amount_source_b: 88200.00, brand_amount_source_a: 88420.10, brand_amount_source_b: 88200.00, consolidation_rate: '99.51%' },
      { consolidation_id: 'rec_002', group_code: 'VC-002', transaction_count_source_a:  98, transaction_count_source_b:  98, itc_source_a: 0.022, itc_source_b: 0.022, amount_source_a: 21300.00, amount_source_b: 21300.00, brand_amount_source_a: 21300.00, brand_amount_source_b: 21300.00, consolidation_rate: '100.00%' },
    ],
  },
  {
    use_config_id: 'cfg_elo_debit',
    name: 'Elo — Débito',
    groups: [
      { consolidation_id: 'rec_002', group_code: 'ED-001', transaction_count_source_a: 132, transaction_count_source_b: 130, itc_source_a: 0.012, itc_source_b: 0.012, amount_source_a: 32588.00, amount_source_b: 32588.00, brand_amount_source_a: 32588.00, brand_amount_source_b: 32588.00, consolidation_rate: '98.48%' },
    ],
  },
]

const MOCK_MISMATCH: ReconciliationMismatchArnsResponse = [
  '24015024110700123456789',
  '24015024110700123456790',
  '24015024110700123456791',
]

export async function fetchReconciliationSummary(): Promise<ReconciliationSummaryResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_SUMMARY
  }
  return request<ReconciliationSummaryResponse>('/report/recon-summary', {
    params: { order_by: 'consolidation_date', order: 'DESC' },
  })
}

export async function fetchReconciliationByGroupCode(date: string): Promise<ReconciliationByGroupCodeResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_BY_GROUP
  }
  return request<ReconciliationByGroupCodeResponse>('/report/recon-incoming-outgoing-by-group-code', {
    params: { consolidation_date_eq: date },
  })
}

export async function fetchReconciliationMismatch(consolidationId: string): Promise<ReconciliationMismatchArnsResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_MISMATCH
  }
  return request<ReconciliationMismatchArnsResponse>(`/report/recon-mismatch/${consolidationId}`)
}
