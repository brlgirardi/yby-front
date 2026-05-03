/**
 * Helpers de exportação CSV — espelham `csvExport.ts` do branch LGR-263-recon-sub.
 * Tratam de download client-side (sem chamar backend) e formatação BR.
 */

import type { BrandData } from '@/services/types/acquirerSummary.types'
import type { InterchangeRecord, TransactionDetail } from '@/services/types/brandDetail.types'

const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatPercent = (value: number): string => `${value.toFixed(2)}%`

const todayISO = () => new Date().toISOString().split('T')[0]

const escapeCell = (s: unknown): string => `"${String(s ?? '').replace(/"/g, '""')}"`

export function downloadCSV(content: string, filename: string): void {
  // BOM para Excel reconhecer UTF-8
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Exporta o overview da conciliação (uma linha por bandeira × dia). */
export function exportOverviewToCSV(brands: BrandData[], date: string): void {
  const headers = [
    'Data',
    'Bandeira',
    'Status',
    'Taxa de conciliação',
    'Transações capture',
    'Transações outgoing',
    'TPV capture',
    'TPV outgoing',
    'ITC capture',
    'ITC outgoing',
  ]
  const rows = brands.map(b => [
    date,
    b.name,
    b.status ?? '',
    formatPercent(b.conciliationRate),
    b.transactions.sourceA,
    b.transactions.sourceB,
    formatCurrency(b.tpv.sourceA),
    formatCurrency(b.tpv.sourceB),
    formatCurrency(b.itc.sourceA),
    formatCurrency(b.itc.sourceB),
  ])
  const csv = [headers, ...rows].map(r => r.map(escapeCell).join(',')).join('\n')
  downloadCSV(csv, `conciliacao-overview-${date}.csv`)
}

/** Exporta a lista de IRDs (group codes) de um BrandDetail. */
export function exportInterchangeListToCSV(records: InterchangeRecord[], brand: string, date: string): void {
  const headers = [
    'Data',
    'Bandeira',
    'IRD',
    'Consolidation ID',
    'Taxa',
    'Trans. capture',
    'Trans. outgoing',
    'TPV capture',
    'TPV outgoing',
    'ITC capture',
    'ITC outgoing',
  ]
  const rows = records.map(r => [
    date,
    brand,
    r.interchangeCode,
    r.consolidationId,
    formatPercent(r.conciliationRate),
    r.transactions.sourceA,
    r.transactions.sourceB,
    formatCurrency(r.tpv.sourceA),
    formatCurrency(r.tpv.sourceB),
    formatCurrency(r.discounts.sourceA),
    formatCurrency(r.discounts.sourceB),
  ])
  const csv = [headers, ...rows].map(r => r.map(escapeCell).join(',')).join('\n')
  downloadCSV(csv, `conciliacao-${brand}-${date}.csv`)
}

/** Exporta as transações detalhadas de um IRD. */
export function exportTransactionsToCSV(
  transactions: TransactionDetail[],
  variant: 'divergentes' | 'conciliadas',
  ird: string,
): void {
  const headers = ['Data/Hora', 'Terminal ID', 'NSU', 'Valor', 'ITC apurado']
  const rows = transactions.map(t => [
    t.transactionDate ?? '',
    t.terminalId ?? '',
    t.nsu ?? '',
    formatCurrency(t.amount),
    formatCurrency(t.calculatedItc),
  ])
  const csv = [headers, ...rows].map(r => r.map(escapeCell).join(',')).join('\n')
  downloadCSV(csv, `transacoes-${variant}-IRD-${ird}-${todayISO()}.csv`)
}
