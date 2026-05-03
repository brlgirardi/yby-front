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
