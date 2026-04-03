'use client'

import { useRouter } from 'next/navigation'
import { StatusDot } from '@/components/ui/StatusDot'
import { useAlertStore } from '@/store/alert.store'
import { useConnectionStore } from '@/store/connection.store'
import { useRecommendations } from '@/features/recommendations/hooks/useRecommendations'
import { clearDbIdCookie } from '@/lib/cookies'

const TIME_RANGES = ['5m', '1h', '24h'] as const

function useSystemStatus(dbId: string | null) {
  const { data } = useRecommendations(dbId)

  if (!data || data.length === 0) return 'healthy' as const
  if (data.some((r) => r.severity === 'critical')) return 'critical' as const
  if (data.some((r) => r.severity === 'warning')) return 'warning' as const
  return 'healthy' as const
}

const STATUS_LABEL: Record<'healthy' | 'warning' | 'critical', string> = {
  healthy: 'Healthy',
  warning: 'Degraded',
  critical: 'Critical',
}

const STATUS_TEXT: Record<'healthy' | 'warning' | 'critical', string> = {
  healthy: 'text-green-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
}

export function Header() {
  const router = useRouter()
  const { dbId, clearConnection } = useConnectionStore()
  const { filters, setFilters } = useAlertStore()
  const status = useSystemStatus(dbId)

  const handleDisconnect = () => {
    clearDbIdCookie()
    clearConnection()
    router.replace('/connect')
  }

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-gray-900 border-b border-gray-800 shrink-0">
      <span className="text-sm font-semibold uppercase tracking-wide text-gray-100">
        DB Monitor
      </span>

      <div className="flex items-center gap-2">
        <StatusDot status={status} />
        <span className={`text-xs font-medium ${STATUS_TEXT[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setFilters({ timeRange: range })}
            className={`px-2 py-1 text-xs rounded transition-colors duration-100 ${
              filters.timeRange === range
                ? 'bg-blue-900/40 border border-blue-500/40 text-blue-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {range}
          </button>
        ))}

        <span className="w-px h-4 bg-gray-700 mx-1" />

        <button
          type="button"
          onClick={handleDisconnect}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors duration-100"
        >
          Disconnect
        </button>
      </div>
    </header>
  )
}
