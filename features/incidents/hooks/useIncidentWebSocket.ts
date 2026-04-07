import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'

const WS_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000')
    .replace(/^http/, 'ws')

const RECONNECT_DELAY_MS = 3_000

export function useIncidentWebSocket(dbId: string | null | undefined) {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((s) => s.accessToken)
  const wsRef = useRef<WebSocket | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!dbId || !accessToken) return

    let cancelled = false

    function connect() {
      if (cancelled) return
      // Backend WS auth reads token from query param (HTTP headers not available in WS)
      const ws = new WebSocket(`${WS_BASE}/incidents/ws/${dbId}?token=${accessToken}`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        if (event.data === 'incident_update') {
          queryClient.invalidateQueries({ queryKey: ['incidents', dbId] })
        } else if (event.data === 'query_update') {
          queryClient.invalidateQueries({ queryKey: ['queries', dbId] })
        }
      }

      ws.onclose = () => {
        if (!cancelled) {
          timerRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
        }
      }

      ws.onopen = () => {
        const ping = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send('ping')
          else clearInterval(ping)
        }, 30_000)
      }
    }

    connect()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      wsRef.current?.close()
    }
  }, [dbId, accessToken, queryClient])
}
