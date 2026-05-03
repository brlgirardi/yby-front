'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RedefinePasswordStep from '@/components/auth/RedefinePasswordStep'
import { useAuthStore } from '@/store/auth.store'
import { redefineTemporaryPassword } from '@/services/authService'
import { ApiError, apiMode } from '@/services/apiClient'

/**
 * Tela exibida no primeiro acesso (Tupi: redefine-temporary-password).
 * Quando login retorna `isFirstAccess=true`, o usuário é redirecionado pra cá
 * para trocar a senha temporária antes de prosseguir.
 */
export default function RedefineTemporaryPasswordPage() {
  const router = useRouter()
  const firstAccess = useAuthStore(s => s.firstAccess)
  const setFirstAccess = useAuthStore(s => s.setFirstAccess)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async ({ currentPassword, newPassword }: { currentPassword?: string; newPassword: string }) => {
    setError(null)
    if (!currentPassword) {
      setError('Senha atual é obrigatória.')
      return
    }
    setLoading(true)
    try {
      await redefineTemporaryPassword(currentPassword, newPassword)
      setFirstAccess(null, false)
      router.replace('/dashboard')
    } catch (err) {
      const msg = err instanceof ApiError && typeof err.body === 'object' && err.body && 'message' in err.body
        ? String((err.body as { message: unknown }).message)
        : 'Não foi possível redefinir a senha.'
      setError(msg)
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
            Modo demo — qualquer senha atual + nova ≥ 8 chars (diferente)
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RedefinePasswordStep
          requireCurrentPassword
          title="Primeiro acesso"
          subtitle={firstAccess.userEmail
            ? `Bem-vindo, ${firstAccess.userEmail}. Defina uma nova senha para continuar.`
            : 'Defina uma nova senha para continuar.'}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>

      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
        <span>© 2025 TUPI — Todos os direitos reservados</span>
      </div>
    </div>
  )
}
