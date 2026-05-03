'use client'

import { useMemo, useState } from 'react'
import Icon from '@/components/shared/Icon'
import { useInterchangeList } from '@/hooks/conciliation/useInterchangeList'
import { exportInterchangeListToCSV } from '@/lib/conciliation/csvExport'
import { isFullyReconciled } from '@/lib/conciliation/statusUtils'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import type { InterchangeRecord } from '@/services/types/brandDetail.types'
import BrandSummaryCard from './BrandSummaryCard'
import DateScroller from './DateScroller'
import InterchangeDetailModal from './InterchangeDetailModal'
import InterchangeDropdownTable from './InterchangeDropdownTable'

export interface BrandDetailProps {
  brand: BrandData
  date: string
  onDateChange: (date: string) => void
  onBack: () => void
}

/**
 * Tela de detalhe por bandeira — após o usuário clicar num AcquirerSummaryCard.
 *
 * Estrutura (espelha LGR-264-recon-acquirer):
 *  - Header: voltar, logo, useConfigId
 *  - DateScroller: navegar dias sem voltar pro Overview
 *  - BrandSummaryCard: resumo capture × outgoing
 *  - Filtros (busca + status) + Exportar CSV
 *  - Lista de IRDs divergentes (collapse) + conciliados (collapse)
 *  - Click em IRD → Drawer com transações detalhadas
 */
export default function BrandDetail({ brand, date, onDateChange, onBack }: BrandDetailProps) {
  const { records, loading, error } = useInterchangeList(brand.useConfigId, date)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'divergent' | 'conciliated'>('all')
  const [selectedRecord, setSelectedRecord] = useState<InterchangeRecord | null>(null)
  const [openDivergent, setOpenDivergent] = useState(true)
  const [openConciliated, setOpenConciliated] = useState(true)

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (searchTerm && !r.interchangeCode.toLowerCase().includes(searchTerm.toLowerCase())) return false
      const fully = isFullyReconciled(r.conciliationRate)
      if (statusFilter === 'divergent' && fully) return false
      if (statusFilter === 'conciliated' && !fully) return false
      return true
    })
  }, [records, searchTerm, statusFilter])

  const divergent = filtered.filter(r => !isFullyReconciled(r.conciliationRate))
  const conciliated = filtered.filter(r => isFullyReconciled(r.conciliationRate))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label="Voltar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', padding: '4px 8px 4px 0' }}>
          <Icon name="arrowLeft" size={16} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)', textTransform: 'capitalize' }}>
          {brand.name}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>•</span>
        <span style={{ fontFamily: 'Roboto Mono', fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{brand.useConfigId}</span>
        <button
          onClick={() => exportInterchangeListToCSV(records, brand.name, date)}
          disabled={!records.length}
          style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#fff', border: '1px solid #d9d9d9', borderRadius: 2,
            padding: '5px 10px', fontSize: 12, color: 'rgba(0,0,0,0.85)',
            cursor: records.length ? 'pointer' : 'not-allowed',
            opacity: records.length ? 1 : 0.5, fontFamily: 'Roboto',
          }}>
          <Icon name="download" size={12} /> Exportar CSV
        </button>
      </div>

      {/* DateScroller */}
      <DateScroller value={date} onChange={onDateChange} />

      {/* BrandSummaryCard */}
      <BrandSummaryCard brand={brand} />

      {/* Filtros */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
            <Icon name="search" size={14} color="rgba(0,0,0,0.45)" />
          </span>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar IRD..."
            aria-label="Buscar IRD"
            style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 10px 5px 30px', fontSize: 13, outline: 'none', fontFamily: 'Roboto' }}
          />
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
          Status:
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as 'all' | 'divergent' | 'conciliated')}
            style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: '4px 8px', fontSize: 12, fontFamily: 'Roboto', background: '#fff' }}>
            <option value="all">Todos</option>
            <option value="divergent">Divergentes</option>
            <option value="conciliated">Conciliados</option>
          </select>
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          {filtered.length} IRDs
        </span>
      </div>

      {error && <div style={{ padding: 12, background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13 }}>Erro: {error}</div>}
      {loading && <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Carregando IRDs…</div>}

      {/* Divergentes */}
      {!loading && divergent.length > 0 && (
        <Section
          title="Divergências"
          count={divergent.length}
          tone="warning"
          open={openDivergent}
          onToggle={() => setOpenDivergent(o => !o)}
        >
          <InterchangeDropdownTable
            records={divergent}
            variant="divergent"
            onRowClick={r => setSelectedRecord(r)}
          />
        </Section>
      )}

      {/* Conciliados */}
      {!loading && conciliated.length > 0 && (
        <Section
          title="Conciliados"
          count={conciliated.length}
          tone="success"
          open={openConciliated}
          onToggle={() => setOpenConciliated(o => !o)}
        >
          <InterchangeDropdownTable
            records={conciliated}
            variant="conciliated"
            onRowClick={r => setSelectedRecord(r)}
          />
        </Section>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
          Nenhum IRD encontrado para os filtros aplicados.
        </div>
      )}

      <InterchangeDetailModal
        open={!!selectedRecord}
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  )
}

interface SectionProps {
  title: string
  count: number
  tone: 'success' | 'warning'
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Section({ title, count, tone, open, onToggle, children }: SectionProps) {
  const accent = tone === 'success' ? '#237804' : '#874D00'
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
      <button onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Roboto', textAlign: 'left',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{title}</span>
          <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{count} {count === 1 ? 'IRD' : 'IRDs'}</span>
        </div>
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={14} color="rgba(0,0,0,0.45)" />
      </button>
      {open && <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 16px', background: '#fafafa' }}>{children}</div>}
    </div>
  )
}
