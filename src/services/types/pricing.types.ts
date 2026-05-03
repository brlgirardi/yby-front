/**
 * Tipos do módulo Pricing — espelhados do branch feat/pricing do yby-ui Tupi.
 *
 * Conceitos:
 *  - Cost Blueprint: tabela de custos (taxa que o adquirente cobra do sub)
 *  - Price Blueprint: tabela de preços (taxa que o sub cobra dos ECs)
 *  - Cost Item / Price Item: linhas individuais (bandeira × método × parcelamento)
 *  - Installment: range de parcelamento (1, 2-6, 7-12, 13+)
 *  - PricingModel: 'mdr' (taxa única) | 'interchange_plus' (custo + spread)
 *  - Channel: 'cp' (Cartão Presente — POS/TEF) | 'cnp' (Não Presente — Link/Gateway)
 */

export type PricingModel = 'mdr' | 'interchange_plus'
export type ProductType = 'credit' | 'debit' | 'pre_paid'
export type CardBrand = 'MASTERCARD' | 'VISA' | 'ELO' | 'AMEX' | 'PIX' | 'ALL'
export type Channel = 'cp' | 'cnp'

export interface Installment {
  id: string
  from: number
  to: number
  acquirer_id: string
  created_at: string
  updated_at: string
}

export interface CostItem {
  id: string
  types: PricingModel
  product_type: ProductType
  card_brand: CardBrand
  rate: number
  fee?: number
  mcc?: string
  installment_id: string
  acquirer_id: string
  merchant_id?: string
  created_at: string
  updated_at: string
}

export interface CostBlueprintTable {
  id: string
  merchant_id: string
  acquirer_id: string
  is_active: boolean
  channel?: Channel
  created_at: string
  updated_at: string
}

export interface CostBlueprintItem {
  id: string
  cost_blueprint_table_id: string
  cost_item_id: string
  created_at: string
  updated_at: string
}

export interface PriceItem {
  id: string
  cost_items_id: string
  /** Margem em pontos percentuais somada ao custo. Ex: cost 1.45% + margin 0.50pp = price 1.95% */
  margin: number
  /** Taxa final (custo + margem) calculada pelo backend */
  rate: number
  fee?: number
  created_at: string
  updated_at: string
}

export interface PriceBlueprintTable {
  id: string
  merchant_id: string
  acquirer_id: string
  is_active: boolean
  channel?: Channel
  created_at: string
  updated_at: string
}

export interface PriceBlueprintItem {
  id: string
  price_blueprint_table_id: string
  price_item_id: string
  created_at: string
  updated_at: string
}

export interface PricePreviewRequest {
  cost_item_id: string
  margin: number
}

export interface PricePreviewResponse {
  custo: number
  margem: number
  preco_final: number
}

/** Labels para apresentação em UI. */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pre_paid: 'Pré-pago',
  debit: 'Débito à vista',
  credit_1: 'Crédito à vista',
  credit_2_6: 'Crédito 2-6x',
  credit_7_12: 'Crédito 7-12x',
  credit_above_12: 'Crédito 13x+',
}

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  MASTERCARD: 'Mastercard',
  VISA: 'Visa',
  ELO: 'Elo',
  AMEX: 'Amex',
  PIX: 'PIX',
  ALL: 'Todos',
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  cp: 'Cartão Presente (CP)',
  cnp: 'Cartão Não Presente (CNP)',
}
