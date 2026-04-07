import { useAuthStore } from '@/store/auth.store'
import { clearAuthCookie } from '@/lib/cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Decode JWT payload without a library — token is not verified client-side, just parsed. */
function parseJwtPayload(token: string): Record<string, string> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return {}
  }
}

/** Prevent concurrent refresh calls — all waiters share the same promise. */
let _refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (_refreshPromise) return _refreshPromise

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) return false

      const { access_token } = await res.json() as { access_token: string }
      const payload = parseJwtPayload(access_token)
      useAuthStore.getState().setAuth(access_token, payload.sub ?? '', payload.email ?? '')
      return true
    } catch {
      return false
    } finally {
      _refreshPromise = null
    }
  })()

  return _refreshPromise
}

async function request<T>(path: string, options?: RequestInit, _isRetry = false): Promise<T> {
  const token = useAuthStore.getState().accessToken

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  // 401 → try to refresh once, then retry the original request
  if (res.status === 401 && !_isRetry && !path.startsWith('/auth/')) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return request<T>(path, options, true)
    }
    // Refresh failed — clear session and redirect to login
    useAuthStore.getState().clearAuth()
    clearAuthCookie()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError(401, 'Session expired')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, body.detail ?? 'Request failed')
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

/** For endpoints that require application/x-www-form-urlencoded (OAuth2 login). */
async function requestForm<T>(path: string, data: Record<string, string>): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString(),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }))
    throw new ApiError(res.status, body.detail ?? 'Request failed')
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) => {
    const defined = Object.fromEntries(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined),
    ) as Record<string, string>
    const query = Object.keys(defined).length
      ? '?' + new URLSearchParams(defined).toString()
      : ''
    return request<T>(`${path}${query}`)
  },

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  postForm: <T>(path: string, data: Record<string, string>) =>
    requestForm<T>(path, data),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),

  delete: (path: string) =>
    request<void>(path, { method: 'DELETE' }),
}
