/**
 * ⚠️ MOCK-ONLY até a API pública Tupi expor endpoints de pricing/custos.
 *
 * Service de Pricing (Custos + Preços) — espelhado do branch feat/pricing do yby-ui Tupi.
 *
 * Endpoints reais (yby-bff → yby-pricing-economics-api):
 *   GET  /public/pricing/installments
 *   GET  /public/pricing/cost-blueprints          (lista CostBlueprint)
 *   GET  /public/pricing/cost-blueprints/{id}     (detalhe + items)
 *   GET  /public/pricing/price-blueprints         (lista PriceBlueprint)
 *   GET  /public/pricing/price-blueprints/{id}    (detalhe + items)
 *
 * O nosso service expõe CRUD mais granular (CostItem, CostBlueprintTable,
 * CostBlueprintItem, PriceItem, PriceBlueprintTable, PriceBlueprintItem)
 * porque a UI navega por tabela → bandeira → método. O mapeamento entre
 * essa API granular e os endpoints aglomerados do BFF acontece quando
 * `apiMode='real'` for ativado — hoje só roda mock.
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

const BASE = '/public/pricing'

/* ────────────────────────────────────────────────────────────────────── *
 * MOCK DATA — refletindo um sub-adquirente Tupi com 2 adquirentes (Adiq, GetNet)
 *             em 2 canais (CP, CNP) com tabela de custos e preços ativa.
 * ────────────────────────────────────────────────────────────────────── */

const NOW = '2026-04-24T12:00:00Z'
const MERCHANT_ID = 'merchant_yby_demo'

// Parcelas (faixas) replicadas para todos os 6 adquirentes reais da API pública /v1.
const INSTALLMENT_RANGES: { suffix: string; from: number; to: number }[] = [
  { suffix: '1',    from: 1,  to: 1  },
  { suffix: '2_6',  from: 2,  to: 6  },
  { suffix: '7_12', from: 7,  to: 12 },
  { suffix: '13',   from: 13, to: 24 },
]
const ACQUIRERS = ['cielo', 'rede', 'stone', 'getnet', 'adiq', 'pagseguro'] as const
type AcquirerId = (typeof ACQUIRERS)[number]

const MOCK_INSTALLMENTS: Installment[] = ACQUIRERS.flatMap((acq) =>
  INSTALLMENT_RANGES.map((r) => ({
    id: `inst_${acq}_${r.suffix}`,
    from: r.from,
    to: r.to,
    acquirer_id: acq,
    created_at: NOW,
    updated_at: NOW,
  })),
)

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

/**
 * Tabela base de taxas por bandeira/produto/faixa de parcela.
 * Aplicamos um "fator competitivo" por adquirente em cima dessa base,
 * gerando dados realistas pra todos os 6 adquirentes da API pública /v1.
 */
const COST_BASE: Array<{
  brand: CostItem['card_brand']
  product: CostItem['product_type']
  ranges: Record<string, number>
  fee?: number
}> = [
  { brand: 'MASTERCARD', product: 'debit',  ranges: { '1': 0.85 } },
  { brand: 'MASTERCARD', product: 'credit', ranges: { '1': 1.45, '2_6': 2.10, '7_12': 2.85, '13': 3.40 } },
  { brand: 'VISA',       product: 'debit',  ranges: { '1': 0.85 } },
  { brand: 'VISA',       product: 'credit', ranges: { '1': 1.40, '2_6': 2.05, '7_12': 2.80, '13': 3.35 } },
  { brand: 'ELO',        product: 'debit',  ranges: { '1': 0.80 } },
  { brand: 'ELO',        product: 'credit', ranges: { '1': 1.55, '2_6': 2.20 } },
  { brand: 'AMEX',       product: 'credit', ranges: { '1': 2.95, '2_6': 3.50 } },
  { brand: 'PIX',        product: 'debit',  ranges: { '1': 0.40 }, fee: 0 },
]

/**
 * Multiplicadores por adquirente — refletem competitividade no mercado real.
 * Cielo + Rede operam volumes altos (margens mais apertadas).
 * Stone + GetNet são medianas. Adiq é mais agressiva (sub-acquirer Itaú).
 * PagSeguro tende a ter taxas maiores pra ECs pequenos.
 */
const ACQUIRER_FACTOR: Record<AcquirerId, number> = {
  cielo: 1.0,
  rede: 1.02,
  stone: 1.05,
  getnet: 1.08,
  adiq: 0.95,
  pagseguro: 1.15,
}

const MOCK_COST_ITEMS: CostItem[] = ACQUIRERS.flatMap((acq) =>
  COST_BASE.flatMap((base) =>
    Object.entries(base.ranges).map(([range, rate]) =>
      ci(
        `cost_${acq}_${base.brand.toLowerCase()}_${base.product}_${range}`,
        acq,
        base.brand,
        base.product,
        `inst_${acq}_${range}`,
        +(rate * ACQUIRER_FACTOR[acq]).toFixed(2),
        base.fee ?? 0.10,
      ),
    ),
  ),
)

// Cada adquirente real tem uma tabela CP. Apenas alguns operam CNP (gateways de e-commerce).
const ACQUIRER_HAS_CNP: Record<AcquirerId, boolean> = {
  cielo: true,
  rede: true,
  stone: false,
  getnet: true,
  adiq: true,
  pagseguro: true,
}

const MOCK_COST_TABLES: CostBlueprintTable[] = ACQUIRERS.flatMap((acq) => {
  const tables: CostBlueprintTable[] = [
    {
      id: `tbl_cost_${acq}_cp`,
      merchant_id: MERCHANT_ID,
      acquirer_id: acq,
      is_active: true,
      channel: 'cp',
      created_at: NOW,
      updated_at: NOW,
    },
  ]
  if (ACQUIRER_HAS_CNP[acq]) {
    tables.push({
      id: `tbl_cost_${acq}_cnp`,
      merchant_id: MERCHANT_ID,
      acquirer_id: acq,
      is_active: true,
      channel: 'cnp',
      created_at: NOW,
      updated_at: NOW,
    })
  }
  return tables
})

const MOCK_COST_BLUEPRINT_ITEMS: CostBlueprintItem[] = MOCK_COST_TABLES.flatMap((table) =>
  MOCK_COST_ITEMS
    .filter((c) => c.acquirer_id === table.acquirer_id)
    .map((c, i) => ({
      id: `cbi_${table.id}_${i}`,
      cost_blueprint_table_id: table.id,
      cost_item_id: c.id,
      created_at: NOW,
      updated_at: NOW,
    })),
)

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
