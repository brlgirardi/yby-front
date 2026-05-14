'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding.tsx
// Página dedicada de Onboarding de Estabelecimento Comercial (EC).
// Layout padrão DS Yby: PageHeader com tabs integradas + cards brancos no conteúdo.
// Cancelar/Salvar globais ficam no header (não há ações por card).

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import DetalhesEC from './tabs/DetalhesEC'
import CanaisPlaceholder from './tabs/CanaisPlaceholder'
import TerminaisPlaceholder from './tabs/TerminaisPlaceholder'
import { emptyForm, type MerchantFormData, type OnboardingTab } from './types'

const TABS: { key: OnboardingTab; label: string }[] = [
  { key: 'detalhes', label: 'Detalhes do EC' },
  { key: 'canais', label: 'Canais' },
  { key: 'terminais', label: 'Terminais' },
]

export default function MerchantOnboarding() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OnboardingTab>('detalhes')
  const [form, setForm] = useState<MerchantFormData>(emptyForm)

  function handleCancel() {
    router.push('/merchants')
  }

  function handleSaveGlobal() {
    router.push('/merchants')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fafafa' }}>
      <PageHeader
        title="Novo estabelecimento"
        breadcrumb="Sub-adquirente / Estabelecimentos / Novo"
        onBack={() => router.push('/merchants')}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as OnboardingTab)}
        extra={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveGlobal}>
              Salvar
            </Button>
          </>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeTab === 'detalhes' && <DetalhesEC form={form} onChange={setForm} />}
        {activeTab === 'canais' && <CanaisPlaceholder />}
        {activeTab === 'terminais' && <TerminaisPlaceholder />}
      </div>
    </div>
  )
}
