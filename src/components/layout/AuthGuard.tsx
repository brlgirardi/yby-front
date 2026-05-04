'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import Loading from '@/components/shared/Loading'

/**
 * Guarda client-side para rotas em (app)/*. O token vive em localStorage
 * (Zustand persist) então não há acesso a ele do middleware Next. Antes da
 * hidratação do store, mostramos um placeholder para evitar flash da tela.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const accessToken = useAuthStore(s => s.accessToken)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!accessToken) {
      const next = encodeURIComponent(pathname || '/dashboard')
      router.replace(`/login?next=${next}`)
    }
  }, [hydrated, accessToken, pathname, router])

  if (!hydrated || !accessToken) {
    return (
      <div style={{ width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F2F4F8' }}>
        <Loading size="large" />
      </div>
    )
  }

  return <>{children}</>
}
