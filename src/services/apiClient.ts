/**
 * Cliente HTTP do Yby Front.
 *
 * Decide automaticamente entre modo "mock" (fixtures locais, zero rede) e modo
 * "real" (fetch contra NEXT_PUBLIC_API_BASE_URL). A escolha pode ser forçada
 * via NEXT_PUBLIC_API_MODE.
 *
 * Cada service expõe a mesma assinatura nos dois modos — quando a API real
 * estiver disponível, basta trocar a env var.
 */

export type ApiMode = 'mock' | 'real'

export const apiMode: ApiMode = (() => {
  const forced = process.env.NEXT_PUBLIC_API_MODE
  if (forced === 'mock' || forced === 'real') return forced
  return process.env.NEXT_PUBLIC_API_BASE_URL ? 'real' : 'mock'
})()

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const isReadOnly = process.env.NEXT_PUBLIC_READ_ONLY !== 'false'

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, string | number | boolean | undefined>
  data?: unknown
  /** Quando o app está em read-only e a chamada é mutation, lança erro. */
  allowWriteInReadOnly?: boolean
}

const TOKEN_STORAGE_KEY = 'auth-storage'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } }
    return parsed.state?.accessToken ?? null
  } catch {
    return null
  }
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = apiBaseUrl.replace(/\/$/, '')
  const url = new URL(path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`, base || 'http://localhost')
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    }
  }
  return apiBaseUrl ? url.toString() : `${path}${url.search}`
}

/**
 * Request real — usado pelos services quando apiMode === 'real'.
 * Em modo mock, o service redireciona para fixtures e nunca chama esta função.
 */
export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', params, data, allowWriteInReadOnly = false } = opts

  const isMutation = method !== 'GET'
  if (isMutation && isReadOnly && !allowWriteInReadOnly) {
    throw new ApiError(`Read-only mode: ${method} ${path} bloqueado`, 403, null)
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
    credentials: 'include',
  })

  const contentType = res.headers.get('content-type') ?? ''
  const body: unknown = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    throw new ApiError(`${method} ${path} → ${res.status}`, res.status, body)
  }
  return body as T
}

/** Sleep helper para mocks parecerem reais (latência). */
export const mockDelay = (ms = 300) => new Promise(r => setTimeout(r, ms))
