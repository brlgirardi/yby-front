// src/lib/format.ts
/**
 * Helpers genéricos de formatação reutilizáveis em qualquer service/UI.
 * Centralizar aqui evita duplicação entre services de domínios diferentes.
 */

export type DecimalValue = { amount: number; scale: number }

/**
 * Converte DecimalValue {amount, scale} para número float.
 * Ex: {amount:123450, scale:2} → 1234.50
 *
 * Guarda contra valores inválidos vindos do servidor: scale fora de
 * [0, 10] ou números não-finitos retornam 0 (evita NaN/Infinity na UI).
 */
export function decimalToFloat(dv: DecimalValue): number {
  if (!Number.isFinite(dv.amount) || !Number.isFinite(dv.scale)) return 0
  if (dv.scale < 0 || dv.scale > 10) return 0
  return dv.amount / Math.pow(10, dv.scale)
}

/** Formata DecimalValue como moeda BRL. */
export function formatBRL(dv: DecimalValue | undefined): string {
  if (!dv) return '—'
  return decimalToFloat(dv).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
