'use client'

import { useIncidentStore } from '@/store/incident.store'
import { useAcknowledgeIncident, useResolveIncident, useMuteQuery } from '../hooks/useIncidentActions'
import { IncidentSeverityBadge } from './IncidentSeverityBadge'
import { IncidentStatusBadge } from './IncidentStatusBadge'
import type { Incident } from '../types/incident.types'

interface Props {
  incident: Incident | null
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

export function IncidentDetailPanel({ incident }: Props) {
  const setSelected = useIncidentStore((s) => s.setSelectedIncidentId)
  const acknowledge = useAcknowledgeIncident()
  const resolve = useResolveIncident()
  const mute = useMuteQuery()

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        Select an incident to view details
      </div>
    )
  }

  const baselineRatio = incident.baseline_latency_ms > 0
    ? Math.round((incident.current_latency_ms / incident.baseline_latency_ms) * 100)
    : 100

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <IncidentSeverityBadge severity={incident.severity} />
          <IncidentStatusBadge status={incident.status} />
        </div>
        <button
          onClick={() => setSelected(null)}
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Query hash */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Query Hash</p>
        <p className="text-xs font-mono text-gray-300">{incident.query_hash}</p>
      </div>

      {/* Query text */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Query</p>
        <pre className="text-xs font-mono text-gray-300 bg-gray-800/50 rounded p-2 overflow-x-auto whitespace-pre-wrap break-words">
          {incident.query_text}
        </pre>
      </div>

      {/* Latency comparison */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Latency</p>
        <div className="flex gap-4 text-xs">
          <div>
            <p className="text-gray-500">Current</p>
            <p className="text-red-400 font-bold text-sm">{incident.current_latency_ms.toFixed(1)}ms</p>
          </div>
          <div>
            <p className="text-gray-500">Baseline (p95)</p>
            <p className="text-green-400 font-bold text-sm">{incident.baseline_latency_ms.toFixed(1)}ms</p>
          </div>
          <div>
            <p className="text-gray-500">Ratio</p>
            <p className="text-orange-400 font-bold text-sm">{incident.latency_ratio}x</p>
          </div>
          <div>
            <p className="text-gray-500">Calls/min</p>
            <p className="text-gray-300 font-bold text-sm">{incident.calls_per_minute.toFixed(0)}</p>
          </div>
        </div>

        {/* Visual bar */}
        <div className="mt-3">
          <div className="h-2 bg-green-600 rounded" style={{ width: '100%' }} title="Baseline" />
          <div
            className="h-2 bg-red-500 rounded mt-1"
            style={{ width: `${Math.min(baselineRatio, 100)}%` }}
            title="Current (capped at 100%)"
          />
          <p className="text-xs text-gray-600 mt-1">Green = baseline · Red = current (proportional)</p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Timeline</p>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Started</span>
            <span className="text-gray-300">{formatDate(incident.start_time)}</span>
          </div>
          {incident.acknowledged_at && (
            <div className="flex justify-between">
              <span className="text-blue-400">Acknowledged</span>
              <span className="text-gray-300">{formatDate(incident.acknowledged_at)}</span>
            </div>
          )}
          {incident.resolved_at && (
            <div className="flex justify-between">
              <span className="text-green-400">Resolved</span>
              <span className="text-gray-300">{formatDate(incident.resolved_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        {incident.status === 'open' && (
          <button
            onClick={() => acknowledge.mutate(incident.id)}
            disabled={acknowledge.isPending}
            className="w-full py-2 rounded bg-blue-800/50 text-blue-300 text-sm hover:bg-blue-700/50 disabled:opacity-50 transition-colors"
          >
            Acknowledge
          </button>
        )}
        {incident.status !== 'resolved' && (
          <button
            onClick={() => resolve.mutate(incident.id)}
            disabled={resolve.isPending}
            className="w-full py-2 rounded bg-green-800/50 text-green-300 text-sm hover:bg-green-700/50 disabled:opacity-50 transition-colors"
          >
            Mark as Resolved
          </button>
        )}
        <button
          onClick={() => mute.mutate(incident.query_hash)}
          disabled={mute.isPending}
          className="w-full py-2 rounded bg-gray-800/50 text-gray-400 text-sm hover:bg-gray-700/50 disabled:opacity-50 transition-colors"
        >
          Mute This Query
        </button>
      </div>
    </div>
  )
}
