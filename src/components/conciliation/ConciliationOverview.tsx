'use client'

import { useMemo, useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import Icon from '@/components/atoms/Icon'
import AcquirerSummaryCard from './AcquirerSummaryCard'
import ConciliationSkeleton from './ConciliationSkeleton'
import DateScroller from './DateScroller'
import { useAcquirerSummary } from '@/hooks/conciliation/useAcquirerSummary'
import { applyConciliationFilters, STATUS_OPTIONS, BRAND_OPTIONS } from '@/hooks/conciliation/useConciliationFilters'
import { formatCurrencyShort } from '@/lib/conciliation/formatters'
import { exportOverviewToCSV } from '@/lib/conciliation/csvExport'
import { usePrefsStore } from '@/store/prefs.store'
import type { BrandData } from '@/services/types/acquirerSummary.types'

export interface ConciliationOverviewProps {
  date: string
  onDateChange: (date: string) => void
  onBrandClick: (brand: BrandData) => void
}

export default function ConciliationOverview({ date, onDateChange, onBrandClick }: ConciliationOverviewProps) {
  const { brand: brands, loading, error } = useAcquirerSummary(date)

  // Filtros: status e bandeira persistem entre sessões (Status quo — Enviesados cap. 5).
  // searchTerm é volátil (pesquisa pontual, não faz sentido persistir).
  const reconStatusFilter = usePrefsStore(s => s.reconStatusFilter)
  const reconBrandFilter = usePrefsStore(s => s.reconBrandFilter)
  const setReconStatusFilter = usePrefsStore(s => s.setReconStatusFilter)
  const setReconBrandFilter = usePrefsStore(s => s.setReconBrandFilter)
  const [searchTerm, setSearchTerm] = useState('')

  const filters = useMemo(() => ({
    searchTerm,
    statusFilter: reconStatusFilter,
    brandFilter: reconBrandFilter,
  }), [searchTerm, reconStatusFilter, reconBrandFilter])

  const filtered = useMemo(() => applyConciliationFilters(brands, filters), [brands, filters])

  const totals = useMemo(() => {
    // Quantas bandeiras estão em cada estado (para os KPIs do topo)
    const totalReconciledTpv = brands.reduce((acc, b) => acc + b.tpv.reconciled, 0)
    const totalTpv = brands.reduce((acc, b) => acc + b.tpv.total, 0)
    const fullyReconciled = brands.filter(b => b.transactions.divergent === 0 && b.transactions.pending === 0).length
    const hasDivergent = brands.filter(b => b.transactions.divergent > 0).length
    const hasPending = brands.filter(b => b.transactions.pending > 0).length
    const avgRate = totalTpv > 0 ? (totalReconciledTpv / totalTpv) * 100 : 0
    return { totalReconciledTpv, totalTpv, fullyReconciled, hasDivergent, hasPending, avgRate, total: brands.length }
  }, [brands])

  // dayStatus: alimenta a barra de progresso do DateScroller para o dia selecionado.
  // Dias sem dados ficam com barra vazia (ratio === null).
  const dayStatus = useMemo(() => {
    if (!brands.length) return undefined
    return {
      [date]: {
        reconciled: brands.filter(b => b.status === 'reconciled').length,
        total: brands.length,
      },
    }
  }, [brands, date])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
      {/* Date scroller + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, maxWidth: 760 }}>
          <DateScroller value={date} onChange={onDateChange} dayStatus={dayStatus} />
        </div>
        <button
          onClick={() => exportOverviewToCSV(brands, date)}
          disabled={!brands.length}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', border: '1px solid #d9d9d9', borderRadius: 2,
            padding: '6px 12px', fontSize: 12, color: 'rgba(0,0,0,0.85)',
            cursor: brands.length ? 'pointer' : 'not-allowed',
            opacity: brands.length ? 1 : 0.5, fontFamily: 'Roboto',
          }}>
          <Icon name="download" size={12} /> Exportar CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
        <KpiCard
          label="Bandeiras consolidadas"
          value={String(totals.total)}
          subLabel={`${totals.fullyReconciled} 100% conciliadas`}
          variant="info"
          tooltip="Pares (bandeira × tipo) com consolidação para a data."
          loading={loading}
          style={{ flex: 1, minWidth: 160 }}
        />
        <KpiCard
          label="Volume conciliado"
          value={formatCurrencyShort(totals.totalReconciledTpv)}
          subLabel={`de ${formatCurrencyShort(totals.totalTpv)} total`}
          variant="success"
          tooltip="TPV que bateu exato entre capture (A) e outgoing (B) — soma da linha ✓ de todas as bandeiras."
          loading={loading}
          style={{ flex: 1, minWidth: 160 }}
        />
        <KpiCard
          label="Com divergência"
          value={String(totals.hasDivergent)}
          subLabel={totals.hasDivergent === 0 ? 'nenhuma' : 'valores diferentes'}
          variant={totals.hasDivergent > 0 ? 'error' : 'success'}
          tooltip="Bandeiras com pelo menos 1 transação onde achou par em B mas com valor diferente de A — exigem investigação no detalhe."
          loading={loading}
          style={{ flex: 1, minWidth: 160 }}
        />
        <KpiCard
          label="Com pendência"
          value={String(totals.hasPending)}
          subLabel={totals.hasPending === 0 ? 'sem pendência' : 'arquivo ausente'}
          variant={totals.hasPending > 0 ? 'warning' : 'success'}
          tooltip="Bandeiras com pelo menos 1 transação em A sem par em B — provavelmente arquivo (EDI) ausente ou ilegível. Verifique a integração."
          loading={loading}
          style={{ flex: 1, minWidth: 160 }}
        />
        <KpiCard
          label="Taxa média"
          value={`${totals.avgRate.toFixed(1)}%`}
          subLabel="TPV conciliado ÷ total"
          variant={totals.avgRate >= 99 ? 'success' : totals.avgRate >= 95 ? 'warning' : 'error'}
          tooltip="(TPV reconciliado de todas as bandeiras) ÷ (TPV total). Peso por volume, não por contagem."
          loading={loading}
          style={{ flex: 1, minWidth: 160 }}
        />
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Icon name="search" size={14} color="rgba(0,0,0,0.45)" />
          <input
            value={filters.searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar bandeira..."
            aria-label="Buscar bandeira"
            style={{
              width: '100%', border: '1px solid #d9d9d9', borderRadius: 2,
              padding: '5px 10px 5px 30px', fontSize: 13, outline: 'none',
              fontFamily: 'Roboto', marginLeft: -22,
            }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon name="search" size={14} color="rgba(0,0,0,0.45)" />
          </span>
        </div>

        <select
          value={filters.statusFilter}
          onChange={e => setReconStatusFilter(e.target.value)}
          aria-label="Filtrar por status"
          style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 8px', fontSize: 13, fontFamily: 'Roboto', outline: 'none', background: '#fff' }}
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filters.brandFilter}
          onChange={e => setReconBrandFilter(e.target.value)}
          aria-label="Filtrar por bandeira"
          style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 8px', fontSize: 13, fontFamily: 'Roboto', outline: 'none', background: '#fff' }}
        >
          {BRAND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          {filtered.length} de {brands.length}
        </span>
      </div>

      {/* Lista */}
      {error && (
        <div style={{ padding: '12px 14px', background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13 }}>
          Erro ao carregar conciliações: {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && <ConciliationSkeleton variant="overview" />}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
            Nenhuma conciliação encontrada para os filtros aplicados.
          </div>
        )}
        {filtered.map(b => (
          <AcquirerSummaryCard key={b.id} brand={b} onClick={onBrandClick} />
        ))}
      </div>
    </div>
  )
}
