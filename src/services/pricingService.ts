/**
 * Service de Pricing (Custos + Preços) — espelhado do branch feat/pricing do yby-ui Tupi.
 *
 * Endpoints reais (BFF /bff-pricing-economics → /pricing/...):
 *   GET /pricing/installments
 *   GET /pricing/cost-items?acquirer_id=...
 *   GET /pricing/cost-blueprint-tables?merchant_id=...
 *   GET /pricing/cost-blueprint-items?cost_blueprint_table_id=...
 *   GET /pricing/price-items?cost_items_id=...
 *   GET /pricing/price-blueprint-tables?merchant_id=...
 *   POST /pricing/price-preview { cost_item_id, margin }
 */

import { apiMode, mockDelay, request } from './apiClient'
import type {
  CostBlueprintItem,
  CostBlueprintTable,
  CostItem,
  Installment,
  PriceBlueprintItem,
  PriceBlueprintTable,
  PriceItem,
  PricePreviewRequest,
  PricePreviewResponse,
} from './types/pricing.types'

const BASE = '/pricing'

/* ────────────────────────────────────────────────────────────────────── *
 * MOCK DATA — refletindo um sub-adquirente Tupi com 2 adquirentes (Adiq, GetNet)
 *             em 2 canais (CP, CNP) com tabela de custos e preços ativa.
 * ────────────────────────────────────────────────────────────────────── */

const NOW = '2026-04-24T12:00:00Z'
const MERCHANT_ID = 'merchant_yby_demo'

const MOCK_INSTALLMENTS: Installment[] = [
  { id: 'inst_1',     from: 1,  to: 1,  acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'inst_2_6',   from: 2,  to: 6,  acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'inst_7_12',  from: 7,  to: 12, acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'inst_13',    from: 13, to: 24, acquirer_id: 'adiq',   created_at: NOW, updated_at: NOW },
  { id: 'inst_g_1',   from: 1,  to: 1,  acquirer_id: 'getnet', created_at: NOW, updated_at: NOW },
  { id: 'inst_g_2_6', from: 2,  to: 6,  acquirer_id: 'getnet', created_at: NOW, updated_at: NOW },
  { id: 'inst_g_7_12',from: 7,  to: 12, acquirer_id: 'getnet', created_at: NOW, updated_at: NOW },
]

// Helper para gerar cost items
const ci = (
  id: string,
  acquirer_id: string,
  card_brand: CostItem['card_brand'],
  product_type: CostItem['product_type'],
  installment_id: string,
  rate: number,
  fee = 0.10,
  types: CostItem['types'] = 'mdr',
): CostItem => ({
  id, acquirer_id, card_brand, product_type, installment_id, rate, fee, types,
  merchant_id: MERCHANT_ID, created_at: NOW, updated_at: NOW,
})

const MOCK_COST_ITEMS: CostItem[] = [
  // Adiq — Mastercard
  ci('cost_001', 'adiq', 'MASTERCARD', 'debit',   'inst_1',     0.85),
  ci('cost_002', 'adiq', 'MASTERCARD', 'credit',  'inst_1',     1.45),
  ci('cost_003', 'adiq', 'MASTERCARD', 'credit',  'inst_2_6',   2.10),
  ci('cost_004', 'adiq', 'MASTERCARD', 'credit',  'inst_7_12',  2.85),
  ci('cost_005', 'adiq', 'MASTERCARD', 'credit',  'inst_13',    3.40),
  // Adiq — Visa
  ci('cost_006', 'adiq', 'VISA',       'debit',   'inst_1',     0.85),
  ci('cost_007', 'adiq', 'VISA',       'credit',  'inst_1',     1.40),
  ci('cost_008', 'adiq', 'VISA',       'credit',  'inst_2_6',   2.05),
  ci('cost_009', 'adiq', 'VISA',       'credit',  'inst_7_12',  2.80),
  // Adiq — Elo
  ci('cost_010', 'adiq', 'ELO',        'debit',   'inst_1',     0.80),
  ci('cost_011', 'adiq', 'ELO',        'credit',  'inst_1',     1.55),
  ci('cost_012', 'adiq', 'ELO',        'credit',  'inst_2_6',   2.20),
  // Adiq — Amex
  ci('cost_013', 'adiq', 'AMEX',       'credit',  'inst_1',     2.95),
  ci('cost_014', 'adiq', 'AMEX',       'credit',  'inst_2_6',   3.50),
  // Adiq — PIX
  ci('cost_015', 'adiq', 'PIX',        'debit',   'inst_1',     0.40, 0),
  // GetNet — Mastercard
  ci('cost_101', 'getnet', 'MASTERCARD', 'debit',  'inst_g_1',    0.92),
  ci('cost_102', 'getnet', 'MASTERCARD', 'credit', 'inst_g_1',    1.55),
  ci('cost_103', 'getnet', 'MASTERCARD', 'credit', 'inst_g_2_6',  2.25),
  ci('cost_104', 'getnet', 'MASTERCARD', 'credit', 'inst_g_7_12', 2.95),
  // GetNet — Visa
  ci('cost_105', 'getnet', 'VISA',       'debit',  'inst_g_1',    0.92),
  ci('cost_106', 'getnet', 'VISA',       'credit', 'inst_g_1',    1.50),
  ci('cost_107', 'getnet', 'VISA',       'credit', 'inst_g_2_6',  2.20),
]

const MOCK_COST_TABLES: CostBlueprintTable[] = [
  { id: 'tbl_cost_adiq_cp',    merchant_id: MERCHANT_ID, acquirer_id: 'adiq',   is_active: true, channel: 'cp',  created_at: NOW, updated_at: NOW },
  { id: 'tbl_cost_adiq_cnp',   merchant_id: MERCHANT_ID, acquirer_id: 'adiq',   is_active: true, channel: 'cnp', created_at: NOW, updated_at: NOW },
  { id: 'tbl_cost_getnet_cp',  merchant_id: MERCHANT_ID, acquirer_id: 'getnet', is_active: true, channel: 'cp',  created_at: NOW, updated_at: NOW },
]

const MOCK_COST_BLUEPRINT_ITEMS: CostBlueprintItem[] = MOCK_COST_ITEMS
  .filter(c => c.acquirer_id === 'adiq')
  .map((c, i) => ({ id: `cbi_${i}`, cost_blueprint_table_id: 'tbl_cost_adiq_cp', cost_item_id: c.id, created_at: NOW, updated_at: NOW }))

/* ─── Múltiplas tabelas de preço (Tupi feat/pricing) ─────────────────────── *
 * Cada PriceBlueprintTable representa uma "tabela de preços" nomeada
 * (Padrão / Varejão Premium / ECs Pequenos). Cada tabela tem margens
 * diferentes para os mesmos cost items — sub aplica diferentes preços
 * para diferentes ECs.
 * ──────────────────────────────────────────────────────────────────────── */

const MOCK_PRICE_TABLES: PriceBlueprintTable[] = [
  { id: 'tbl_price_padrao',  merchant_id: MERCHANT_ID, acquirer_id: 'all', is_active: true, name: 'Tabela Padrão',     created_at: NOW, updated_at: NOW },
  { id: 'tbl_price_varejao', merchant_id: MERCHANT_ID, acquirer_id: 'all', is_active: true, name: 'Varejão Premium',   created_at: NOW, updated_at: NOW },
  { id: 'tbl_price_pequeno', merchant_id: MERCHANT_ID, acquirer_id: 'all', is_active: true, name: 'ECs Pequenos',      created_at: NOW, updated_at: NOW },
]

// Margem por tabela (multiplica margem base por fator)
const TABLE_MARGIN_FACTOR: Record<string, number> = {
  tbl_price_padrao:  1.0,   // margem base
  tbl_price_varejao: 0.7,   // margem reduzida (volume alto, mais competitivo)
  tbl_price_pequeno: 1.4,   // margem maior (volume baixo, paga mais)
}

const baseMargin = (productType: string) =>
  productType === 'debit' ? 0.50 : productType === 'pre_paid' ? 0.40 : 1.00

/** Gera PriceItems para uma tabela específica usando o factor da tabela. */
function buildPriceItemsForTable(tableId: string): PriceItem[] {
  const factor = TABLE_MARGIN_FACTOR[tableId] ?? 1.0
  return MOCK_COST_ITEMS.map((c, i) => {
    const m = +(baseMargin(c.product_type) * factor).toFixed(2)
    return {
      id: `price_${tableId}_${i}`,
      cost_items_id: c.id,
      margin: m,
      rate: +(c.rate + m).toFixed(2),
      fee: c.fee,
      created_at: NOW, updated_at: NOW,
    }
  })
}

// Compat: PriceItems "default" = primeira tabela
const MOCK_PRICE_ITEMS: PriceItem[] = buildPriceItemsForTable(MOCK_PRICE_TABLES[0].id)

/* ────────────────────────────────────────────────────────────────────── *
 * Endpoints
 * ────────────────────────────────────────────────────────────────────── */

export async function getInstallments(): Promise<Installment[]> {
  if (apiMode === 'mock') { await mockDelay(); return MOCK_INSTALLMENTS }
  return request<Installment[]>(`${BASE}/installments`)
}

export async function getCostItems(params?: { acquirer_id?: string; merchant_id?: string }): Promise<CostItem[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    if (params?.acquirer_id) return MOCK_COST_ITEMS.filter(c => c.acquirer_id === params.acquirer_id)
    return MOCK_COST_ITEMS
  }
  return request<CostItem[]>(`${BASE}/cost-items`, { params })
}

export async function getCostBlueprintTables(params?: { merchant_id?: string }): Promise<CostBlueprintTable[]> {
  if (apiMode === 'mock') { await mockDelay(); return MOCK_COST_TABLES }
  return request<CostBlueprintTable[]>(`${BASE}/cost-blueprint-tables`, { params })
}

export async function getCostBlueprintItems(params: { cost_blueprint_table_id: string }): Promise<CostBlueprintItem[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_COST_BLUEPRINT_ITEMS.filter(i => i.cost_blueprint_table_id === params.cost_blueprint_table_id)
  }
  return request<CostBlueprintItem[]>(`${BASE}/cost-blueprint-items`, { params })
}

export async function getPriceItems(params?: { cost_items_id?: string; price_blueprint_table_id?: string }): Promise<PriceItem[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    const all = params?.price_blueprint_table_id
      ? buildPriceItemsForTable(params.price_blueprint_table_id)
      : MOCK_PRICE_ITEMS
    if (params?.cost_items_id) return all.filter(p => p.cost_items_id === params.cost_items_id)
    return all
  }
  return request<PriceItem[]>(`${BASE}/price-items`, { params })
}

export async function getPriceBlueprintTables(params?: { merchant_id?: string }): Promise<PriceBlueprintTable[]> {
  if (apiMode === 'mock') { await mockDelay(); return MOCK_PRICE_TABLES }
  return request<PriceBlueprintTable[]>(`${BASE}/price-blueprint-tables`, { params })
}

export async function getPriceBlueprintItems(params: { price_blueprint_table_id: string }): Promise<PriceBlueprintItem[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return MOCK_COST_BLUEPRINT_ITEMS.map(c => ({
      id: `pbi_${c.id}`,
      price_blueprint_table_id: params.price_blueprint_table_id,
      price_item_id: `price_${MOCK_COST_ITEMS.findIndex(ci => ci.id === c.cost_item_id)}`,
      created_at: NOW, updated_at: NOW,
    }))
  }
  return request<PriceBlueprintItem[]>(`${BASE}/price-blueprint-items`, { params })
}

export async function previewPrice(data: PricePreviewRequest): Promise<PricePreviewResponse> {
  if (apiMode === 'mock') {
    await mockDelay(150)
    const cost = MOCK_COST_ITEMS.find(c => c.id === data.cost_item_id)
    if (!cost) throw new Error('cost_item not found')
    return { custo: cost.rate, margem: data.margin, preco_final: cost.rate + data.margin }
  }
  return request<PricePreviewResponse>(`${BASE}/price-preview`, {
    method: 'POST',
    data,
    allowWriteInReadOnly: true, // preview é POST mas read-only de fato
  })
}
