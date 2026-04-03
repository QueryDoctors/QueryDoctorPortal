import type { LogEntry } from '../types/log.types'

interface Props {
  entry: LogEntry
}

const STATE_COLOR: Record<string, string> = {
  'active':                         'text-green-400',
  'idle in transaction':            'text-yellow-400',
  'idle in transaction (aborted)':  'text-red-400',
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60_000).toFixed(1)}m`
}

export function LogRow({ entry }: Props) {
  const stateColor = STATE_COLOR[entry.state] ?? 'text-gray-400'
  const isLong = (entry.durationMs ?? 0) > 5_000

  return (
    <div className="flex items-start gap-3 px-4 py-1.5 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-75 group">
      {/* Duration */}
      <span className={`w-12 shrink-0 text-xs font-mono text-right ${isLong ? 'text-yellow-400' : 'text-gray-500'}`}>
        {formatDuration(entry.durationMs)}
      </span>

      {/* State */}
      <span className={`w-32 shrink-0 text-xs font-medium truncate ${stateColor}`}>
        {entry.state}
      </span>

      {/* PID */}
      <span className="w-12 shrink-0 text-xs font-mono text-gray-600">
        {entry.pid}
      </span>

      {/* Query */}
      <span className="flex-1 text-xs font-mono text-gray-300 truncate">
        {entry.query ?? <span className="text-gray-600 italic">—</span>}
      </span>

      {/* Wait event */}
      {entry.waitEvent && (
        <span className="shrink-0 text-xs text-yellow-500/70 truncate max-w-[120px]">
          {entry.waitEvent}
        </span>
      )}

      {/* User */}
      <span className="shrink-0 text-xs text-gray-600 hidden group-hover:inline">
        {entry.username}
      </span>
    </div>
  )
}
