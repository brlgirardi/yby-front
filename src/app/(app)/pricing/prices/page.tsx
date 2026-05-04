'use client'

import { useEffect, useMemo, useState } from 'react'
import { App, Button, Typography } from 'antd'
import { Inbox, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import ChannelPriceSection, { CHANNELS } from '@/components/pricing/ChannelPriceSection'
import PricingSkeleton from '@/components/pricing/PricingSkeleton'
import TableTabsBar from '@/components/pricing/TableTabsBar'
import { ACQUIRER_NAMES, getAcquirerDisplayName, usePricingData } from '@/hooks/pricing/usePricingData'
import { usePriceTableTabs } from '@/hooks/pricing/usePriceTableTabs'
import { getPriceItems } from '@/services/pricingService'
import type { PriceItem } from '@/services/types/pricing.types'

const { Text } = Typography

function PricesPageInner() {
  const router = useRouter()
  const { message } = App.useApp()
  const { installments, costItems, priceTables, loading } = usePricingData()
  const [saving, setSaving] = useState(false)

  // Múltiplas tabelas (Tupi pattern)
  const tableTabs = usePriceTableTabs(priceTables)
  const [activePriceItems, setActivePriceItems] = useState<PriceItem[]>([])
  const [loadingTable, setLoadingTable] = useState(false)

  // Carrega PriceItems da tabela ativa quando muda
  useEffect(() => {
    if (!tableTabs.activeId) return
    setLoadingTable(true)
    getPriceItems({ price_blueprint_table_id: tableTabs.activeId })
      .then(setActivePriceItems)
      .finally(() => setLoadingTable(false))
  }, [tableTabs.activeId])

  const acquirerIds = useMemo(() => {
    const ids = new Set<string>()
    costItems.forEach(c => ids.add(c.acquirer_id))
    return Array.from(ids)
  }, [costItems])

  const acquirerNames = useMemo(() => {
    const map: Record<string, string> = { ...ACQUIRER_NAMES }
    acquirerIds.forEach(id => { map[id] = getAcquirerDisplayName(id) })
    return map
  }, [acquirerIds])

  const showEmpty = !loading && costItems.length === 0

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    message.success('Preços salvos (modo demo — nada gravado).')
    setSaving(false)
  }

  const handleSimulate = () => {
    message.info('Simulação ainda não implementada (modo demo).')
  }

  // Header com 2 linhas: linha 1 = breadcrumb/título/extra; linha 2 = abas + Editar
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Tabela de preços"
        breadcrumb="Configuração / Pricing / Preços"
        extra={!loading ? (
          <>
            <Button icon={<Sparkles size={14} />} onClick={handleSimulate}>Simulação</Button>
            <Button onClick={() => router.back()}>Cancelar</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>Salvar</Button>
          </>
        ) : null}
      />

      {/* Linha 2 do header: abas de tabelas */}
      {!loading && !showEmpty && (
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '8px 24px', flexShrink: 0 }}>
          <TableTabsBar
            tabs={tableTabs.tabs}
            activeId={tableTabs.activeId}
            onChangeActive={tableTabs.setActiveId}
            onAdd={tableTabs.addTab}
            onRename={tableTabs.renameTab}
            onDelete={tableTabs.deleteTab}
          />
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: 24 }}>
        {loading && <PricingSkeleton variant="prices" />}

        {showEmpty && (
          <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
            <Inbox size={48} color="#d9d9d9" style={{ marginBottom: 16 }} aria-hidden="true" />
            <Text strong style={{ fontSize: 15, color: 'rgba(0,0,0,0.85)', marginBottom: 6, display: 'block' }}>
              Defina os custos antes de configurar preços
            </Text>
            <Text style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 20, fontSize: 13, display: 'block' }}>
              Os preços vendidos aos ECs são derivados dos custos pagos aos adquirentes (custo + sua
              margem em pontos percentuais). Sem custos configurados, não há base para calcular preços.
            </Text>
            <Button type="primary" onClick={() => router.push('/pricing/costs')} style={{ borderRadius: 0, background: '#1890FF', borderColor: '#1890FF' }}>
              Ir para Custos
            </Button>
          </div>
        )}

        {!loading && !showEmpty && (
          <>
            {/* Banner identificando tabela ativa */}
            {tableTabs.activeId && (
              <div role="status" aria-live="polite" style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
                Editando preços da tabela <strong>{tableTabs.tabs.find(t => t.id === tableTabs.activeId)?.name}</strong>.
                {tableTabs.tabs.length > 1 && ' Você pode alternar entre tabelas pelas abas acima.'}
              </div>
            )}

            {loadingTable ? (
              <PricingSkeleton variant="prices" />
            ) : (
              CHANNELS.map(channel => (
                <ChannelPriceSection
                  key={channel.id}
                  channel={channel}
                  tables={priceTables}
                  acquirerIds={acquirerIds}
                  acquirerNames={acquirerNames}
                  costItems={costItems}
                  priceItems={activePriceItems}
                  installments={installments}
                />
              ))
            )}
          </>
        )}
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
