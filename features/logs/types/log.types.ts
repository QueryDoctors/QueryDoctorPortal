// Raw API response
export interface RawLogEntry {
  pid: number
  username: string
  application_name: string
  state: string
  query: string | null
  duration_ms: number | null
  wait_event_type: string | null
  wait_event: string | null
  query_start: string | null
}

// Domain model
export type LogState =
  | 'active'
  | 'idle in transaction'
  | 'idle in transaction (aborted)'
  | string

export interface LogEntry {
  pid: number
  username: string
  applicationName: string
  state: LogState
  query: string | null
  durationMs: number | null
  waitEvent: string | null         // "wait_event_type: wait_event" combined
  queryStart: string | null
}
