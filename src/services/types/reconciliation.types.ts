/**
 * Tipos de Conciliação — espelhados do projeto yby-ui (Tupi).
 * Mantemos os snake_case do backend para evitar perda de info na adaptação.
 */

export interface ReconciliationSummary {
  id: string
  metadata: {
    brand: string[]
    totalAmount: number
  }
  date: string
  status: string
}

export interface ReconciliationGroup {
  consolidation_id: string
  group_code: string
  transaction_count_source_a: number
  transaction_count_source_b: number
  itc_source_a: number
  itc_source_b: number
  amount_source_a: number
  amount_source_b: number
  brand_amount_source_a: number
  brand_amount_source_b: number
  consolidation_rate: string
}

export interface ReconciliationByGroupCode {
  use_config_id: string
  name: string
  groups: ReconciliationGroup[]
}

export type ReconciliationSummaryResponse = ReconciliationSummary[]
export type ReconciliationByGroupCodeResponse = ReconciliationByGroupCode[]
export type ReconciliationMismatchArnsResponse = string[]
