'use client'

import { IncidentSeverityBadge } from './IncidentSeverityBadge'
import { IncidentStatusBadge } from './IncidentStatusBadge'
import {
  useAcknowledgeIncident,
  useResolveIncident,
  useMuteQuery,
} from '../hooks/useIncidentActions'
import type { Incident } from '../types/incident.types'

interface Props {
  incident: Incident
  isNew: boolean
  onClick: () => void
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function IncidentCard({ incident, isNew, onClick }: Props) {
  const acknowledge = useAcknowledgeIncident()
  const resolve = useResolveIncident()
  const mute = useMuteQuery()

  const isCritical = incident.severity === 'critical'

  return (
    <div
      onClick={onClick}
      className={[
        'flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200',
        isCritical
          ? 'bg-red-950/30 border-red-800/50'
          : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600',
        isNew ? 'ring-2 ring-yellow-400 ring-opacity-70' : '',
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <IncidentSeverityBadge severity={incident.severity} />
          <span className="text-xs font-mono text-gray-400 truncate">
            {incident.query_hash}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-500">{timeAgo(incident.start_time)}</span>
          <IncidentStatusBadge status={incident.status} />
        </div>
      </div>

      {/* Latency info */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>
          <span className="text-white font-semibold">
            {incident.current_latency_ms.toFixed(0)}ms
          </span>
          {' '}vs baseline {incident.baseline_latency_ms.toFixed(0)}ms
        </span>
        <span className="text-orange-400 font-bold">{incident.latency_ratio}x</span>
        <span>{incident.calls_per_minute.toFixed(0)} calls/min</span>
      </div>

      {/* Query text truncated */}
      <p className="text-xs text-gray-500 font-mono truncate">
        {incident.query_text}
      </p>

      {/* Actions */}
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        {incident.status === 'open' && (
          <button
            onClick={() => acknowledge.mutate(incident.id)}
            disabled={acknowledge.isPending}
            className="text-xs px-2 py-1 rounded bg-blue-900/50 text-blue-300 hover:bg-blue-800/50 disabled:opacity-50 transition-colors"
          >
            Acknowledge
          </button>
        )}
        {incident.status !== 'resolved' && (
          <button
            onClick={() => resolve.mutate(incident.id)}
            disabled={resolve.isPending}
            className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-300 hover:bg-green-800/50 disabled:opacity-50 transition-colors"
          >
            Resolve
          </button>
        )}
        <button
          onClick={() => mute.mutate(incident.query_hash)}
          disabled={mute.isPending}
          className="text-xs px-2 py-1 rounded bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 disabled:opacity-50 transition-colors"
        >
          Mute
        </button>
      </div>
    </div>
  )
}
