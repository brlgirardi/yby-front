'use client'

import { useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import KpiCard from '@/components/ui/KpiCard'
import AcquirerPriceCard from '@/components/pricing/AcquirerPriceCard'
import { usePricingData, getAcquirerDisplayName } from '@/hooks/pricing/usePricingData'
import type { Channel } from '@/services/types/pricing.types'
import { CHANNEL_LABELS } from '@/services/types/pricing.types'

const PRICING_TABS = [
  { key: 'costs', label: 'Custos', href: '/pricing/costs' },
  { key: 'prices', label: 'Preços', href: '/pricing/prices' },
  { key: 'interchange', label: 'Matriz de Intercâmbio', href: '/pricing/interchange' },
]

export default function PricesPage() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const { installments, costItems, priceTables, priceItems, loading, error } = usePricingData()

  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all')
  const [acquirerFilter, setAcquirerFilter] = useState<string>('all')

  const filteredTables = useMemo(() => priceTables.filter(t => {
    if (channelFilter !== 'all' && t.channel !== channelFilter) return false
    if (acquirerFilter !== 'all' && t.acquirer_id !== acquirerFilter) return false
    return true
  }), [priceTables, channelFilter, acquirerFilter])

  const acquirers = Array.from(new Set(priceTables.map(t => t.acquirer_id)))
  const totalActive = priceTables.filter(t => t.is_active).length
  const avgMargin = priceItems.length ? priceItems.reduce((a, p) => a + p.margin, 0) / priceItems.length : 0
  const avgPrice = priceItems.length ? priceItems.reduce((a, p) => a + p.rate, 0) / priceItems.length : 0
  const avgCost = costItems.length ? costItems.reduce((a, c) => a + c.rate, 0) / costItems.length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Preços vendidos aos ECs"
        breadcrumb="Configuração / Pricing"
        tabs={PRICING_TABS.map(t => ({ key: t.key, label: t.label }))}
        activeTab={pathname.endsWith('/costs') ? 'costs' : pathname.endsWith('/prices') ? 'prices' : 'interchange'}
        onTabChange={key => {
          const tab = PRICING_TABS.find(t => t.key === key)
          if (tab) router.push(tab.href)
        }}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: '16px 24px' }}>
        <div style={{ background: '#F9F0FF', border: '1px solid #D3ADF7', borderRadius: 2, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'rgba(0,0,0,0.85)' }}>
          <strong>Price Blueprint:</strong> tabelas de preços cobrados dos ECs (Estabelecimentos
          Comerciais). Cada Price Item é derivado de um Cost Item somando uma{' '}
          <strong>margem em pontos percentuais</strong> (pp). A margem é a receita do sub. Quanto maior a
          margem, maior a margem operacional, mas menor a competitividade comercial.
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <KpiCard
            label="Tabelas ativas"
            value={`${totalActive}/${priceTables.length}`}
            subLabel="Price Blueprint Tables"
            variant="info"
            tooltip="Tabelas de preços ativas sendo aplicadas aos ECs."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Custo médio"
            value={`${avgCost.toFixed(2).replace('.', ',')}%`}
            subLabel="dos adquirentes"
            variant="neutral"
            tooltip="Taxa média paga aos adquirentes (entrada)."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Margem média"
            value={`+${avgMargin.toFixed(2).replace('.', ',')}pp`}
            subLabel="markup do sub"
            variant="warning"
            tooltip="Margem média aplicada sobre o custo. Pp = pontos percentuais (não percentual sobre custo)."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Preço médio"
            value={`${avgPrice.toFixed(2).replace('.', ',')}%`}
            subLabel="cobrado dos ECs"
            variant="success"
            tooltip="Taxa final média repassada aos ECs (custo + margem)."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
        </div>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '10px 14px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <label style={lbl}>Canal:
            <select value={channelFilter} onChange={e => setChannelFilter(e.target.value as Channel | 'all')} style={sel}>
              <option value="all">Todos</option>
              <option value="cp">{CHANNEL_LABELS.cp}</option>
              <option value="cnp">{CHANNEL_LABELS.cnp}</option>
            </select>
          </label>
          <label style={lbl}>Adquirente:
            <select value={acquirerFilter} onChange={e => setAcquirerFilter(e.target.value)} style={sel}>
              <option value="all">Todos</option>
              {acquirers.map(a => <option key={a} value={a}>{getAcquirerDisplayName(a)}</option>)}
            </select>
          </label>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            {filteredTables.length} de {priceTables.length} tabelas
          </span>
        </div>

        {error && <div style={{ padding: 12, background: '#FFF1F0', color: '#820014', fontSize: 13, marginBottom: 16 }}>Erro: {error}</div>}
        {loading && <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Carregando preços…</div>}

        {filteredTables.map(t => (
          <AcquirerPriceCard
            key={t.id}
            acquirerId={t.acquirer_id}
            acquirerName={getAcquirerDisplayName(t.acquirer_id)}
            channel={t.channel}
            isActive={t.is_active}
            costItems={costItems.filter(c => c.acquirer_id === t.acquirer_id)}
            priceItems={priceItems}
            installments={installments}
          />
        ))}

        {!loading && filteredTables.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
            Nenhuma tabela de preço corresponde aos filtros.
          </div>
        )}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.65)' }
const sel: React.CSSProperties = { border: '1px solid #d9d9d9', borderRadius: 2, padding: '4px 8px', fontSize: 12, fontFamily: 'Roboto', background: '#fff', maxWidth: 220 }
