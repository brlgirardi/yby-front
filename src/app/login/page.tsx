'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { useAuthStore } from '@/store/auth.store'
import { usePrefsStore } from '@/store/prefs.store'
import { login } from '@/services/authService'
import { ApiError, apiMode } from '@/services/apiClient'

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/dashboard'
  const setAccessToken = useAuthStore(s => s.setAccessToken)
  const setUser = useAuthStore(s => s.setUser)
  const setFirstAccess = useAuthStore(s => s.setFirstAccess)

  // Status quo (Enviesados, cap. 5): pré-preenche último e-mail usado.
  // Privacidade: senha NUNCA é persistida; apenas o e-mail.
  const lastLoginEmail = usePrefsStore(s => s.lastLoginEmail)
  const setLastLoginEmail = usePrefsStore(s => s.setLastLoginEmail)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setError(null)
    if (!email || !password) {
      setError('Preencha e-mail e senha.')
      return
    }
    setLoading(true)
    try {
      const res = await login({ email, password })
      setAccessToken(res.accessToken)
      setUser(res.user)
      // Persiste só após login bem-sucedido (evita salvar typo)
      setLastLoginEmail(email)
      if (res.isFirstAccess) {
        setFirstAccess(res.user.email, true)
        router.push('/redefine-temporary-password')
      } else {
        router.push(decodeURIComponent(nextUrl))
      }
    } catch (err) {
      const msg = err instanceof ApiError
        ? (typeof err.body === 'object' && err.body && 'message' in err.body
            ? String((err.body as { message: unknown }).message)
            : err.message)
        : 'Falha ao entrar. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginForm
      loading={loading}
      error={error}
      showDemoBadge={apiMode === 'mock'}
      initialEmail={lastLoginEmail}
      onSubmit={handleLogin}
    />
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}
