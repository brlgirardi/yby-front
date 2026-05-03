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

/** View model normalizado para a UI (camelCase + dados derivados). */
export interface BrandData {
  id: string
  useConfigId: string
  consolidationId: string
  name: string
  conciliationRate: number
  status?: string
  transactions: {
    sourceA: number
    sourceB: number
  }
  tpv: {
    sourceA: number
    sourceB: number
  }
  itc: {
    sourceA: number
    sourceB: number
  }
}
