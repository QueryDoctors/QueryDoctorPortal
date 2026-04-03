import { apiClient } from '@/lib/api-client'
import type { Metrics, RawMetrics } from '../types/metrics.types'

function mapMetrics(raw: RawMetrics): Metrics {
  return {
    activeConnections: raw.active_connections,
    qps: raw.qps,
    avgQueryTimeMs: raw.avg_query_time_ms,
    totalQueries: raw.total_queries,
  }
}

export async function getMetrics(dbId: string): Promise<Metrics> {
  const data = await apiClient.get<RawMetrics>(`/metrics/${dbId}`)
  return mapMetrics(data)
}
