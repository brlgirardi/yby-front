'use client'

import { create } from 'zustand'

/**
 * Estados do fluxo de recuperação de senha — vocabulário Tupi.
 *  - send-code:      o usuário digita o e-mail; sistema envia código por e-mail
 *  - verify-code:    o usuário digita o código de 6 dígitos
 *  - update-password: o usuário define a nova senha
 */
export type PasswordRecoveryState = 'send-code' | 'verify-code' | 'update-password'

interface ForgotPasswordStore {
  state: PasswordRecoveryState
  email: string
  code: string
  setState: (s: PasswordRecoveryState) => void
  setEmail: (e: string) => void
  setCode: (c: string) => void
  reset: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
  state: 'send-code',
  email: '',
  code: '',
  setState: (state) => set({ state }),
  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  reset: () => set({ state: 'send-code', email: '', code: '' }),
}))
