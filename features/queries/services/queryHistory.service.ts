import { apiClient } from '@/lib/api-client'

export interface LatencyPoint {
  ts: string        // ISO timestamp
  ms: number        // mean_latency_ms
}

export async function getQueryHistory(
  dbId: string,
  queryText: string,
  hours = 2,
): Promise<LatencyPoint[]> {
  const params = new URLSearchParams({ q: queryText, hours: String(hours) })
  return apiClient.get<LatencyPoint[]>(`/queries/${dbId}/history?${params}`)
}
