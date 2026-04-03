'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRecommendations } from '@/features/recommendations/hooks/useRecommendations'
import { useConnectionStore } from '@/store/connection.store'
import { ApiError } from '@/lib/api-client'
import { clearDbIdCookie } from '@/lib/cookies'

interface Props {
  dbId: string
}

/**
 * Detects 404 from the backend (PoolManager lost db_id after server restart).
 * Clears the cookie + store and redirects to /connect.
 * Renders nothing — purely logic.
 */
export function ConnectionGuard({ dbId }: Props) {
  const router = useRouter()
  const clearConnection = useConnectionStore((s) => s.clearConnection)
  const { error } = useRecommendations(dbId)

  useEffect(() => {
    if (error instanceof ApiError && error.status === 404) {
      clearDbIdCookie()
      clearConnection()
      router.replace('/connect')
    }
  }, [error, clearConnection, router])

  return null
}
