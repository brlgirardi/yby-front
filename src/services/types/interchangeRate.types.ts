/**
 * Matriz de Intercâmbio (Interchange Rate Matrix) — espelhado do yby-ui.
 *
 * Cada registro representa uma taxa cobrada pela bandeira (interchange)
 * para uma combinação específica de:
 *  - bandeira × tipo (doméstico/internacional)
 *  - tier (standard/premium/corporate)
 *  - PF/PJ
 *  - produto (crédito/débito/pré-pago)
 *  - tipo de entrada (chip/contactless/magnético)
 *  - segmento (e-commerce/corporativo/governo)
 */

export interface InterchangeRateRecord {
  id: string
  cardBrand: string
  type: string
  cardTier: string
  personType: string
  cardProduct: string
  cardEntry: string
  sector: string
  /** Taxa em percentual (ex: 1.45 = 1,45%) */
  rate: number
  /** ITC fixo adicional em centavos (opcional) */
  fixedFee?: number
  effectiveDate: string
}

export interface InterchangeRateBrandSummary {
  id: string
  brand: string
  configs: number
  updatedAt: string
}

export interface InterchangeRateFilters {
  searchTerm: string
  cardBrand: string
  cardProduct: string
  personType: string
  cardEntry: string
  sector: string
}
