// Raw API response
export interface RawMetrics {
  active_connections: number
  qps: number
  avg_query_time_ms: number
  total_queries: number
}

// Domain model
export interface Metrics {
  activeConnections: number
  qps: number
  avgQueryTimeMs: number
  totalQueries: number
}
