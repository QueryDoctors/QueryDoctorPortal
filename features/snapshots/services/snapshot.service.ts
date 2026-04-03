import { apiClient } from '@/lib/api-client'
import type {
  RawSnapshot,
  RawSnapshotRecommendation,
  RawSnapshotsResponse,
  Snapshot,
  SnapshotRecommendation,
} from '../types/snapshot.types'

const SEVERITY_MAP: Record<RawSnapshotRecommendation['severity'], SnapshotRecommendation['severity']> = {
  high: 'critical',
  medium: 'warning',
  low: 'info',
}

function mapSnapshot(raw: RawSnapshot): Snapshot {
  return {
    id: raw.id,
    connectionId: raw.connection_id,
    capturedAt: raw.captured_at,
    activeConnections: raw.active_connections,
    qps: raw.qps,
    avgQueryTimeMs: raw.avg_query_time_ms,
    totalQueries: raw.total_queries,
    queries: raw.queries.map((q) => ({
      id: q.id,
      category: q.category,
      query: q.query,
      meanTimeMs: q.mean_time_ms,
      calls: q.calls,
      totalTimeMs: q.total_time_ms,
      rows: q.rows,
    })),
    recommendations: raw.recommendations.map((r) => ({
      id: r.id,
      problem: r.problem,
      impact: r.impact,
      suggestion: r.suggestion,
      severity: SEVERITY_MAP[r.severity],
    })),
  }
}

export async function captureSnapshot(
  dbId: string,
  connectionId: string,
): Promise<Snapshot> {
  const data = await apiClient.post<RawSnapshot>(
    `/snapshots/${dbId}?connection_id=${connectionId}`,
    {},
  )
  return mapSnapshot(data)
}

export async function getSnapshot(id: string): Promise<Snapshot> {
  const data = await apiClient.get<RawSnapshot>(`/snapshots/${id}`)
  return mapSnapshot(data)
}

export async function listSnapshots(connectionId: string): Promise<Snapshot[]> {
  const data = await apiClient.get<RawSnapshotsResponse>('/snapshots', {
    connection_id: connectionId,
  })
  return data.snapshots.map(mapSnapshot)
}
