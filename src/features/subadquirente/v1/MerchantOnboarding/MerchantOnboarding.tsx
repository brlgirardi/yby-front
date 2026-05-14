'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding.tsx
// Página dedicada de Onboarding de EC.
// Estado CRIAÇÃO: ações Cancelar / Avançar / Salvar duplicadas no header E no footer
// (sincronizadas — facilita uso quando o form é longo).
//
// Avançar = persiste tab atual + muda pra próxima (Canais).
// Salvar = persiste e mantém na tab atual.
// Cancelar = volta pra /merchants.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import DetalhesEC from './tabs/DetalhesEC'
import CanaisTab from './tabs/CanaisTab'
import TerminaisPlaceholder from './tabs/TerminaisPlaceholder'
import { emptyForm, type MerchantFormData, type OnboardingTab } from './types'

const TABS: { key: OnboardingTab; label: string }[] = [
  { key: 'detalhes', label: 'Detalhes do EC' },
  { key: 'canais', label: 'Canais' },
  { key: 'terminais', label: 'Terminais' },
]

const NEXT_TAB: Record<OnboardingTab, OnboardingTab | null> = {
  detalhes: 'canais',
  canais: 'terminais',
  terminais: null,
}

export default function MerchantOnboarding() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OnboardingTab>('detalhes')
  const [form, setForm] = useState<MerchantFormData>(emptyForm)

  function handleCancel() {
    router.push('/merchants')
  }

  function handleSave() {
    // Persistência real virá nas próximas fases.
    router.push('/merchants')
  }

  function handleAdvance() {
    const next = NEXT_TAB[activeTab]
    if (next) {
      setActiveTab(next)
    } else {
      handleSave()
    }
  }

  const isLast = NEXT_TAB[activeTab] === null
  const advanceLabel = isLast ? 'Concluir' : 'Avançar'

  const actions = (
    <>
      <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
      <Button variant="secondary" onClick={handleSave}>Salvar</Button>
      <Button variant="primary" onClick={handleAdvance}>{advanceLabel}</Button>
    </>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fafafa' }}>
      <PageHeader
        title="Novo estabelecimento"
        breadcrumb="Sub-adquirente / Estabelecimentos / Novo"
        onBack={() => router.push('/merchants')}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as OnboardingTab)}
        extra={actions}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeTab === 'detalhes' && (
          <DetalhesEC form={form} onChange={setForm} footerActions={actions} />
        )}
        {activeTab === 'canais' && <CanaisTab form={form} onChange={setForm} readonly={false} />}
        {activeTab === 'terminais' && <TerminaisPlaceholder />}
      </div>
    </div>
  )
}
