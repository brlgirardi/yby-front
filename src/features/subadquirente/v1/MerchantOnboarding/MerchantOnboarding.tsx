'use client'
// src/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding.tsx
// Wizard de cadastro de Estabelecimento Comercial (EC) — Sub-adquirente, Fase 1.
// Drawer 640px com 4 steps no header (somente Step 1 ativo nesta fase);
// Steps 2-4 renderizam placeholder com retorno pra Step 1.

import { useState } from 'react'
import Drawer from '@/components/shared/Drawer'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Step1Dados from './steps/Step1Dados'
import { STEPS, emptyForm, step1IsValid, type MerchantFormData, type Step } from './types'

interface MerchantOnboardingProps {
  open: boolean
  onClose: () => void
}

// --- Stepper visual ---
interface StepperProps {
  current: Step
}

function Stepper({ current }: StepperProps) {
  return (
    <ol
      aria-label="Etapas do cadastro"
      style={{
        display: 'flex',
        alignItems: 'center',
        listStyle: 'none',
        margin: 0,
        padding: '12px 0 4px',
        gap: 4,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {STEPS.map((s, i) => {
        const status: 'active' | 'pending' | 'done' =
          s.key === current ? 'active' : s.key < current ? 'done' : 'pending'
        const isLast = i === STEPS.length - 1

        const circleStyle: React.CSSProperties = {
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
          ...(status === 'active'
            ? { background: '#1890FF', color: '#fff', border: '1px solid #1890FF' }
            : status === 'done'
            ? { background: '#52C41A', color: '#fff', border: '1px solid #52C41A' }
            : { background: '#fff', color: 'rgba(0,0,0,0.45)', border: '1px solid #D9D9D9' }),
        }

        const labelStyle: React.CSSProperties = {
          fontSize: 12,
          marginLeft: 8,
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
            style={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : '1 1 auto' }}
          >
            <span style={circleStyle}>
              {status === 'done' ? <Icon name="checkCircle" size={14} color="#fff" /> : s.key}
            </span>
            <span style={labelStyle}>{`${s.key}. ${s.label}`}</span>
            {!isLast && (
              <span
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 1,
                  background: '#D9D9D9',
                  margin: '0 12px',
                  minWidth: 16,
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
function StepPlaceholder({ stepNumber, title, onBack }: { stepNumber: Step; title: string; onBack: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.45)',
        }}
      >
        <Icon name="settings" size={28} />
      </div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
        {`Step ${stepNumber}: ${title}`}
      </h3>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.45)', maxWidth: 360 }}>
        Em construção — disponível em breve. Esta etapa será implementada nas próximas fases.
      </p>
      <Button variant="secondary" size="md" icon="arrowLeft" onClick={onBack}>
        Voltar para Dados
      </Button>
    </div>
  )
}

export default function MerchantOnboarding({ open, onClose }: MerchantOnboardingProps) {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<MerchantFormData>(emptyForm)
  const [showStep1Errors, setShowStep1Errors] = useState(false)

  const canAdvanceStep1 = step1IsValid(form)

  function handleClose() {
    setStep(1)
    setForm(emptyForm)
    setShowStep1Errors(false)
    onClose()
  }

  function handleNext() {
    if (step === 1) {
      if (!canAdvanceStep1) {
        setShowStep1Errors(true)
        return
      }
      setStep(2)
      return
    }
    if (step < 4) setStep((step + 1) as Step)
  }

  const isStep1 = step === 1

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Novo Estabelecimento Comercial"
      width={640}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {!isStep1 && (
              <Button variant="secondary" icon="arrowLeft" onClick={() => setStep(1)}>
                Voltar
              </Button>
            )}
            <Button variant="primary" onClick={handleNext} disabled={isStep1 && !canAdvanceStep1}>
              {step < 4 ? 'Próximo' : 'Concluir'}
            </Button>
          </div>
        </>
      }
    >
      <div
        style={{
          position: 'sticky',
          top: -24,
          marginTop: -24,
          marginLeft: -24,
          marginRight: -24,
          padding: '0 24px 12px',
          background: '#fff',
          borderBottom: '1px solid #F0F0F0',
          zIndex: 2,
        }}
      >
        <Stepper current={step} />
      </div>

      <div style={{ marginTop: 20 }}>
        {step === 1 && (
          <Step1Dados form={form} onChange={setForm} showErrors={showStep1Errors} />
        )}
        {step === 2 && (
          <StepPlaceholder stepNumber={2} title="Tabela de preço" onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <StepPlaceholder stepNumber={3} title="Adquirentes" onBack={() => setStep(1)} />
        )}
        {step === 4 && (
          <StepPlaceholder stepNumber={4} title="Confirmação" onBack={() => setStep(1)} />
        )}
      </div>
    </Drawer>
  )
}
