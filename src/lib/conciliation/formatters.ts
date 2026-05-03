/**
 * Formatadores compartilhados de Conciliação — vocabulário Tupi.
 * Espelham os utils de yby-ui/financial/conciliation/utils/formatters.ts
 */

export const formatCurrency = (value: number): string =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

export const formatCurrencyShort = (value: number): string => {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}K`
  return formatCurrency(value)
}

export const formatTransactionCount = (count: number): string =>
  `${count.toLocaleString('pt-BR')} transações`

/**
 * Formata data ISO (YYYY-MM-DD) em partes para exibição em card.
 * Usa UTC para evitar problemas de fuso horário.
 */
export const formatDateFromAPI = (apiDate: string) => {
  const date = new Date(apiDate)
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = date.getUTCFullYear()
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const dayOfWeek = diasSemana[date.getUTCDay()]
  return {
    day,
    monthYear: `${month}/${year}`,
    fullDate: `${day}/${month}/${year}`,
    dayOfWeek,
  }
}

export const formatPercent = (value: string | number): string => {
  const n = typeof value === 'number' ? value : Number(String(value).replace('%', '').replace(',', '.'))
  if (!Number.isFinite(n)) return '—'
  return `${n.toFixed(2).replace('.', ',')}%`
}

/**
 * Normaliza valores nulos vindos do backend como string "<nil>".
 */
export const normalizeNilValue = (value: string | null | undefined): string | null => {
  if (!value || value === '<nil>' || value === '<nil>') return null
  return value
}
