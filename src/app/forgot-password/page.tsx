'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SendEmailStep from '@/components/auth/SendEmailStep'
import VerifyCodeStep from '@/components/auth/VerifyCodeStep'
import RedefinePasswordStep from '@/components/auth/RedefinePasswordStep'
import { useForgotPasswordStore } from '@/store/forgotPassword.store'
import {
  sendPasswordRecoveryCode,
  verifyPasswordRecoveryCode,
  redefinePassword,
} from '@/services/authService'
import { ApiError, apiMode } from '@/services/apiClient'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { state, email, code, setState, setEmail, setCode, reset } = useForgotPasswordStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onApiError = (err: unknown, fallback: string) => {
    if (err instanceof ApiError && typeof err.body === 'object' && err.body && 'message' in err.body) {
      setError(String((err.body as { message: unknown }).message))
    } else if (err instanceof Error) {
      setError(err.message)
    } else {
      setError(fallback)
    }
  }

  const handleSendEmail = async (newEmail: string) => {
    setError(null)
    setLoading(true)
    try {
      await sendPasswordRecoveryCode(newEmail)
      setEmail(newEmail)
      setState('verify-code')
    } catch (err) {
      onApiError(err, 'Não foi possível enviar o código.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (newCode: string) => {
    setError(null)
    setLoading(true)
    try {
      await verifyPasswordRecoveryCode(email, newCode)
      setCode(newCode)
      setState('update-password')
    } catch (err) {
      onApiError(err, 'Código inválido.')
    } finally {
      setLoading(false)
    }
  }

  const handleRedefine = async ({ newPassword }: { newPassword: string }) => {
    setError(null)
    setLoading(true)
    try {
      await redefinePassword(email, code, newPassword)
      reset()
      router.replace('/login?reset=ok')
    } catch (err) {
      onApiError(err, 'Não foi possível redefinir a senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#F2F4F8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: 104, background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo-tupi.svg" alt="TUPI" style={{ height: 28, display: 'block' }} />
          <span style={{ fontSize: 12, background: 'rgba(114,46,209,0.1)', color: '#722ED1', border: '1px solid #b37feb', borderRadius: 2, padding: '1px 8px', fontWeight: 500 }}>Sub-adquirente</span>
        </div>
        {apiMode === 'mock' && (
          <span style={{ fontSize: 11, background: '#FFFBE6', color: '#874D00', border: '1px solid #FFE58F', borderRadius: 2, padding: '2px 8px', fontWeight: 500 }}>
            Modo demo — código: 123456
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {state === 'send-code' && (
          <SendEmailStep
            initialEmail={email}
            loading={loading}
            error={error}
            onSubmit={handleSendEmail}
            onCancel={() => router.replace('/login')}
          />
        )}
        {state === 'verify-code' && (
          <VerifyCodeStep
            email={email}
            loading={loading}
            error={error}
            onSubmit={handleVerifyCode}
            onResend={() => handleSendEmail(email)}
            onBack={() => { setError(null); setState('send-code') }}
          />
        )}
        {state === 'update-password' && (
          <RedefinePasswordStep
            loading={loading}
            error={error}
            onSubmit={handleRedefine}
            onBack={() => { setError(null); setState('verify-code') }}
          />
        )}
      </div>

      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
        <span>© 2025 TUPI — Todos os direitos reservados</span>
      </div>
    </div>
  )
}
