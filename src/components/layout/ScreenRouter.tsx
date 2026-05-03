'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useNavStore, type Screen } from '@/store/nav.store'

const SCREEN_ROUTES: Record<Screen, string> = {
  dashboard: '/dashboard',
  merchants: '/merchants',
  transactions: '/transactions',
  agenda: '/agenda',
  financial: '/financial',
  pricing: '/pricing',
  reconciliation: '/reconciliation',
  users: '/users',
  settings: '/settings',
}

export default function ScreenRouter() {
  const screen = useNavStore((s) => s.screen)
  const setScreen = useNavStore((s) => s.setScreen)
  const router = useRouter()
  const pathname = usePathname()
  const prevScreen = useRef(screen)

  // Sync store → router when store changes
  useEffect(() => {
    if (prevScreen.current !== screen) {
      prevScreen.current = screen
      const route = SCREEN_ROUTES[screen]
      if (route && pathname !== route) {
        router.push(route)
      }
    }
  }, [screen, pathname, router])

  // Sync router → store on direct URL navigation
  useEffect(() => {
    const matched = (Object.entries(SCREEN_ROUTES) as [Screen, string][]).find(([, route]) => pathname === route)
    if (matched && matched[0] !== screen) {
      setScreen(matched[0])
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
