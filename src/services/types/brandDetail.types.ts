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
export interface InterchangeRecord {
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
