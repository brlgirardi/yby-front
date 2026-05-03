/**
 * Detalhe de transações divergentes (mismatch) — espelhado de yby-ui Tupi.
 * Endpoint: /public/report/recon/acquirer/mismatch/capture-outgoing
 */

import type { AcquirerSummary } from './acquirerSummary.types'

export interface DivergentTransactionData {
  amount: string
  bin: string
  calculated_ird: string
  calculated_itc: string
  outgoing_ird: string
  terminal_id: string
  transaction_date: string
}

export interface DivergentTransactionPairItem {
  type: 'capture' | 'outgoing'
  data: DivergentTransactionData[]
}

export type DivergentTransactionPair = [DivergentTransactionPairItem, DivergentTransactionPairItem]

export interface AcquirerMismatchCaptureOutgoingResponse {
  has_reconciliation: boolean
  divergent_transactions: DivergentTransactionPair[]
  summary: AcquirerSummary | null
}

/** View model exibido no detalhe — uma linha = uma transação divergente. */
export interface DivergentTransactionView {
  nsu?: string
  terminalId?: string
  amount: string
  calculatedItc: string
  transactionDate?: string
  bin?: string
  /** IRD calculado (capture) — código de classificação da bandeira */
  captureIrd: string | null
  /** IRD efetivo (outgoing) — o que veio da registradora */
  outgoingIrd: string | null
}

/* ─── Endpoint /public/report/recon/acquirer/incoming-outgoing-by-group-code ── */

export interface AcquirerIncomingOutgoingGroup {
  consolidation_id: string
  group_code: string
  metadata: {
    source_a: { transaction_count: number; tpv: number; itc: number }
    source_b: { transaction_count: number; tpv: number; itc: number }
    brand: string
  }
}

export interface AcquirerIncomingOutgoingByGroupCodeItem {
  id: string
  date: string
  groups: AcquirerIncomingOutgoingGroup[]
}

export type AcquirerIncomingOutgoingByGroupCodeResponse =
  AcquirerIncomingOutgoingByGroupCodeItem[]

/**
 * View model — registro de uma combinação IRD (group_code) por bandeira.
 * Tupi: cada IRD = código de classificação Visa/MC que define a faixa de taxa.
 * O conciliation rate é 100% se source_a === source_b nos 3 atributos.
 */
export interface InterchangeRecord {
  consolidationId: string
  /** Group code = IRD (Interchange Reimbursement Data code). */
  interchangeCode: string
  conciliationRate: number
  transactions: { sourceA: number; sourceB: number }
  tpv:          { sourceA: number; sourceB: number }
  /** Tupi chama de "discounts" no front; é o ITC (custo de intercâmbio). */
  discounts:    { sourceA: number; sourceB: number }
}

/* ─── Endpoint /public/report/recon/acquirer/mismatch/{consolidationId} ── */

export interface MismatchTransactionAPI {
  nsu?: string
  terminal_id?: string
  amount: string
  calculated_itc: string
  outgoing_ird?: string | null
  calculated_ird?: string | null
}

export interface MismatchSourceSummaryAPI {
  transaction_count: number
  tpv: number
  itc: number
}

export interface MismatchDetailsTransactionsApi {
  divergent_transactions: MismatchTransactionAPI[]
  conciliated_transactions: MismatchTransactionAPI[]
}

export interface AcquirerMismatchResponse {
  group_code: string
  source_a: MismatchSourceSummaryAPI
  source_b: MismatchSourceSummaryAPI
  consolidation_rate: string
  details_transactions: MismatchDetailsTransactionsApi
}

/** View model do drawer de detalhe (transações por IRD). */
export interface MismatchSourceSummary {
  transactionCount: number
  tpv: number
  itc: number
}

export interface TransactionDetail {
  nsu?: string
  terminalId?: string
  amount: number
  calculatedItc: number
  transactionDate?: string
}

export interface InterchangeDetailData {
  groupCode: string
  sourceA: MismatchSourceSummary
  sourceB: MismatchSourceSummary
  consolidationRate: number
  nonConciliatedTransactions: TransactionDetail[]
  conciliatedTransactions: TransactionDetail[]
}
