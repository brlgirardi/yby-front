'use client'

import { useState } from 'react'
import { Drawer } from 'antd'
import Icon from '@/components/shared/Icon'
import Tag from '@/components/shared/Tag'
import { formatCurrency } from '@/lib/conciliation/formatters'
import { useInterchangeDetail } from '@/hooks/conciliation/useInterchangeDetail'
import { isFullyReconciled } from '@/lib/conciliation/statusUtils'
import type { InterchangeRecord } from '@/services/types/brandDetail.types'
import TransactionsTable from './TransactionsTable'

export interface InterchangeDetailModalProps {
  open: boolean
  record: InterchangeRecord | null
  onClose: () => void
}

/**
 * Drawer lateral com o detalhe de transações de um IRD/group_code.
 * Carrega via `useInterchangeDetail(consolidationId)` quando aberto.
 *
 * Estrutura:
 *  - Card de sumário (TPV, ITC, transações; capture × outgoing)
 *  - Collapse "Transações divergentes" (se houver)
 *  - Collapse "Transações conciliadas"
 *
 * Espelha `InterchangeDetailModal` do branch LGR-264-recon-acquirer.
 */
export default function InterchangeDetailModal({ open, record, onClose }: InterchangeDetailModalProps) {
  const { data, loading, error } = useInterchangeDetail(record?.consolidationId ?? null, open)
  const [openSection, setOpenSection] = useState<'divergent' | 'conciliated' | null>('divergent')

  const fullyReconciled = isFullyReconciled(data?.consolidationRate)
  const summaryBg = fullyReconciled ? '#F6FFED' : '#FFFBE6'
  const summaryColor = fullyReconciled ? '#237804' : '#874D00'

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={720}
      placement="right"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Detalhe da conciliação</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
              IRD <span style={{ fontFamily: 'Roboto Mono' }}>{record?.interchangeCode ?? '—'}</span>
            </div>
          </div>
        </div>
      }
      closable
      styles={{ body: { padding: '20px 24px', background: '#F7F8FA' } }}
    >
      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
          Carregando transações…
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13 }}>
          Erro ao carregar detalhes: {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Summary card */}
          <div style={{
            background: summaryBg,
            border: `1px solid ${fullyReconciled ? '#B7EB8F' : '#FFE58F'}`,
            borderRadius: 2,
            padding: '14px 18px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Tag status={fullyReconciled ? 'Reconciliado' : 'Divergência'} />
              <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                Taxa de conciliação:{' '}
                <strong style={{ color: summaryColor }}>{data.consolidationRate.toFixed(2)}%</strong>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SourcePanel title="Incoming (capture)" summary={data.sourceA} />
              <SourcePanel title="Outgoing (registradora)" summary={data.sourceB} divider />
            </div>
          </div>

          {/* Collapse — Divergentes (se houver) */}
          {data.nonConciliatedTransactions.length > 0 && (
            <Section
              title="Transações divergentes"
              count={data.nonConciliatedTransactions.length}
              tone="warning"
              open={openSection === 'divergent'}
              onToggle={() => setOpenSection(s => s === 'divergent' ? null : 'divergent')}
            >
              <TransactionsTable
                variant="non-conciliated"
                transactions={data.nonConciliatedTransactions}
              />
            </Section>
          )}

          {/* Collapse — Conciliadas */}
          <Section
            title="Transações conciliadas"
            count={data.conciliatedTransactions.length}
            tone="success"
            open={openSection === 'conciliated'}
            onToggle={() => setOpenSection(s => s === 'conciliated' ? null : 'conciliated')}
          >
            <TransactionsTable
              variant="conciliated"
              transactions={data.conciliatedTransactions}
            />
          </Section>
        </>
      )}
    </Drawer>
  )
}

interface SourcePanelProps {
  title: string
  summary: { transactionCount: number; tpv: number; itc: number }
  divider?: boolean
}

function SourcePanel({ title, summary, divider }: SourcePanelProps) {
  return (
    <div style={{
      paddingLeft: divider ? 14 : 0,
      borderLeft: divider ? '1px solid rgba(0,0,0,0.1)' : undefined,
    }}>
      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginBottom: 6 }}>{title}</div>
      <Stat label="Transações" value={summary.transactionCount.toLocaleString('pt-BR')} />
      <Stat label="TPV" value={formatCurrency(summary.tpv)} />
      <Stat label="ITC" value={formatCurrency(summary.itc)} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
      <span style={{ color: 'rgba(0,0,0,0.65)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{value}</span>
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
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
      <button onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Roboto', textAlign: 'left',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{title}</span>
          <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{count} {count === 1 ? 'transação' : 'transações'}</span>
        </div>
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={14} color="rgba(0,0,0,0.45)" />
      </button>
      {open && <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 16px', background: '#fafafa' }}>{children}</div>}
    </div>
  )
}
