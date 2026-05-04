'use client'

import { useMemo } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import Icon from '@/components/shared/Icon'
import AcquirerSummaryCard from './AcquirerSummaryCard'
import ConciliationSkeleton from './ConciliationSkeleton'
import DateScroller from './DateScroller'
import { useAcquirerSummary } from '@/hooks/conciliation/useAcquirerSummary'
import { useConciliationFilters, applyConciliationFilters, STATUS_OPTIONS, BRAND_OPTIONS } from '@/hooks/conciliation/useConciliationFilters'
import { formatCurrencyShort } from '@/lib/conciliation/formatters'
import { exportOverviewToCSV } from '@/lib/conciliation/csvExport'
import type { BrandData } from '@/services/types/acquirerSummary.types'

export interface ConciliationOverviewProps {
  date: string
  onDateChange: (date: string) => void
  onBrandClick: (brand: BrandData) => void
}

export default function ConciliationOverview({ date, onDateChange, onBrandClick }: ConciliationOverviewProps) {
  const { brand: brands, loading, error } = useAcquirerSummary(date)
  const { filters, setSearchTerm, setStatusFilter, setBrandFilter } = useConciliationFilters()

  const filtered = useMemo(() => applyConciliationFilters(brands, filters), [brands, filters])

  const totals = useMemo(() => {
    const totalTransactions = brands.reduce((acc, b) => acc + (b.transactions.sourceA + b.transactions.sourceB) / 2, 0)
    const totalTpv = brands.reduce((acc, b) => acc + (b.tpv.sourceA + b.tpv.sourceB) / 2, 0)
    const reconciled = brands.filter(b => b.status === 'reconciled').length
    const mismatch = brands.filter(b => b.status === 'mismatch' || b.status === 'not_reconciled').length
    const partialPlus = brands.filter(b => b.status === 'partially_reconciled').length
    const avgRate = brands.length ? brands.reduce((a, b) => a + b.conciliationRate, 0) / brands.length : 0
    return { totalTransactions, totalTpv, reconciled, mismatch, partialPlus, avgRate, total: brands.length }
  }, [brands])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
      {/* Date scroller + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, maxWidth: 760 }}>
          <DateScroller value={date} onChange={onDateChange} />
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
          subLabel={`${totals.reconciled} reconciliadas`}
          variant="info"
          tooltip="Quantidade de pares (bandeira × tipo) com consolidação para a data."
          loading={loading}
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Volume conciliado"
          value={formatCurrencyShort(totals.totalTpv)}
          subLabel="média capture/outgoing"
          variant="success"
          tooltip="TPV médio entre as duas origens (capture e outgoing) das bandeiras do dia."
          loading={loading}
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Divergências abertas"
          value={String(totals.mismatch)}
          subLabel={totals.partialPlus ? `+ ${totals.partialPlus} parciais` : 'todas conciliadas'}
          variant={totals.mismatch > 0 ? 'error' : 'success'}
          tooltip="Pares com divergência total entre capture e outgoing — exigem investigação no detalhe."
          loading={loading}
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Taxa média"
          value={`${totals.avgRate.toFixed(1)}%`}
          subLabel="conciliação"
          variant={totals.avgRate >= 99 ? 'success' : totals.avgRate >= 95 ? 'warning' : 'error'}
          tooltip="Média da taxa de conciliação (capture × outgoing) entre todas as bandeiras."
          loading={loading}
          style={{ flex: 1, minWidth: 180 }}
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
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filtrar por status"
          style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 8px', fontSize: 13, fontFamily: 'Roboto', outline: 'none', background: '#fff' }}
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filters.brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
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
