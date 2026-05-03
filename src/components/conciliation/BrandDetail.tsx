'use client'

import { useMemo } from 'react'
import BrandLogo from '@/components/shared/BrandLogo'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import Icon from '@/components/shared/Icon'
import KpiCard from '@/components/ui/KpiCard'
import { useAcquirerMismatch } from '@/hooks/conciliation/useAcquirerMismatch'
import { formatCurrency, formatCurrencyShort, normalizeNilValue } from '@/lib/conciliation/formatters'
import { toTagStatus } from '@/lib/conciliation/statusUtils'
import type { BrandData } from '@/services/types/acquirerSummary.types'
import type { DivergentTransactionData } from '@/services/types/brandDetail.types'

export interface BrandDetailProps {
  brand: BrandData
  date: string
  onBack: () => void
}

interface PairedRow {
  capture: DivergentTransactionData | null
  outgoing: DivergentTransactionData | null
}

/**
 * Tela de detalhe de uma conciliação por bandeira (drill-down).
 * Mostra as transações divergentes pareadas: o que está em capture mas não em
 * outgoing (ou vice-versa) e os valores conflitantes (NSU, BIN, IRD, ITC).
 */
export default function BrandDetail({ brand, date, onBack }: BrandDetailProps) {
  const { data, loading, error } = useAcquirerMismatch(date, brand.useConfigId)

  // Pareia capture × outgoing por terminal_id + amount + transaction_date
  const paired: PairedRow[] = useMemo(() => {
    if (!data) return []
    const allCaptures: DivergentTransactionData[] = []
    const allOutgoing: DivergentTransactionData[] = []
    for (const pair of data.divergent_transactions) {
      for (const item of pair) {
        if (item.type === 'capture') allCaptures.push(...item.data)
        else allOutgoing.push(...item.data)
      }
    }
    const rows: PairedRow[] = []
    const usedOutgoing = new Set<number>()
    for (const c of allCaptures) {
      const idx = allOutgoing.findIndex((o, i) =>
        !usedOutgoing.has(i) &&
        o.terminal_id === c.terminal_id &&
        o.amount === c.amount &&
        o.transaction_date === c.transaction_date,
      )
      if (idx >= 0) {
        usedOutgoing.add(idx)
        rows.push({ capture: c, outgoing: allOutgoing[idx] })
      } else {
        rows.push({ capture: c, outgoing: null })
      }
    }
    allOutgoing.forEach((o, i) => {
      if (!usedOutgoing.has(i)) rows.push({ capture: null, outgoing: o })
    })
    return rows
  }, [data])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
      {/* Header com Voltar + identificação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label="Voltar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', padding: '4px 8px 4px 0' }}>
          <Icon name="arrowLeft" size={16} />
        </button>
        <BrandLogo brand={brand.name} size={28} />
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)', textTransform: 'capitalize' }}>
          {brand.name}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>•</span>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{date}</span>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>•</span>
        <Tooltip text={`Use config ID: ${brand.useConfigId}\nConsolidation ID: ${brand.consolidationId}`} bare>
          <span style={{ fontFamily: 'Roboto Mono', fontSize: 11, color: 'rgba(0,0,0,0.45)', borderBottom: '1px dotted rgba(0,0,0,0.25)' }}>
            {brand.useConfigId}
          </span>
        </Tooltip>
        <div style={{ marginLeft: 'auto' }}>
          <Tag status={toTagStatus(brand.status ?? '')} />
        </div>
      </div>

      {/* KPIs comparando capture × outgoing */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <KpiCard
          label="Transações (capture)"
          value={brand.transactions.sourceA.toLocaleString('pt-BR')}
          subLabel="origem A"
          variant="info"
          tooltip="Quantidade de transações registradas pelo sub no fluxo de captura."
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Transações (outgoing)"
          value={brand.transactions.sourceB.toLocaleString('pt-BR')}
          subLabel="origem B"
          variant={brand.transactions.sourceA === brand.transactions.sourceB ? 'info' : 'error'}
          tooltip="Quantidade de transações liquidadas pela registradora (Núclea/CIP/CERC)."
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Volume capture"
          value={formatCurrencyShort(brand.tpv.sourceA)}
          subLabel={formatCurrency(brand.tpv.sourceA)}
          variant="info"
          tooltip="TPV bruto registrado no capture."
          style={{ flex: 1, minWidth: 180 }}
        />
        <KpiCard
          label="Volume outgoing"
          value={formatCurrencyShort(brand.tpv.sourceB)}
          subLabel={formatCurrency(brand.tpv.sourceB)}
          variant={brand.tpv.sourceA === brand.tpv.sourceB ? 'info' : 'error'}
          tooltip="TPV bruto liquidado pela registradora."
          style={{ flex: 1, minWidth: 180 }}
        />
      </div>

      {/* Tabela de transações divergentes */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Transações divergentes</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
              Pareadas por terminal + valor + data. Linhas com {' '}
              <span style={{ color: '#FF4D4F', fontWeight: 500 }}>destaque vermelho</span> indicam ausência em uma das origens.
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{paired.length} linhas</span>
        </div>

        {loading && (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Carregando…</div>
        )}
        {error && (
          <div style={{ padding: '12px 16px', background: '#FFF1F0', color: '#820014', fontSize: 13 }}>{error}</div>
        )}
        {!loading && paired.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
            Nenhuma divergência. Capture e outgoing batem 100%.
          </div>
        )}

        {paired.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  <th style={th}>Terminal</th>
                  <th style={th}>Data</th>
                  <th style={th}>Valor</th>
                  <th style={th}>BIN</th>
                  <th style={{ ...th, color: '#1890FF' }}>IRD capture</th>
                  <th style={{ ...th, color: '#FA8C16' }}>IRD outgoing</th>
                  <th style={{ ...th, textAlign: 'right' }}>ITC calculado</th>
                  <th style={{ ...th, textAlign: 'center' }}>Origem</th>
                </tr>
              </thead>
              <tbody>
                {paired.map((row, i) => {
                  const data = row.capture ?? row.outgoing
                  if (!data) return null
                  const captureIrd = normalizeNilValue(row.capture?.calculated_ird ?? null)
                  const outgoingIrd = normalizeNilValue(row.outgoing?.outgoing_ird ?? null)
                  const onlyIn = !row.capture ? 'outgoing' : !row.outgoing ? 'capture' : 'ambos'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={td}><span style={{ fontFamily: 'Roboto Mono' }}>{data.terminal_id}</span></td>
                      <td style={td}>{new Date(data.transaction_date).toLocaleString('pt-BR')}</td>
                      <td style={td}>{formatCurrency(Number(data.amount))}</td>
                      <td style={td}><span style={{ fontFamily: 'Roboto Mono' }}>{data.bin}</span></td>
                      <td style={{ ...td, color: captureIrd ? '#1890FF' : '#FF4D4F', fontWeight: captureIrd ? 400 : 600 }}>
                        {captureIrd ?? '— ausente'}
                      </td>
                      <td style={{ ...td, color: outgoingIrd ? '#FA8C16' : '#FF4D4F', fontWeight: outgoingIrd ? 400 : 600 }}>
                        {outgoingIrd ?? '— ausente'}
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        {row.capture?.calculated_itc && row.capture.calculated_itc !== '<nil>'
                          ? formatCurrency(Number(row.capture.calculated_itc)) : '—'}
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        {onlyIn === 'ambos'
                          ? <Tag status="Divergência" />
                          : onlyIn === 'capture'
                            ? <Tag status="Mismatch" label="Só captura" />
                            : <Tag status="Mismatch" label="Só outgoing" />}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: 11,
  fontWeight: 500,
  color: 'rgba(0,0,0,0.65)',
}

const td: React.CSSProperties = {
  padding: '10px 14px',
  color: 'rgba(0,0,0,0.85)',
}
