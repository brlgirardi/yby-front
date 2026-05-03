/**
 * Mapeia o status de conciliação vindo do backend (snake_case) para o
 * vocabulário PT-BR usado na UI.
 *
 * Backend (Tupi):    reconciled | partially_reconciled | not_reconciled | mismatch
 * UI:                Reconciliado | Parc. Conciliado | Não Conciliado | Divergência
 */

const STATUS_TO_LABEL: Record<string, string> = {
  reconciled: 'Reconciliado',
  partially_reconciled: 'Parc. Conciliado',
  not_reconciled: 'Não Conciliado',
  mismatch: 'Divergência',
}

export const getReconciliationStatusLabel = (status: string): string => {
  const normalized = status.toLowerCase()
  return STATUS_TO_LABEL[normalized] ?? status
}

/**
 * Status estendido para o `<Tag status={...}>` shared. Aceita tanto a key Tupi
 * (ex: "reconciled") quanto o label PT-BR ("Reconciliado") — sempre devolve um
 * value reconhecido pelo STATUS_MAP do Tag.
 */
export const toTagStatus = (apiStatus: string): string => {
  return getReconciliationStatusLabel(apiStatus)
}

export const isFullyReconciled = (rate: number | string | null | undefined): boolean => {
  if (rate === null || rate === undefined) return false
  const n = typeof rate === 'number' ? rate : Number(String(rate).replace('%', '').replace(',', '.'))
  return Number.isFinite(n) && n >= 100
}

/** Normaliza um rate (string "99.34%" ou number 99.34) para number. */
export function normalizeConciliationRate(rate?: number | string | null): number {
  if (rate === null || rate === undefined) return 0
  if (typeof rate === 'number') return Number.isFinite(rate) ? rate : 0
  const trimmed = String(rate).trim().replace('%', '').replace(',', '.')
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : 0
}
