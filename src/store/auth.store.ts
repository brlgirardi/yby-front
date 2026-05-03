'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/services/types/auth.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoggedIn: boolean
  firstAccess: { userEmail: string | null; isFirstAccess: boolean }
  setAccessToken: (token: string | null) => void
  setFirstAccess: (userEmail: string | null, isFirstAccess: boolean) => void
  setUser: (user: User | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      firstAccess: { userEmail: null, isFirstAccess: false },
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setFirstAccess: (userEmail, isFirstAccess) =>
        set({ firstAccess: { userEmail, isFirstAccess } }),
      clearAuth: () => set({ accessToken: null, isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
