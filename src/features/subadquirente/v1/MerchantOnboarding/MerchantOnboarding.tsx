'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding.tsx
// Página dedicada de Onboarding de Estabelecimento Comercial (EC).
// Layout fiel ao Figma V0:
//   [Sidebar interna 240px] [Área principal: PageHeader + Tabs antd + conteúdo da tab]
//
// Tabs: Detalhes do EC (esta task) | Canais (Fase 2) | Terminais (Fase 3).
// Cancelar/Salvar globais ficam no header. Cada card de Detalhes tem seu próprio salvar local.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs } from 'antd'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import MerchantOnboardingSidebar from './MerchantOnboardingSidebar'
import DetalhesEC from './tabs/DetalhesEC'
import CanaisPlaceholder from './tabs/CanaisPlaceholder'
import TerminaisPlaceholder from './tabs/TerminaisPlaceholder'
import { emptyForm, type MerchantFormData, type OnboardingTab } from './types'

export default function MerchantOnboarding() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OnboardingTab>('detalhes')
  const [form, setForm] = useState<MerchantFormData>(emptyForm)

  function handleCancel() {
    router.push('/merchants')
  }

  function handleSaveGlobal() {
    // Persistência real virá nas próximas fases; por ora apenas retorna à listagem.
    router.push('/merchants')
  }

  function handleExit() {
    router.push('/merchants')
  }

  function handleDelete() {
    setForm(emptyForm)
  }

  function handleSaveDados() {
    // Mock: dados salvos em estado local; backend integrará nas próximas fases.
  }

  function handleSaveEndereco() {
    // Mock: endereço salvo em estado local; backend integrará nas próximas fases.
  }

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, background: '#fff' }}>
      <MerchantOnboardingSidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fafafa' }}>
        <PageHeader
          title="Novo estabelecimento"
          breadcrumb="Sub-adquirente / Estabelecimentos / Novo"
          onBack={() => router.push('/merchants')}
          noBorder
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

        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={(k) => setActiveTab(k as OnboardingTab)}
            aria-label="Etapas do cadastro"
            items={[
              {
                key: 'detalhes',
                label: 'Detalhes do EC',
                children: (
                  <DetalhesEC
                    form={form}
                    onChange={setForm}
                    onExit={handleExit}
                    onDelete={handleDelete}
                    onSaveDados={handleSaveDados}
                    onSaveEndereco={handleSaveEndereco}
                  />
                ),
              },
              {
                key: 'canais',
                label: 'Canais',
                children: <CanaisPlaceholder />,
              },
              {
                key: 'terminais',
                label: 'Terminais',
                children: <TerminaisPlaceholder />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}