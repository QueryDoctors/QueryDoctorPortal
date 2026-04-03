import { apiClient } from '@/lib/api-client'
import type { LogEntry, RawLogEntry } from '../types/log.types'

function mapLogEntry(raw: RawLogEntry): LogEntry {
  const waitEvent =
    raw.wait_event_type && raw.wait_event
      ? `${raw.wait_event_type}: ${raw.wait_event}`
      : null

  return {
    pid: raw.pid,
    username: raw.username,
    applicationName: raw.application_name,
    state: raw.state,
    query: raw.query,
    durationMs: raw.duration_ms,
    waitEvent,
    queryStart: raw.query_start,
  }
}

export async function getLiveLogs(dbId: string): Promise<LogEntry[]> {
  const data = await apiClient.get<RawLogEntry[]>(`/logs/${dbId}`)
  return data.map(mapLogEntry)
}
