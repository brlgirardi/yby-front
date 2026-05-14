'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding.tsx
// Página dedicada de Onboarding de EC — 3 modos:
//   - create: /merchants/novo                          → Cancelar / Salvar / Avançar
//   - view:   /merchants/[id]                          → Sair / Editar (primary)
//   - edit:   /merchants/[id]?edit=1                   → Cancelar / Salvar (primary)
// Botões duplicados header + footer (sincronizados).

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, message } from 'antd'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import DetalhesEC from './tabs/DetalhesEC'
import CanaisTab from './tabs/CanaisTab'
import TerminaisTab from './tabs/TerminaisTab'
import { emptyForm, validateMerchantForm, type MerchantFormData, type OnboardingTab } from './types'
import { createMerchant, updateMerchant } from '@/services/organizationService'

export type OnboardingMode = 'create' | 'view' | 'edit'

interface MerchantOnboardingProps {
  mode?: OnboardingMode
  /** Dados iniciais (para view/edit). Quando omitido, usa emptyForm. */
  initialForm?: MerchantFormData
  /** ID do EC carregado — exibido no título quando em view/edit. */
  merchantId?: string
}

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

export default function MerchantOnboarding({
  mode = 'create',
  initialForm,
  merchantId,
}: MerchantOnboardingProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OnboardingTab>('detalhes')
  const [form, setForm] = useState<MerchantFormData>(initialForm ?? emptyForm)
  const isView = mode === 'view'
  const isEdit = mode === 'edit'
  const isCreate = mode === 'create'

  // Em edit, detecta dirty (formulário diferente do snapshot inicial).
  const dirty = useMemo(() => {
    if (!isEdit || !initialForm) return false
    return JSON.stringify(form) !== JSON.stringify(initialForm)
  }, [form, initialForm, isEdit])

  function goToList() {
    router.push('/merchants')
  }

  function handleCancelCreate() {
    goToList()
  }

  const [saving, setSaving] = useState(false)

  async function handleSaveCreate() {
    if (saving) return
    const errors = validateMerchantForm(form)
    if (errors.length > 0) {
      // Pula pra primeira tab que tem erro pra usuário enxergar o campo.
      const hasDadosError = errors.some((e) =>
        ['cnpj', 'razaoSocial', 'mcc', 'cep', 'estado', 'cidade', 'endereco', 'numero'].includes(e.field),
      )
      const hasCanaisError = errors.some((e) => e.field.startsWith('canais.'))
      if (hasDadosError) setActiveTab('detalhes')
      else if (hasCanaisError) setActiveTab('canais')
      message.error(errors[0].message)
      return
    }
    setSaving(true)
    try {
      const created = await createMerchant(form)
      message.success('Estabelecimento criado')
      router.push(`/merchants/${created.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar estabelecimento'
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  async function handleAdvance() {
    const next = NEXT_TAB[activeTab]
    if (next) {
      setActiveTab(next)
      return
    }
    await handleSaveCreate()
  }

  function handleEditClick() {
    if (merchantId) router.push(`/merchants/${merchantId}?edit=1`)
  }

  async function handleSaveEdit() {
    if (!merchantId) {
      goToList()
      return
    }
    if (saving) return
    setSaving(true)
    try {
      await updateMerchant(merchantId, form)
      message.success('Alterações salvas')
      router.push(`/merchants/${merchantId}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar alterações'
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    if (!dirty) {
      if (merchantId) router.push(`/merchants/${merchantId}`)
      else goToList()
      return
    }
    Modal.confirm({
      title: 'Descartar alterações?',
      content: 'Os dados editados não serão salvos.',
      okText: 'Descartar alterações',
      okButtonProps: { danger: true },
      cancelText: 'Continuar editando',
      onOk: () => {
        setForm(initialForm ?? emptyForm)
        if (merchantId) router.push(`/merchants/${merchantId}`)
        else goToList()
      },
    })
  }

  function handleExitView() {
    goToList()
  }

  const isLastTab = NEXT_TAB[activeTab] === null
  const advanceLabel = isLastTab ? 'Concluir' : 'Avançar'

  const actions = (() => {
    if (isCreate) {
      return (
        <>
          <Button variant="secondary" onClick={handleCancelCreate}>Cancelar</Button>
          <Button variant="secondary" onClick={handleSaveCreate}>Salvar</Button>
          <Button variant="primary" onClick={handleAdvance}>{advanceLabel}</Button>
        </>
      )
    }
    if (isEdit) {
      return (
        <>
          <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Salvar</Button>
        </>
      )
    }
    // view
    return (
      <>
        <Button variant="secondary" onClick={handleExitView}>Sair</Button>
        <Button variant="primary" onClick={handleEditClick}>Editar</Button>
      </>
    )
  })()

  const title = (() => {
    if (isCreate) return 'Novo estabelecimento'
    return form.razaoSocial || merchantId || 'Estabelecimento'
  })()

  const modeTag = isView ? 'Visualizando' : isEdit ? 'Editando' : null

  const breadcrumb = isCreate
    ? 'Sub-adquirente / Estabelecimentos / Novo'
    : `Sub-adquirente / Estabelecimentos / ${isEdit ? 'Editar' : 'Visualizar'}`

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fafafa' }}>
      <PageHeader
        title={title}
        breadcrumb={breadcrumb}
        onBack={() => goToList()}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as OnboardingTab)}
        extra={
          <>
            {modeTag && (
              <span style={{
                fontSize: 12,
                color: isEdit ? '#1890ff' : 'rgba(0,0,0,0.45)',
                background: isEdit ? '#e6f4ff' : '#f5f5f5',
                border: `1px solid ${isEdit ? '#91d5ff' : '#d9d9d9'}`,
                borderRadius: 2,
                padding: '2px 8px',
                marginRight: 8,
              }}>
                {modeTag}
              </span>
            )}
            {actions}
          </>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeTab === 'detalhes' && (
          <DetalhesEC
            form={form}
            onChange={setForm}
            readonly={isView}
          />
        )}
        {activeTab === 'canais' && (
          <CanaisTab form={form} onChange={setForm} readonly={isView} />
        )}
        {activeTab === 'terminais' && (
          <TerminaisTab form={form} onChange={setForm} readonly={isView} />
        )}
      </div>
    </div>
  )
}
