/**
 * Receivables Service — integração com yby-bff /public/receivables-calendar/*.
 *
 * Fonte real (BFF que proxia o yby-ledger receivables-calendar):
 *   GET /public/receivables-calendar/summary
 *   GET /public/receivables-calendar/calendar
 *   GET /public/receivables-calendar/calendar/{date}
 *   GET /public/receivables-calendar/installments
 *   GET /public/receivables-calendar/batches
 *   GET /public/receivables-calendar/anticipations
 *   GET /public/receivables-calendar/funding
 *   GET /public/receivables-calendar/payments
 *
 * Em modo mock devolve as fixtures de src/mocks/ec/agenda.ts (V0 V1 atual).
 */

import { apiMode, mockDelay, request } from './apiClient'
import {
  ecAgendaJanuary,
  ecAgendaKpis,
  ecAgendaDay11,
  ecPagamentosAgendados,
  type AgendaDay,
  type AgendaKpis,
  type DayDetail,
  type PagamentoAgendado,
} from '@/mocks/ec/agenda'

const BASE = '/public/receivables-calendar'

/* ─── Tipos de filtro/range ───────────────────────────────────────────── */

export interface DateRangeParams {
  /** YYYY-MM-DD */
  startDate?: string
  /** YYYY-MM-DD */
  endDate?: string
}

export interface CalendarParams extends DateRangeParams {
  /** Ex: '2026-05' para mês específico. */
  month?: string
}

/* ─── Tipos de resposta (resumos) ──────────────────────────────────────
 * Tipos detalhados do receivables-calendar (Installment, Batch, Anticipation,
 * Funding, Payment) ainda não foram modelados no nosso front porque a tela
 * de Agenda hoje opera com fixtures locais. Quando virar real, importar
 * tipos do yby-ledger via OpenAPI / DTO compartilhado. Por ora, expomos
 * `unknown[]` pra não inventar contrato.
 */

export async function getReceivablesSummary(params?: DateRangeParams): Promise<AgendaKpis> {
  if (apiMode === 'mock') {
    await mockDelay()
    return ecAgendaKpis
  }
  return request<AgendaKpis>(`${BASE}/summary`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesCalendar(params?: CalendarParams): Promise<AgendaDay[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return ecAgendaJanuary
  }
  return request<AgendaDay[]>(`${BASE}/calendar`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesCalendarDay(date: string): Promise<DayDetail> {
  if (apiMode === 'mock') {
    await mockDelay()
    return ecAgendaDay11
  }
  return request<DayDetail>(`${BASE}/calendar/${date}`)
}

export async function getReceivablesInstallments(params?: DateRangeParams): Promise<unknown[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  return request<unknown[]>(`${BASE}/installments`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesBatches(params?: DateRangeParams): Promise<unknown[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  return request<unknown[]>(`${BASE}/batches`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesAnticipations(params?: DateRangeParams): Promise<unknown[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  return request<unknown[]>(`${BASE}/anticipations`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesFunding(params?: DateRangeParams): Promise<unknown[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return []
  }
  return request<unknown[]>(`${BASE}/funding`, { params: params as Record<string, string | number | boolean | undefined> })
}

export async function getReceivablesPayments(params?: DateRangeParams): Promise<PagamentoAgendado[]> {
  if (apiMode === 'mock') {
    await mockDelay()
    return ecPagamentosAgendados
  }
  return request<PagamentoAgendado[]>(`${BASE}/payments`, { params: params as Record<string, string | number | boolean | undefined> })
}
