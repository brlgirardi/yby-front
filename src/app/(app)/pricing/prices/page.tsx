'use client'

import { useMemo, useState } from 'react'
import { App, Button, Spin, Typography } from 'antd'
import { ArrowLeft, Inbox } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import ChannelPriceSection, { CHANNELS } from '@/components/pricing/ChannelPriceSection'
import { ACQUIRER_NAMES, getAcquirerDisplayName, usePricingData } from '@/hooks/pricing/usePricingData'

const { Text } = Typography

const PRICING_TABS = [
  { key: 'costs', label: 'Custos', href: '/pricing/costs' },
  { key: 'prices', label: 'Preços', href: '/pricing/prices' },
  { key: 'interchange', label: 'Matriz de Intercâmbio', href: '/pricing/interchange' },
]

function PricesPageInner() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const { message } = App.useApp()
  const { installments, costItems, priceTables, priceItems, loading } = usePricingData()
  const [saving, setSaving] = useState(false)

  const acquirerIds = useMemo(() => {
    const ids = new Set<string>()
    priceTables.forEach(t => ids.add(t.acquirer_id))
    costItems.forEach(c => ids.add(c.acquirer_id))
    return Array.from(ids)
  }, [priceTables, costItems])

  const acquirerNames = useMemo(() => {
    const map: Record<string, string> = { ...ACQUIRER_NAMES }
    acquirerIds.forEach(id => { map[id] = getAcquirerDisplayName(id) })
    return map
  }, [acquirerIds])

  const showEmpty = !loading && priceTables.length === 0 && costItems.length === 0

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    message.success('Preços salvos (modo demo — nada gravado).')
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Preços por Adquirente"
        breadcrumb="Configuração / Pricing"
        tabs={PRICING_TABS.map(t => ({ key: t.key, label: t.label }))}
        activeTab={pathname.endsWith('/costs') ? 'costs' : pathname.endsWith('/prices') ? 'prices' : 'interchange'}
        onTabChange={key => {
          const tab = PRICING_TABS.find(t => t.key === key)
          if (tab) router.push(tab.href)
        }}
        extra={!loading ? (
          <>
            <Button onClick={() => router.back()} style={{ borderRadius: 0 }}>Cancelar</Button>
            <Button type="primary" loading={saving} onClick={handleSave} style={{ borderRadius: 0, background: '#1890FF', borderColor: '#1890FF' }}>Salvar</Button>
          </>
        ) : (
          <Button type="text" icon={<ArrowLeft size={16} />} onClick={() => router.back()} />
        )}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#fff', padding: 24 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        )}

        {showEmpty && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <Inbox size={48} color="#d9d9d9" style={{ marginBottom: 16 }} />
            <Text style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>
              Configure os custos primeiro para definir preços.
            </Text>
            <Button type="primary" onClick={() => router.push('/pricing/costs')} style={{ borderRadius: 0, background: '#1890FF', borderColor: '#1890FF' }}>
              Ir para Custos
            </Button>
          </div>
        )}

        {!loading && !showEmpty && CHANNELS.map(channel => (
          <ChannelPriceSection
            key={channel.id}
            channel={channel}
            tables={priceTables}
            acquirerIds={acquirerIds}
            acquirerNames={acquirerNames}
            costItems={costItems}
            priceItems={priceItems}
            installments={installments}
          />
        ))}
      </div>
    </div>
  )
}

export default function PricesPage() {
  return (
    <App>
      <PricesPageInner />
    </App>
  )
}
