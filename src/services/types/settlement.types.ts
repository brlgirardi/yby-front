export interface DecimalValue {
  amount: number
  scale: number
}

export interface Account {
  ID?: string
  ISPB: string
  Bank: string
  Branch: string
  Number: string
  Digit?: string
  AccountType: 'CACC' | 'SVGS' | 'SLRY' | string
}

export type SettlementStatus = 'pending' | 'processed' | 'rejected' | string

export interface Settlement {
  id: string
  destination?: string
  messageId: string
  operationId: string
  operationType: 'Credit' | 'Debit' | string
  settlementDate: string
  movementDate: string
  ispbPayer: string
  ispbReceiver: string
  originAgent: string
  destinationAgent: string
  instrumentType: string
  paymentArrangement: string
  originalValue: DecimalValue
  netValue: DecimalValue
  feeValue?: DecimalValue
  currency: string
  chamber: string
  settlementCode: string
  priority: string
  payerAccount?: Account | null
  receiverAccount?: Account | null
  status: SettlementStatus
  errorCode?: string | null
  errorMessage?: string | null
  queueSource?: string | null
  queueReceivedAt?: string | null
  queueProcessedAt?: string | null
  processingDate?: string | null
  createdAt?: string
}

export interface SettlementFile {
  id: string
  queueMessageId?: string
  queueSource?: string
  queueReceivedAt?: string | null
  queueProcessedAt?: string | null
  queueRetryCount?: number
  queueErrorMessage?: string
  createdAt?: string
}

export interface SettlementListParams {
  page?: number
  limit?: number
  status?: string
  date?: string
}

export interface ImportResult {
  total: number
  success: number
  failed: number
  errors?: Array<{ row: number; message: string }>
}
