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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
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

  delete: (path: string) =>
    request<void>(path, { method: 'DELETE' }),
}
