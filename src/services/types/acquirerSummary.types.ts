/**
 * Tipos do sumário de conciliação por adquirente — espelhados de yby-ui Tupi.
 *
 * Vocabulário:
 *  - source_a (capture)  → o que foi capturado pelo sub
 *  - source_b (outgoing) → o que saiu/foi liquidado pela registradora
 *  - tpv: Total Payment Volume (volume bruto)
 *  - itc: Interchange Transaction Cost (custo de intercâmbio)
 */

export interface AcquirerStatsByEntryFile {
  transaction_count: number
  tpv: number
  itc: number
  /**
   * Decomposição opcional do total. Quando presente:
   *   transaction_count = reconciled + divergent + pending
   * Se ausente, a UI infere a partir da comparação entre source_a e source_b.
   */
  reconciled_count?: number
  divergent_count?: number
  pending_count?: number
  reconciled_tpv?: number
  divergent_tpv?: number
  pending_tpv?: number
  reconciled_itc?: number
  divergent_itc?: number
  pending_itc?: number
}

export interface AcquirerSummary {
  use_config_id: string
  consolidation_id: string
  date: string
  metadata: {
    source_a: AcquirerStatsByEntryFile
    source_b: AcquirerStatsByEntryFile
    brand: string
  }
  status: string
}

export type AcquirerSummaryResponse = AcquirerSummary | AcquirerSummary[]

/**
 * Decomposição de uma métrica (transações / TPV / ITC) em 3 buckets:
 *   total = reconciled + divergent + pending
 *
 * - reconciled: bateu A com B exato
 * - divergent:  achou par em B mas valor diferente
 * - pending:    está em A mas não tem par em B (arquivo ausente / dado faltando)
 */
export interface MetricBreakdown {
  total: number
  reconciled: number
  divergent: number
  pending: number
}

/** View model normalizado para a UI. */
export interface BrandData {
  id: string
  useConfigId: string
  consolidationId: string
  name: string
  /** % de A que bateu exato com B = reconciled / total. */
  conciliationRate: number
  status?: string
  transactions: MetricBreakdown
  tpv: MetricBreakdown
  itc: MetricBreakdown
}
