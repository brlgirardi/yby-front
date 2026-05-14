/**
 * Service de Settlement — integração com yby-bff /public/settlement/*.
 *
 * ⚠️ MOCK-ONLY até a API pública Tupi (https://yby-dev.positivolabs.com.br/v1)
 * expor endpoints de settlement. Os paths abaixo correspondem ao BFF interno
 * mapeado durante a auditoria (rev 1-2), mas a API pública DEV documentada
 * em yby-docs ainda não cobre essa área. Quando backend expuser, ajustar
 * BASE e remover esta nota.
 *
 * Endpoints BFF interno (referência):
 *   GET  /public/settlement?page=&limit=&status=&date=
 *   GET  /public/settlement/{id}
 *   GET  /public/settlement/files?page=&limit=
 *   POST /public/settlement/import  (multipart/form-data)
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  Settlement,
  SettlementFile,
  SettlementListParams,
  ImportResult,
} from './types/settlement.types'

const BASE = '/public/settlement'

const dv = (reais: number) => ({ amount: Math.round(reais * 100), scale: 2 })

const acc = (ispb: string, bank: string, branch: string, number: string, digit: string) =>
  ({ ISPB: ispb, Bank: bank, Branch: branch, Number: number, Digit: digit, AccountType: 'CACC' as const })

const RECEIVER = acc('60701190', 'Itaú Unibanco', '0001', '000004521', '2')
const PAYER    = acc('00000000', 'BCB', '0001', '00000001', '0')

const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'sett_001',
    destination: 'Nuclea',
    messageId: 'ASLC027',
    operationId: 'NULIQ20260501000001',
    operationType: 'Credit',
    settlementDate: '2026-05-01T00:00:00Z',
    movementDate: '2026-05-01T00:00:00Z',
    ispbPayer: '00000000',
    ispbReceiver: '60701190',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'VCC',
    originalValue: dv(48200),
    netValue: dv(46754),
    feeValue: dv(1446),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260501000001',
    priority: 'Normal',
    status: 'processed',
    payerAccount: PAYER,
    receiverAccount: RECEIVER,
    processingDate: '2026-05-01T10:00:00Z',
    createdAt: '2026-05-01T06:00:00Z',
  },
  {
    id: 'sett_002',
    destination: 'Nuclea',
    messageId: 'ASLC027',
    operationId: 'NULIQ20260501000002',
    operationType: 'Credit',
    settlementDate: '2026-05-01T00:00:00Z',
    movementDate: '2026-05-01T00:00:00Z',
    ispbPayer: '00000000',
    ispbReceiver: '60701190',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'MCC',
    originalValue: dv(72100),
    netValue: dv(69937),
    feeValue: dv(2163),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260501000002',
    priority: 'Normal',
    status: 'processed',
    payerAccount: PAYER,
    receiverAccount: RECEIVER,
    processingDate: '2026-05-01T10:05:00Z',
    createdAt: '2026-05-01T06:05:00Z',
  },
  {
    id: 'sett_003',
    destination: 'Nuclea',
    messageId: 'ASLC027',
    operationId: 'NULIQ20260502000001',
    operationType: 'Debit',
    settlementDate: '2026-05-02T00:00:00Z',
    movementDate: '2026-05-02T00:00:00Z',
    ispbPayer: '60701190',
    ispbReceiver: '00000000',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'ECC',
    originalValue: dv(31500),
    netValue: dv(26355),
    feeValue: dv(945),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260502000001',
    priority: 'Normal',
    status: 'processed',
    payerAccount: RECEIVER,
    receiverAccount: PAYER,
    processingDate: '2026-05-02T10:00:00Z',
    createdAt: '2026-05-02T06:00:00Z',
  },
  {
    id: 'sett_004',
    destination: 'Nuclea',
    messageId: 'ASLC027',
    operationId: 'NULIQ20260503000001',
    operationType: 'Credit',
    settlementDate: '2026-05-03T00:00:00Z',
    movementDate: '2026-05-03T00:00:00Z',
    ispbPayer: '00000000',
    ispbReceiver: '60701190',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'VDC',
    originalValue: dv(41620),
    netValue: dv(40371),
    feeValue: dv(1249),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260503000001',
    priority: 'Normal',
    status: 'processed',
    payerAccount: PAYER,
    receiverAccount: RECEIVER,
    processingDate: '2026-05-03T10:00:00Z',
    createdAt: '2026-05-03T06:00:00Z',
  },
  {
    id: 'sett_005',
    destination: 'Nuclea',
    messageId: 'ASLC027',
    operationId: 'NULIQ20260504000001',
    operationType: 'Credit',
    settlementDate: '2026-05-04T00:00:00Z',
    movementDate: '2026-05-04T00:00:00Z',
    ispbPayer: '00000000',
    ispbReceiver: '60701190',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'MCC',
    originalValue: dv(96800),
    netValue: dv(93896),
    feeValue: dv(2904),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260504000001',
    priority: 'Normal',
    status: 'pending',
    payerAccount: PAYER,
    receiverAccount: RECEIVER,
    createdAt: '2026-05-04T06:00:00Z',
  },
  {
    id: 'sett_006',
    destination: 'Nuclea',
    messageId: 'ASLC028',
    operationId: 'NULIQ20260505000001',
    operationType: 'Credit',
    settlementDate: '2026-05-05T00:00:00Z',
    movementDate: '2026-05-05T00:00:00Z',
    ispbPayer: '00000000',
    ispbReceiver: '60701190',
    originAgent: '01027058000191',
    destinationAgent: 'NUCLEA01',
    instrumentType: 'Cartão',
    paymentArrangement: 'ACC',
    originalValue: dv(15300),
    netValue: dv(0),
    feeValue: dv(0),
    currency: '986',
    chamber: 'SLC',
    settlementCode: 'NULIQ20260505000001',
    priority: 'Urgente',
    status: 'rejected',
    payerAccount: PAYER,
    receiverAccount: RECEIVER,
    errorCode: 'AC07',
    errorMessage: 'Conta recebedora encerrada',
    createdAt: '2026-05-05T06:00:00Z',
  },
]

const MOCK_FILES: SettlementFile[] = [
  {
    id: 'file_001',
    queueMessageId: 'msg_a1b2c3d4',
    queueSource: 'sqs',
    queueRetryCount: 0,
    queueErrorMessage: '',
    queueProcessedAt: '2026-05-01T06:10:00Z',
    createdAt: '2026-05-01T06:00:00Z',
  },
  {
    id: 'file_002',
    queueMessageId: 'msg_e5f6g7h8',
    queueSource: 'sqs',
    queueRetryCount: 1,
    queueErrorMessage: '',
    queueProcessedAt: '2026-05-02T06:12:00Z',
    createdAt: '2026-05-02T06:00:00Z',
  },
]

export async function listSettlements(params?: SettlementListParams): Promise<Settlement[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    let data = [...MOCK_SETTLEMENTS]
    if (params?.status) data = data.filter(s => s.status === params.status)
    if (params?.date) data = data.filter(s => s.settlementDate.startsWith(params.date!))
    return data
  }
  return request<Settlement[]>(BASE, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getSettlement(id: string): Promise<Settlement> {
  if (apiMode === 'mock') {
    await mockDelay()
    const found = MOCK_SETTLEMENTS.find(s => s.id === id)
    if (!found) throw new Error(`Settlement ${id} não encontrado`)
    return found
  }
  return request<Settlement>(`${BASE}/${id}`)
}

export async function listSettlementFiles(params?: Pick<SettlementListParams, 'page' | 'limit'>): Promise<SettlementFile[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_FILES
  }
  return request<SettlementFile[]>(`${BASE}/files`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function importSettlementCSV(file: File): Promise<ImportResult> {
  if (apiMode === 'mock') {
    await mockDelay(800)
    return { total: 5, success: 5, failed: 0 }
  }
  const form = new FormData()
  form.append('file', file)
  // upload é write-action mas backend de produção ainda não persiste — liberamos no guard read-only para validar o fluxo de UI.
  return request<ImportResult>(`${BASE}/import`, { method: 'POST', data: form, allowWriteInReadOnly: true })
}

// Helpers genéricos vivem em @/lib/format. Re-exportados aqui para preservar imports legados.
export { formatBRL, decimalToFloat } from '@/lib/format'
