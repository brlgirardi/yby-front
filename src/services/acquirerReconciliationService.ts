/**
 * ⚠️ MOCK-ONLY até a API pública Tupi expor endpoints de conciliação por adquirente.
 *
 * Service de conciliação por adquirente — espelhado do yby-ui Tupi.
 *
 * Endpoints reais (yby-ui usa BASE_API_URL/yby-reconciliation):
 *   GET /public/report/recon/acquirer/summary/capture-outgoing?consolidation_date_eq=YYYY-MM-DD
 *   GET /public/report/recon/acquirer/mismatch/capture-outgoing?use_config_id_eq=...&consolidation_date_eq=...
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  AcquirerStatsByEntryFile,
  AcquirerSummary,
  AcquirerSummaryResponse,
  BrandData,
  MetricBreakdown,
} from './types/acquirerSummary.types'
import type {
  AcquirerIncomingOutgoingByGroupCodeResponse,
  AcquirerIncomingOutgoingGroup,
  AcquirerMismatchCaptureOutgoingResponse,
  AcquirerMismatchResponse,
} from './types/brandDetail.types'

const MOCK_DATE = '2026-04-24'

/**
 * MOCK realista — 6 cenários cobrindo todos os estados visuais.
 *
 * Cada source_a traz a decomposição explícita (reconciled_count, divergent_count, pending_count)
 * pra UI mostrar até 3 linhas por métrica:
 *   ✓ reconciled (verde/neutro) · ✗ divergent (vermelho) · ? pending (cinza)
 *
 *   1. Visa       → 100% reconciled                       (verde, 1 linha)
 *   2. Mastercard → MISTO: conciliado + divergente + pendente (amarelo, 3 linhas)
 *   3. Elo        → conciliado + pequena divergência       (amarelo, 2 linhas ✓✗)
 *   4. Amex       → 100% reconciled                       (verde, 1 linha)
 *   5. Hipercard  → tudo pendente (arquivo ausente)        (amarelo, 2 linhas ✓? — ✓ é zero)
 *   6. Cabal      → MISTO grave: pouco bateu, muito divergiu e muito faltou (amarelo, 3 linhas)
 */
const MOCK_SUMMARY: AcquirerSummary[] = [
  {
    use_config_id: 'cfg_visa_credit',
    consolidation_id: 'cons_001',
    date: MOCK_DATE,
    metadata: {
      brand: 'visa',
      source_a: {
        transaction_count: 1240, tpv: 285430.50, itc: 5708.61,
        reconciled_count: 1240, divergent_count: 0,  pending_count: 0,
        reconciled_tpv: 285430.50, divergent_tpv: 0, pending_tpv: 0,
        reconciled_itc: 5708.61,   divergent_itc: 0, pending_itc: 0,
      },
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
      // Total A = 892 / R$ 198.320 — quebra em 800 bateram, 50 divergiram, 42 faltaram.
      source_a: {
        transaction_count: 892, tpv: 198320.00, itc: 4561.36,
        reconciled_count: 800, divergent_count: 50, pending_count: 42,
        reconciled_tpv: 178650.00, divergent_tpv: 11420.00, pending_tpv: 8250.00,
        reconciled_itc: 4108.95,   divergent_itc: 262.66,   pending_itc: 189.75,
      },
      source_b: { transaction_count: 850, tpv: 190070.00, itc: 4371.61 },
    },
    status: 'mismatch',
  },
  {
    use_config_id: 'cfg_elo_debit',
    consolidation_id: 'cons_003',
    date: MOCK_DATE,
    metadata: {
      brand: 'elo',
      // 412 total, 410 bateram, 2 divergiram (arredondamento), 0 pendente.
      source_a: {
        transaction_count: 412, tpv: 76420.00, itc: 916.72,
        reconciled_count: 410, divergent_count: 2, pending_count: 0,
        reconciled_tpv: 76200.00, divergent_tpv: 220.00, pending_tpv: 0,
        reconciled_itc: 914.40,   divergent_itc: 2.32,   pending_itc: 0,
      },
      source_b: { transaction_count: 412, tpv: 76420.00, itc: 916.72 },
    },
    status: 'partially_reconciled',
  },
  {
    use_config_id: 'cfg_amex_credit',
    consolidation_id: 'cons_004',
    date: MOCK_DATE,
    metadata: {
      brand: 'amex',
      source_a: {
        transaction_count: 124, tpv: 42180.00, itc: 1265.40,
        reconciled_count: 124, divergent_count: 0, pending_count: 0,
        reconciled_tpv: 42180.00, divergent_tpv: 0, pending_tpv: 0,
        reconciled_itc: 1265.40,  divergent_itc: 0, pending_itc: 0,
      },
      source_b: { transaction_count: 124, tpv: 42180.00, itc: 1265.40 },
    },
    status: 'reconciled',
  },
  {
    use_config_id: 'cfg_hipercard_credit',
    consolidation_id: 'cons_005',
    date: MOCK_DATE,
    metadata: {
      brand: 'hipercard',
      // 58 transações em A, arquivo B não chegou → tudo pendente.
      source_a: {
        transaction_count: 58, tpv: 9420.00, itc: 188.40,
        reconciled_count: 0, divergent_count: 0, pending_count: 58,
        reconciled_tpv: 0, divergent_tpv: 0, pending_tpv: 9420.00,
        reconciled_itc: 0, divergent_itc: 0, pending_itc: 188.40,
      },
      source_b: { transaction_count: 0, tpv: 0, itc: 0 },
    },
    status: 'not_reconciled',
  },
  {
    use_config_id: 'cfg_cabal_credit',
    consolidation_id: 'cons_006',
    date: MOCK_DATE,
    metadata: {
      brand: 'cabal',
      // 320 total: 150 bateram, 90 divergiram, 80 faltaram. Cenário pior caso.
      source_a: {
        transaction_count: 320, tpv: 58200.00, itc: 1280.40,
        reconciled_count: 150, divergent_count: 90, pending_count: 80,
        reconciled_tpv: 27840.00, divergent_tpv: 15850.00, pending_tpv: 14510.00,
        reconciled_itc: 612.48,   divergent_itc: 348.70,   pending_itc: 319.22,
      },
      source_b: { transaction_count: 240, tpv: 43690.00, itc: 961.18 },
    },
    status: 'mismatch',
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
 * Decompõe uma métrica em 3 buckets a partir do par (source_a, source_b).
 *
 * Quando o backend retorna explicitamente `reconciled_*`/`divergent_*`/`pending_*`,
 * usa esses valores. Caso contrário, infere:
 *   - se A === B  → tudo reconciled
 *   - se B === 0  → tudo pending (arquivo ausente)
 *   - se A === 0  → tudo pending (mesmo cenário, espelhado)
 *   - se A > B    → reconciled = B, pending = A - B
 *   - se A < B    → reconciled = A, divergent = B - A (over-billing do outgoing)
 *
 * É inferência grosseira pra UI funcionar enquanto o backend não decompõe.
 * Quando o backend devolver, basta passar os campos opcionais que esta função
 * passa a preferi-los.
 */
function decomposeMetric(
  aTotal: number,
  bTotal: number,
  reconciled?: number,
  divergent?: number,
  pending?: number,
): MetricBreakdown {
  if (reconciled !== undefined || divergent !== undefined || pending !== undefined) {
    const r = reconciled ?? 0
    const d = divergent ?? 0
    const p = pending ?? 0
    return { total: r + d + p, reconciled: r, divergent: d, pending: p }
  }
  // Inferência: A é a fonte da verdade. Compara com B.
  if (aTotal === bTotal) return { total: aTotal, reconciled: aTotal, divergent: 0, pending: 0 }
  if (bTotal === 0) return { total: aTotal, reconciled: 0, divergent: 0, pending: aTotal }
  if (aTotal === 0) return { total: bTotal, reconciled: 0, divergent: 0, pending: bTotal }
  if (aTotal > bTotal) {
    return { total: aTotal, reconciled: bTotal, divergent: 0, pending: aTotal - bTotal }
  }
  // aTotal < bTotal
  return { total: aTotal, reconciled: aTotal, divergent: bTotal - aTotal, pending: 0 }
}

/**
 * Normaliza AcquirerSummary (snake_case Tupi) → BrandData (camelCase para UI).
 *
 * O modelo da UI decompõe cada métrica (transações, TPV, ITC) em 3 buckets:
 *   total = reconciled + divergent + pending
 *
 * conciliationRate = reconciled / total (em %)
 */
export function summaryToBrandData(s: AcquirerSummary): BrandData {
  const a = s.metadata.source_a
  const b = s.metadata.source_b

  const transactions = decomposeMetric(
    a.transaction_count, b.transaction_count,
    a.reconciled_count, a.divergent_count, a.pending_count,
  )
  const tpv = decomposeMetric(
    a.tpv, b.tpv,
    a.reconciled_tpv, a.divergent_tpv, a.pending_tpv,
  )
  const itc = decomposeMetric(
    a.itc, b.itc,
    a.reconciled_itc, a.divergent_itc, a.pending_itc,
  )

  const rate = tpv.total > 0 ? (tpv.reconciled / tpv.total) * 100 : 0

  return {
    id: `${s.consolidation_id}_${s.use_config_id}`,
    useConfigId: s.use_config_id,
    consolidationId: s.consolidation_id,
    name: s.metadata.brand,
    conciliationRate: Number.isFinite(rate) ? rate : 0,
    status: s.status,
    transactions,
    tpv,
    itc,
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

/* ────────────────────────────────────────────────────────────────────── *
 *  Endpoint Tupi: /public/report/recon/acquirer/incoming-outgoing-by-group-code
 *  Lista os grupos (IRDs) consolidados para o par {use_config_id, date}.
 * ────────────────────────────────────────────────────────────────────── */

const buildGroup = (
  consolidationId: string,
  ird: string,
  brand: string,
  countA: number,
  countB: number,
  tpvA: number,
  tpvB: number,
  itcA: number,
  itcB: number,
): AcquirerIncomingOutgoingGroup => ({
  consolidation_id: consolidationId,
  group_code: ird,
  metadata: {
    brand,
    source_a: { transaction_count: countA, tpv: tpvA, itc: itcA },
    source_b: { transaction_count: countB, tpv: tpvB, itc: itcB },
  },
})

const MOCK_INCOMING_OUTGOING: Record<string, AcquirerIncomingOutgoingGroup[]> = {
  cfg_visa_credit: [
    buildGroup('cons_001_g1', 'A', 'visa',  680, 680, 158420.10, 158420.10, 3168.40, 3168.40),
    buildGroup('cons_001_g2', 'B', 'visa',  410, 410, 102330.00, 102330.00, 2046.60, 2046.60),
    buildGroup('cons_001_g3', 'C', 'visa',  150, 150,  24680.40,  24680.40,  493.61,  493.61),
  ],
  cfg_mastercard_credit: [
    buildGroup('cons_002_g1', 'A', 'mastercard', 612, 608, 138420.00, 137950.00, 3183.66, 3172.85),
    buildGroup('cons_002_g2', 'B', 'mastercard', 198, 198,  44820.00,  44820.00, 1031.86, 1031.86),
    buildGroup('cons_002_g3', 'C', 'mastercard',  82,  78,  15080.00,  15080.00,  346.84,  344.84),
  ],
  cfg_elo_debit: [
    buildGroup('cons_003_g1', 'A', 'elo', 280, 280, 52400.00, 52400.00, 628.80, 628.80),
    buildGroup('cons_003_g2', 'B', 'elo', 132, 130, 24020.00, 23800.00, 287.92, 285.60),
  ],
  cfg_amex_credit: [
    buildGroup('cons_004_g1', 'A', 'amex', 124, 124, 42180.00, 42180.00, 1265.40, 1265.40),
  ],
}

export async function fetchAcquirerIncomingOutgoingByGroupCode(
  date: string,
  useConfigId: string,
): Promise<AcquirerIncomingOutgoingByGroupCodeResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    const groups = MOCK_INCOMING_OUTGOING[useConfigId] ?? []
    return [{ id: `${useConfigId}_${date}`, date, groups }]
  }
  return request<AcquirerIncomingOutgoingByGroupCodeResponse>(
    '/public/report/recon/acquirer/incoming-outgoing-by-group-code',
    { params: { consolidation_date_eq: date, use_config_id_eq: useConfigId } },
  )
}

/* ────────────────────────────────────────────────────────────────────── *
 *  Endpoint Tupi: /public/report/recon/acquirer/mismatch/{consolidationId}
 *  Detalhe transação-a-transação para um IRD específico.
 * ────────────────────────────────────────────────────────────────────── */

const tx = (
  nsu: string,
  terminal: string,
  amount: number,
  itc: number,
): { nsu: string; terminal_id: string; amount: string; calculated_itc: string } => ({
  nsu,
  terminal_id: terminal,
  amount: amount.toFixed(2),
  calculated_itc: itc.toFixed(2),
})

const MOCK_MISMATCH_BY_CONSOLIDATION: Record<string, AcquirerMismatchResponse> = {
  cons_002_g1: {
    group_code: 'A',
    source_a: { transaction_count: 612, tpv: 138420.00, itc: 3183.66 },
    source_b: { transaction_count: 608, tpv: 137950.00, itc: 3172.85 },
    consolidation_rate: '99.34%',
    details_transactions: {
      divergent_transactions: [
        tx('NSU-001241', 'POS-A-9821',  450.00,  10.35),
        tx('NSU-001242', 'POS-A-9821',  120.50,   2.77),
        tx('NSU-001243', 'POS-B-1130',  329.50,   7.58),
        tx('NSU-001244', 'POS-B-1130', 4280.00,  98.44),
      ],
      conciliated_transactions: [
        tx('NSU-001100', 'POS-A-9821',  240.00,   5.52),
        tx('NSU-001101', 'POS-A-9821',  189.50,   4.36),
        tx('NSU-001102', 'POS-A-9821',  670.00,  15.41),
      ],
    },
  },
  cons_002_g3: {
    group_code: 'C',
    source_a: { transaction_count: 82, tpv: 15080.00, itc: 346.84 },
    source_b: { transaction_count: 78, tpv: 15080.00, itc: 344.84 },
    consolidation_rate: '95.12%',
    details_transactions: {
      divergent_transactions: [
        tx('NSU-002001', 'POS-A-9821', 480.00, 11.04),
        tx('NSU-002002', 'POS-A-9821', 210.00,  4.83),
      ],
      conciliated_transactions: [
        tx('NSU-002100', 'POS-A-9821', 320.00, 7.36),
        tx('NSU-002101', 'POS-A-9821', 110.00, 2.53),
      ],
    },
  },
  cons_003_g2: {
    group_code: 'B',
    source_a: { transaction_count: 132, tpv: 24020.00, itc: 287.92 },
    source_b: { transaction_count: 130, tpv: 23800.00, itc: 285.60 },
    consolidation_rate: '98.92%',
    details_transactions: {
      divergent_transactions: [
        tx('NSU-003001', 'POS-A-9821', 140.00, 1.68),
        tx('NSU-003002', 'POS-B-1130',  80.00, 0.96),
      ],
      conciliated_transactions: [
        tx('NSU-003100', 'POS-A-9821', 220.00, 2.64),
      ],
    },
  },
}

export async function fetchAcquirerMismatchByConsolidationId(
  consolidationId: string,
): Promise<AcquirerMismatchResponse> {
  if (apiMode === 'mock') {
    await mockDelay()
    const found = MOCK_MISMATCH_BY_CONSOLIDATION[consolidationId]
    if (found) return found
    // fallback: 100% conciliado, sem divergentes
    return {
      group_code: '—',
      source_a: { transaction_count: 0, tpv: 0, itc: 0 },
      source_b: { transaction_count: 0, tpv: 0, itc: 0 },
      consolidation_rate: '100.00%',
      details_transactions: { divergent_transactions: [], conciliated_transactions: [] },
    }
  }
  return request<AcquirerMismatchResponse>(
    `/public/report/recon/acquirer/mismatch/${consolidationId}`,
  )
}
