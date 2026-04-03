'use client'

import { useConnectionStore } from '@/store/connection.store'
import { useMetrics } from '../hooks/useMetrics'
import { MetricCard } from './MetricCard'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function MetricsGrid() {
  const { dbId } = useConnectionStore()
  const { data, isLoading, error } = useMetrics(dbId)

  if (!dbId) return null

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Metrics
        </span>
        {isLoading && <Spinner size="sm" />}
      </div>

      {error && <ErrorMessage message={error.message} />}

      {data && (
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="Active Connections"
            value={data.activeConnections}
            alert={data.activeConnections > 80}
          />
          <MetricCard
            label="QPS"
            value={data.qps}
            unit="q/s"
          />
          <MetricCard
            label="Avg Query Time"
            value={data.avgQueryTimeMs}
            unit="ms"
            alert={data.avgQueryTimeMs > 500}
          />
          <MetricCard
            label="Total Queries"
            value={data.totalQueries}
          />
        </div>
      )}
    </div>
  )
}
