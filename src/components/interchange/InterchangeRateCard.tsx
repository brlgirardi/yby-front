'use client'

import { useEffect, useState } from 'react'
import BrandLogo from '@/components/shared/BrandLogo'
import Icon from '@/components/shared/Icon'
import Loading from '@/components/shared/Loading'
import Tag from '@/components/shared/Tag'
import { fetchInterchangeRates } from '@/services/interchangeRateService'
import type { InterchangeRateBrandSummary, InterchangeRateRecord } from '@/services/types/interchangeRate.types'

export interface InterchangeRateCardProps {
  brand: InterchangeRateBrandSummary
}

/**
 * Card colapsável da matriz de intercâmbio para uma bandeira.
 * Quando expandido, faz fetch das taxas e mostra a matriz (tabela).
 *
 * Vocabulário Tupi:
 *  - Card brand × type (Doméstico/Internacional)
 *  - Card tier (Standard/Premium/Corporate)
 *  - Person type (PF/PJ)
 *  - Card product (Crédito/Débito/Pré-pago)
 *  - Card entry (Chip/Contactless/Magnético)
 *  - Sector (E-commerce/Corporativo/Governo)
 *  - Rate (taxa em %) + fixed fee (taxa fixa por transação)
 */
export default function InterchangeRateCard({ brand }: InterchangeRateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [rates, setRates] = useState<InterchangeRateRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!expanded || rates.length > 0) return
    setLoading(true)
    fetchInterchangeRates(brand.brand)
      .then(setRates)
      .finally(() => setLoading(false))
  }, [expanded, brand.brand, rates.length])

  const productTypes = Array.from(new Set(rates.map(r => r.cardProduct)))
  const [activeProduct, setActiveProduct] = useState<string | null>(null)
  useEffect(() => {
    if (!activeProduct && productTypes.length > 0) setActiveProduct(productTypes[0])
  }, [productTypes, activeProduct])

  const visibleRates = activeProduct ? rates.filter(r => r.cardProduct === activeProduct) : rates

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      marginBottom: 12,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', background: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Roboto', textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BrandLogo brand={brand.brand} size={28} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{brand.brand}</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{brand.configs} configurações</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar" size={12} /> Atualizado em {brand.updatedAt}
          </span>
          <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={14} />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa', padding: '14px 20px' }}>
          {loading && <Loading message="Carregando taxas…" paddingY={30} />}

          {!loading && productTypes.length > 0 && (
            <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
              {productTypes.map(p => {
                const active = p === activeProduct
                return (
                  <button
                    key={p}
                    onClick={() => setActiveProduct(p)}
                    style={{
                      padding: '6px 18px', border: active ? '1px solid #d9d9d9' : 'none',
                      borderRadius: 0, background: active ? '#fff' : '#f0f0f0',
                      cursor: 'pointer', fontSize: 12,
                      fontWeight: active ? 600 : 500,
                      color: active ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.65)',
                      fontFamily: 'Roboto',
                    }}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          )}

          {!loading && visibleRates.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <th style={th}>Tipo</th>
                    <th style={th}>Tier</th>
                    <th style={th}>PF/PJ</th>
                    <th style={th}>Entrada</th>
                    <th style={th}>Segmento</th>
                    <th style={{ ...th, textAlign: 'right' }}>Taxa</th>
                    <th style={{ ...th, textAlign: 'right' }}>Tarifa fixa</th>
                    <th style={th}>Vigência</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRates.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={td}><Tag status={r.type === 'Doméstico' ? 'Info' : 'Info'} label={r.type} /></td>
                      <td style={td}>{r.cardTier}</td>
                      <td style={td}>{r.personType}</td>
                      <td style={td}>{r.cardEntry}</td>
                      <td style={td}>{r.sector}</td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#1890FF' }}>
                        {r.rate.toFixed(2).replace('.', ',')}%
                      </td>
                      <td style={{ ...td, textAlign: 'right', color: 'rgba(0,0,0,0.65)' }}>
                        {r.fixedFee !== undefined ? `R$ ${r.fixedFee.toFixed(2).replace('.', ',')}` : '—'}
                      </td>
                      <td style={td}>{new Date(r.effectiveDate).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && visibleRates.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
              Nenhuma taxa encontrada para {brand.brand}.
            </div>
          )}
        </div>
      )}
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
