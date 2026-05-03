'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import InterchangeRateCard from '@/components/interchange/InterchangeRateCard'
import {
  CARD_BRANDS_OPTIONS,
  CARD_PRODUCTS_OPTIONS,
  PJ_PF_OPTIONS,
  CARD_ENTRY_OPTIONS,
  SECTOR_OPTIONS,
  useInterchangeRateFilters,
} from '@/hooks/interchange/useInterchangeRateFilters'
import { fetchInterchangeRateBrandSummary } from '@/services/interchangeRateService'
import type { InterchangeRateBrandSummary } from '@/services/types/interchangeRate.types'

export default function PricingPage() {
  const [brands, setBrands] = useState<InterchangeRateBrandSummary[]>([])
  const [loading, setLoading] = useState(true)
  const { filters, setSearchTerm, setCardBrand, setCardProduct, setPersonType, setCardEntry, setSector } = useInterchangeRateFilters()

  useEffect(() => {
    fetchInterchangeRateBrandSummary().then(b => { setBrands(b); setLoading(false) })
  }, [])

  const filtered = brands.filter(b => {
    if (filters.cardBrand !== 'Todas as bandeiras' && b.brand !== filters.cardBrand) return false
    if (filters.searchTerm && !b.brand.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Matriz de Intercâmbio"
        breadcrumb="Configuração / Pricing"
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: '16px 24px' }}>
        <div style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'rgba(0,0,0,0.85)' }}>
          <strong>Matriz de Intercâmbio:</strong> são as taxas (interchange) cobradas pelas bandeiras
          do sub-adquirente em cada transação. O ITC (Interchange Transaction Cost) é determinado pela
          combinação de bandeira × tipo × tier × produto × entrada × segmento. Estas taxas alimentam
          o cálculo do MDR cobrado dos ECs.
        </div>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '12px 14px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
              <Icon name="search" size={14} color="rgba(0,0,0,0.45)" />
            </span>
            <input
              value={filters.searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar bandeira..."
              style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 10px 5px 30px', fontSize: 13, outline: 'none', fontFamily: 'Roboto' }}
            />
          </div>

          <FilterSelect label="Bandeira" value={filters.cardBrand} onChange={setCardBrand} options={CARD_BRANDS_OPTIONS} />
          <FilterSelect label="Produto" value={filters.cardProduct} onChange={setCardProduct} options={CARD_PRODUCTS_OPTIONS} />
          <FilterSelect label="PF/PJ" value={filters.personType} onChange={setPersonType} options={PJ_PF_OPTIONS} />
          <FilterSelect label="Entrada" value={filters.cardEntry} onChange={setCardEntry} options={CARD_ENTRY_OPTIONS} />
          <FilterSelect label="Segmento" value={filters.sector} onChange={setSector} options={SECTOR_OPTIONS} />

          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            {filtered.length} de {brands.length} bandeiras
          </span>
        </div>

        {loading && <div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>Carregando matriz…</div>}
        {!loading && filtered.map(b => <InterchangeRateCard key={b.id} brand={b} />)}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 13 }}>
            Nenhuma bandeira corresponde aos filtros.
          </div>
        )}
      </div>
    </div>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
      {label}:
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: '4px 8px', fontSize: 12, fontFamily: 'Roboto', outline: 'none', background: '#fff', maxWidth: 180 }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}
