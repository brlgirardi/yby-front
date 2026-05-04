'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { App, Button, Modal, Typography } from 'antd'
import { Info as InfoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import ChannelSection, { CHANNELS } from '@/components/pricing/ChannelSection'
import PricingSkeleton from '@/components/pricing/PricingSkeleton'
import { ACQUIRER_NAMES, getAcquirerDisplayName } from '@/hooks/pricing/usePricingData'
import { getCostBlueprintTables, getInstallments } from '@/services/pricingService'
import type { CardBrand, CostBlueprintTable, Installment, PricingModel } from '@/services/types/pricing.types'
import type { CostRow } from '@/components/pricing/MethodTable'

const { Text } = Typography

function CostsPageInner() {
  const router = useRouter()
  const { message } = App.useApp()

  const [tables, setTables] = useState<CostBlueprintTable[]>([])
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [configuring, setConfiguring] = useState(false)
  const [saveEmptyModalOpen, setSaveEmptyModalOpen] = useState(false)

  const brandDataRef = useRef<Record<string, boolean>>({})
  const brandRowsRef = useRef<Record<string, { pricingType: PricingModel; rows: CostRow[]; acquirerId: string; brand: CardBrand }>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getCostBlueprintTables(), getInstallments()])
      .then(([t, i]) => {
        if (cancelled) return
        setTables(t)
        setInstallments(i)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const acquirerIds = useMemo(() => {
    return tables.length > 0
      ? Array.from(new Set(tables.map(t => t.acquirer_id)))
      : ['adiq']
  }, [tables])

  const acquirerNames = useMemo(() => {
    const map: Record<string, string> = { ...ACQUIRER_NAMES }
    acquirerIds.forEach(id => { map[id] = getAcquirerDisplayName(id) })
    return map
  }, [acquirerIds])

  const handleHasData = (brand: string, hasData: boolean) => {
    brandDataRef.current[brand] = hasData
  }

  const handleDataChange = (brand: CardBrand, acquirerId: string, pricingType: PricingModel, rows: CostRow[]) => {
    brandRowsRef.current[`${acquirerId}-${brand}`] = { pricingType, rows, acquirerId, brand }
  }

  const handleSave = async () => {
    const hasAnyData = Object.values(brandDataRef.current).some(Boolean)
    if (!hasAnyData) {
      setSaveEmptyModalOpen(true)
      return
    }
    await doSave()
  }

  const doSave = async () => {
    setSaving(true)
    try {
      // Read-only/demo: a chamada real seria createBlueprint(items) via BFF
      await new Promise(r => setTimeout(r, 600))
      message.success('Custos salvos (modo demo — nada gravado).')
    } catch {
      message.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const showEmpty = !loading && tables.length === 0 && !configuring
  const showConfig = !loading && (tables.length > 0 || configuring)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Custo por Adquirente"
        breadcrumb="Configuração / Pricing / Custos"
        extra={showConfig ? (
          <>
            <Button onClick={() => configuring ? setConfiguring(false) : router.back()}>Cancelar</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>Salvar</Button>
          </>
        ) : null}
      />

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: 24 }}>
        {loading && <PricingSkeleton variant="costs" />}

        {showEmpty && (
          <EmptyState
            title="Nenhuma tabela de custos cadastrada"
            description={
              <>Cadastre os custos cobrados pelos adquirentes (Adiq, GetNet) para que a Conciliação possa comparar com os valores liquidados pelas registradoras.</>
            }
            action={{ label: 'Configurar custos', onClick: () => setConfiguring(true) }}
          />
        )}

        {showConfig && CHANNELS.map(channel => (
          <ChannelSection
            key={channel.id}
            channel={channel}
            tables={tables}
            acquirerIds={acquirerIds}
            acquirerNames={acquirerNames}
            installments={installments}
            onHasData={handleHasData}
            onDataChange={handleDataChange}
          />
        ))}
      </div>

      <Modal
        open={saveEmptyModalOpen}
        onCancel={() => setSaveEmptyModalOpen(false)}
        footer={null}
        closable={false}
        width={400}
        styles={{ body: { padding: '32px 24px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <InfoIcon size={20} color="#1677ff" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text strong style={{ fontSize: 15 }}>Tabela sem informações</Text>
            <Text style={{ fontSize: 13, color: '#666' }}>
              Sua tabela não possui valores de custos. Deseja salvar assim mesmo?
            </Text>
            <Text style={{ fontSize: 13, color: '#666' }}>
              Sem esses dados, a Reconciliação não será possível.
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
          <Button onClick={() => { setSaveEmptyModalOpen(false); doSave() }}>Salvar</Button>
          <Button type="primary" onClick={() => setSaveEmptyModalOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default function CostsPage() {
  return (
    <App>
      <CostsPageInner />
    </App>
  )
}
