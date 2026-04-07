export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'investigating' | 'resolved'

export interface Incident {
  id: string
  db_id: string
  query_hash: string
  query_text: string
  severity: IncidentSeverity
  status: IncidentStatus
  start_time: string
  last_updated: string
  current_latency_ms: number
  baseline_latency_ms: number
  latency_ratio: number
  calls_per_minute: number
  resolved_at: string | null
  acknowledged_at: string | null
}

export interface IncidentsResult {
  incidents: Incident[]
  total: number
}
