import { apiMode, mockDelay, request, ApiError } from './apiClient'
import type { LoginRequest, LoginResponse, User } from './types/auth.types'

const MOCK_USER: User = {
  name: 'Bruno Girardi',
  email: 'bruno@yby.com.br',
  phone: '+55 11 99999-0000',
  organization: {
    id: 'org_demo_yby',
    taxId: '00.000.000/0001-00',
    name: 'Yby Pagamentos (Demo)',
    type: 'subacquirer',
  },
  roles: ['admin', 'finance.read', 'reconciliation.read', 'pricing.read'],
}

/** ⚠️ MOCK ONLY — token fake usado apenas em modo demo (apiMode === 'mock').
 *  NÃO é JWT válido. Em modo 'real', o token vem do POST /auth/login real
 *  e fica em localStorage (auth-storage). Nenhum segredo aqui. */
const MOCK_TOKEN = 'mock_jwt.eyJzdWIiOiJicnVub0B5YnkuY29tLmJyIiwicm9sZSI6ImFkbWluIn0.mock'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (apiMode === 'mock') {
    await mockDelay(500)
    if (!data.email || !data.password) {
      throw new ApiError('Credenciais inválidas', 401, { message: 'E-mail e senha obrigatórios.' })
    }
    if (data.password.length < 4) {
      throw new ApiError('Credenciais inválidas', 401, { message: 'Senha incorreta.' })
    }
    return {
      accessToken: MOCK_TOKEN,
      user: { ...MOCK_USER, email: data.email },
      isFirstAccess: false,
    }
  }
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    data,
    allowWriteInReadOnly: true,
  })
}

export async function logout(): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(150)
    return
  }
  await request('/auth/logout', { method: 'POST', allowWriteInReadOnly: true })
}

export async function fetchCurrentUser(): Promise<User> {
  if (apiMode === 'mock') {
    await mockDelay(120)
    return MOCK_USER
  }
  return request<User>('/auth/me')
}

/* ─── Recuperação de senha (3 etapas, vocabulário Tupi) ─────────────────── */

export async function sendPasswordRecoveryCode(email: string): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(400)
    if (!email.includes('@')) {
      throw new ApiError('E-mail inválido', 400, { message: 'Informe um e-mail válido.' })
    }
    return
  }
  await request('/auth/forgot-password/send-code', {
    method: 'POST',
    data: { email },
    allowWriteInReadOnly: true,
  })
}

export async function verifyPasswordRecoveryCode(email: string, code: string): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(400)
    if (code !== '123456') {
      throw new ApiError('Código inválido', 400, { message: 'Código incorreto. Em modo demo, use 123456.' })
    }
    return
  }
  await request('/auth/forgot-password/verify-code', {
    method: 'POST',
    data: { email, code },
    allowWriteInReadOnly: true,
  })
}

export async function redefinePassword(email: string, code: string, newPassword: string): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(500)
    if (newPassword.length < 8) {
      throw new ApiError('Senha fraca', 400, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    }
    return
  }
  await request('/auth/forgot-password/redefine', {
    method: 'POST',
    data: { email, code, password: newPassword },
    allowWriteInReadOnly: true,
  })
}

export async function redefineTemporaryPassword(currentPassword: string, newPassword: string): Promise<void> {
  if (apiMode === 'mock') {
    await mockDelay(500)
    if (newPassword.length < 8) {
      throw new ApiError('Senha fraca', 400, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    }
    if (currentPassword === newPassword) {
      throw new ApiError('Senha repetida', 400, { message: 'A nova senha deve ser diferente da temporária.' })
    }
    return
  }
  await request('/auth/redefine-temporary-password', {
    method: 'POST',
    data: { current_password: currentPassword, new_password: newPassword },
    allowWriteInReadOnly: true,
  })
}
