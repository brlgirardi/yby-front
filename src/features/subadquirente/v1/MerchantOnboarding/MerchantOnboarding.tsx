'use client'
// Wizard de cadastro de Estabelecimento Comercial (EC) — Sub-adquirente.
// Página dedicada com stepper horizontal no topo + conteúdo centralizado.
// Navegação por query param ?step=dados|preco|adquirentes|confirmacao.

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Step1Dados from './steps/Step1Dados'
import { STEPS, emptyForm, step1IsValid, type MerchantFormData, type Step } from './types'

// Mapeia slug da URL pro número do step e vice-versa.
const STEP_SLUG: Record<Step, string> = {
  1: 'dados',
  2: 'preco',
  3: 'adquirentes',
  4: 'confirmacao',
}

function slugToStep(slug: string | null): Step {
  if (slug === 'preco') return 2
  if (slug === 'adquirentes') return 3
  if (slug === 'confirmacao') return 4
  return 1
}

// --- Stepper horizontal ---
interface StepperProps {
  current: Step
  onStepClick: (step: Step) => void
}

function HorizontalStepper({ current, onStepClick }: StepperProps) {
  return (
    <ol
      aria-label="Etapas do cadastro"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        listStyle: 'none',
        margin: 0,
        padding: '20px 24px',
        gap: 0,
        maxWidth: 720,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {STEPS.map((s, i) => {
        const status: 'active' | 'pending' | 'done' =
          s.key === current ? 'active' : s.key < current ? 'done' : 'pending'
        const isLast = i === STEPS.length - 1
        const canClick = status === 'done'

        const circleStyle: React.CSSProperties = {
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          cursor: canClick ? 'pointer' : 'default',
          transition: 'all 150ms ease',
          ...(status === 'active'
            ? { background: '#1890FF', color: '#fff', border: '1px solid #1890FF' }
            : status === 'done'
            ? { background: '#52C41A', color: '#fff', border: '1px solid #52C41A' }
            : { background: '#fff', color: 'rgba(0,0,0,0.45)', border: '1px solid #D9D9D9' }),
        }

        const labelStyle: React.CSSProperties = {
          display: 'block',
          marginTop: 8,
          fontSize: 12,
          textAlign: 'center',
          color:
            status === 'active'
              ? 'rgba(0,0,0,0.85)'
              : status === 'done'
              ? 'rgba(0,0,0,0.65)'
              : 'rgba(0,0,0,0.45)',
          fontWeight: status === 'active' ? 600 : 400,
          whiteSpace: 'nowrap',
        }

        return (
          <li
            key={s.key}
            aria-current={status === 'active' ? 'step' : undefined}
            aria-disabled={status === 'pending'}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: isLast ? '0 0 auto' : '1 1 auto',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <button
                type="button"
                onClick={canClick ? () => onStepClick(s.key) : undefined}
                disabled={!canClick}
                aria-label={`Etapa ${s.key}: ${s.label}`}
                style={{
                  ...circleStyle,
                  padding: 0,
                  border: circleStyle.border,
                  outline: 'none',
                }}
              >
                {status === 'done' ? <Icon name="checkCircle" size={16} color="#fff" /> : s.key}
              </button>
              <span style={labelStyle}>{s.label}</span>
            </div>
            {!isLast && (
              <span
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2,
                  background: status === 'done' ? '#52C41A' : '#E8E8E8',
                  margin: '0 12px',
                  marginBottom: 20, // alinhar com centro do círculo já que label adiciona altura abaixo
                  minWidth: 24,
                  transition: 'background 150ms ease',
                }}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// --- Placeholder reutilizado em Steps 2/3/4 ---
function StepPlaceholder({
  stepNumber,
  title,
  onBack,
}: {
  stepNumber: Step
  title: string
  onBack: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.45)',
        }}
      >
        <Icon name="settings" size={32} />
      </div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
        {`Etapa ${stepNumber}: ${title}`}
      </h3>
      <p style={{ margin: 0, fontSize: 14, color: 'rgba(0,0,0,0.45)', maxWidth: 420 }}>
        Em construção — esta etapa será implementada nas próximas fases.
      </p>
      <Button variant="secondary" size="md" icon="arrowLeft" onClick={onBack}>
        Voltar para Dados
      </Button>
    </div>
  )
}

export default function MerchantOnboarding() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlStep = slugToStep(searchParams.get('step'))

  const [step, setStep] = useState<Step>(urlStep)
  const [form, setForm] = useState<MerchantFormData>(emptyForm)
  const [showStep1Errors, setShowStep1Errors] = useState(false)

  // Sincroniza step com URL quando ela muda (back/forward do browser).
  useEffect(() => {
    setStep(urlStep)
  }, [urlStep])

  const canAdvanceStep1 = step1IsValid(form)
  const isStep1 = step === 1

  function goToStep(next: Step) {
    setStep(next)
    router.replace(`/merchants/novo?step=${STEP_SLUG[next]}`)
  }

  function handleCancel() {
    router.push('/merchants')
  }

  function handleNext() {
    if (step === 1) {
      if (!canAdvanceStep1) {
        setShowStep1Errors(true)
        return
      }
      goToStep(2)
      return
    }
    if (step < 4) goToStep((step + 1) as Step)
  }

  function handleBack() {
    if (step > 1) goToStep((step - 1) as Step)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', background: '#F2F4F8' }}>
      <PageHeader
        title="Novo Estabelecimento Comercial"
        breadcrumb="Sub-adquirente / Merchants / Novo"
        onBack={handleCancel}
      />

      <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0' }}>
        <HorizontalStepper current={step} onStepClick={goToStep} />
      </div>

      <main style={{ flex: 1, overflow: 'auto', padding: '32px 24px 96px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {step === 1 && (
            <Step1Dados form={form} onChange={setForm} showErrors={showStep1Errors} />
          )}
          {step === 2 && (
            <StepPlaceholder stepNumber={2} title="Tabela de preço" onBack={() => goToStep(1)} />
          )}
          {step === 3 && (
            <StepPlaceholder stepNumber={3} title="Adquirentes" onBack={() => goToStep(1)} />
          )}
          {step === 4 && (
            <StepPlaceholder stepNumber={4} title="Confirmação" onBack={() => goToStep(1)} />
          )}
        </div>
      </main>

      <footer
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          borderTop: '1px solid #F0F0F0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Button variant="ghost" onClick={handleCancel}>
          Cancelar
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isStep1 && (
            <Button variant="secondary" icon="arrowLeft" onClick={handleBack}>
              Voltar
            </Button>
          )}
          <Button variant="primary" onClick={handleNext} disabled={isStep1 && !canAdvanceStep1}>
            {step < 4 ? 'Avançar' : 'Concluir'}
          </Button>
        </div>
      </footer>
    </div>
  )
}
