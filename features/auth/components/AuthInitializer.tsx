'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { clearAuthCookie } from '@/lib/cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

const PUBLIC_PATHS = ['/login']

/** Runs once on app boot. Calls /auth/refresh silently to restore the access token.
 *  If refresh fails on a protected route, redirects to /login.
 */
export function AuthInitializer() {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) {
      setInitialized()
      return
    }

    fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('refresh failed')
        const { access_token } = await res.json() as { access_token: string }
        const base64 = access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(base64)) as { sub: string; email: string }
        setAuth(access_token, payload.sub ?? '', payload.email ?? '')
      })
      .catch(() => {
        clearAuth()
        clearAuthCookie()
        router.replace('/login')
      })
      .finally(() => setInitialized())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- intentionally once on mount

  return null
}
