'use client'

import { useMemo, useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import KpiCard from '@/components/ui/KpiCard'
import AcquirerCostCard from '@/components/pricing/AcquirerCostCard'
import { usePricingData, getAcquirerDisplayName } from '@/hooks/pricing/usePricingData'
import type { Channel } from '@/services/types/pricing.types'
import { CHANNEL_LABELS } from '@/services/types/pricing.types'
import { useRouter, usePathname } from 'next/navigation'

const PRICING_TABS = [
  { key: 'costs', label: 'Custos', href: '/pricing/costs' },
  { key: 'prices', label: 'Preços', href: '/pricing/prices' },
  { key: 'interchange', label: 'Matriz de Intercâmbio', href: '/pricing/interchange' },
]

export default function CostsPage() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const { installments, costTables, costItems, loading, error } = usePricingData()

  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all')
  const [acquirerFilter, setAcquirerFilter] = useState<string>('all')

  const filteredTables = useMemo(() => {
    return costTables.filter(t => {
      if (channelFilter !== 'all' && t.channel !== channelFilter) return false
      if (acquirerFilter !== 'all' && t.acquirer_id !== acquirerFilter) return false
      return true
    })
  }, [costTables, channelFilter, acquirerFilter])

  const acquirers = Array.from(new Set(costTables.map(t => t.acquirer_id)))
  const totalActive = costTables.filter(t => t.is_active).length
  const avgRate = costItems.length
    ? costItems.reduce((a, c) => a + c.rate, 0) / costItems.length
    : 0
  const totalConfigs = costItems.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Custos do sub-adquirente"
        breadcrumb="Configuração / Pricing"
        tabs={PRICING_TABS.map(t => ({ key: t.key, label: t.label }))}
        activeTab={pathname.endsWith('/costs') ? 'costs' : pathname.endsWith('/prices') ? 'prices' : 'interchange'}
        onTabChange={key => {
          const tab = PRICING_TABS.find(t => t.key === key)
          if (tab) router.push(tab.href)
        }}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: '16px 24px' }}>
        <div style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'rgba(0,0,0,0.85)' }}>
          <strong>Cost Blueprint:</strong> tabelas de custos cobrados pelos adquirentes do sub. Cada
          linha (Cost Item) representa uma combinação de bandeira × produto × parcelamento. O modelo
          pode ser <strong>MDR</strong> (taxa única) ou <strong>Interchange+</strong> (custo +
          spread). Estes custos alimentam a tabela de preços vendidos aos ECs.
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <KpiCard
            label="Tabelas ativas"
            value={`${totalActive}/${costTables.length}`}
            subLabel="Cost Blueprint Tables"
            variant="info"
            tooltip="Quantidade de tabelas de custo ativas vs total."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Adquirentes"
            value={String(acquirers.length)}
            subLabel={acquirers.map(a => getAcquirerDisplayName(a)).join(', ')}
            variant="neutral"
            tooltip="Adquirentes com custos configurados."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Total de itens"
            value={String(totalConfigs)}
            subLabel="Cost Items"
            variant="info"
            tooltip="Total de linhas de custo entre todas as bandeiras × produtos × parcelamentos."
            loading={loading}
            style={{ flex: 1, minWidth: 180 }}
          />
          <KpiCard
            label="Taxa média"
            value={`${avgRate.toFixed(2).replace('.', ',')}%`}
            subLabel="custo médio"
            variant="success"
            tooltip="Média aritmética simples das taxas de custo (não ponderada por volume)."
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
            {filteredTables.length} de {costTables.length} tabelas
          </span>
        </div>

        {error && <div style={{ padding: 12, background: '#FFF1F0', color: '#820014', fontSize: 13, marginBottom: 16 }}>Erro: {error}</div>}
        {loading && <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Carregando custos…</div>}

        {filteredTables.map(t => (
          <AcquirerCostCard
            key={t.id}
            acquirerId={t.acquirer_id}
            acquirerName={getAcquirerDisplayName(t.acquirer_id)}
            channel={t.channel}
            isActive={t.is_active}
            costItems={costItems.filter(c => c.acquirer_id === t.acquirer_id)}
            installments={installments}
          />
        ))}

        {!loading && filteredTables.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
            Nenhuma tabela de custo corresponde aos filtros.
          </div>
        )}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(0,0,0,0.65)' }
const sel: React.CSSProperties = { border: '1px solid #d9d9d9', borderRadius: 2, padding: '4px 8px', fontSize: 12, fontFamily: 'Roboto', background: '#fff', maxWidth: 220 }
