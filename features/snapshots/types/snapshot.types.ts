// Raw API response
export interface RawSnapshotQuery {
  id: string
  category: 'slow' | 'frequent' | 'heaviest'
  query: string
  mean_time_ms: number | null
  calls: number | null
  total_time_ms: number | null
  rows: number | null
}

export interface RawSnapshotRecommendation {
  id: string
  problem: string
  impact: string
  suggestion: string
  severity: 'high' | 'medium' | 'low'
}

export interface RawSnapshot {
  id: string
  connection_id: string
  captured_at: string
  active_connections: number | null
  qps: number | null
  avg_query_time_ms: number | null
  total_queries: number | null
  queries: RawSnapshotQuery[]
  recommendations: RawSnapshotRecommendation[]
}

export interface RawSnapshotsResponse {
  snapshots: RawSnapshot[]
}

// Domain model
export interface SnapshotQuery {
  id: string
  category: 'slow' | 'frequent' | 'heaviest'
  query: string
  meanTimeMs: number | null
  calls: number | null
  totalTimeMs: number | null
  rows: number | null
}

export interface SnapshotRecommendation {
  id: string
  problem: string
  impact: string
  suggestion: string
  severity: 'critical' | 'warning' | 'info'
}

export interface Snapshot {
  id: string
  connectionId: string
  capturedAt: string
  activeConnections: number | null
  qps: number | null
  avgQueryTimeMs: number | null
  totalQueries: number | null
  queries: SnapshotQuery[]
  recommendations: SnapshotRecommendation[]
}
