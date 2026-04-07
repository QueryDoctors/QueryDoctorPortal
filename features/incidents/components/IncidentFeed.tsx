'use client'

import { useEffect, useRef, useState } from 'react'
import { useIncidents } from '../hooks/useIncidents'
import { useIncidentStore } from '@/store/incident.store'
import { IncidentCard } from './IncidentCard'
import { Collapsible } from '@/components/ui/Collapsible'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Incident } from '../types/incident.types'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export function IncidentFeed() {
  const { data, isLoading, error } = useIncidents()
  const { selectedIncidentId, setSelectedIncidentId, seenIncidentIds, markAsSeen } =
    useIncidentStore()
  const [lowOpen, setLowOpen] = useState(false)
  const prevIdsRef = useRef<Record<string, boolean>>({})

  const incidents = data?.incidents ?? []

  // AC22: detect new incidents and mark after 3s
  useEffect(() => {
    const currentIds: Record<string, boolean> = {}
    incidents.forEach((i) => { currentIds[i.id] = true })
    const newIds = Object.keys(currentIds).filter(
      (id) => !prevIdsRef.current[id] && !seenIncidentIds[id]
    )
    prevIdsRef.current = currentIds

    if (newIds.length > 0) {
      const timer = setTimeout(() => markAsSeen(newIds), 3000)
      return () => clearTimeout(timer)
    }
  }, [incidents, seenIncidentIds, markAsSeen])

  if (isLoading) return <div className="p-4"><Spinner /></div>
  if (error) return <div className="p-4"><ErrorMessage message="Failed to load incidents" /></div>
  if (incidents.length === 0) {
    return (
      <EmptyState message="No incidents detected" description="The system is monitoring your queries" />
    )
  }

  // Sort: severity DESC, start_time DESC (backend already sorts, but keep client resilient)
  const sorted = [...incidents].sort((a, b) => {
    const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    if (sev !== 0) return sev
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  })

  const critical = sorted.filter((i) => i.severity === 'critical')
  const high     = sorted.filter((i) => i.severity === 'high')
  const medium   = sorted.filter((i) => i.severity === 'medium')
  const low      = sorted.filter((i) => i.severity === 'low')
  const nonLow   = [...critical, ...high, ...medium]

  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Incidents
        </h2>
        <span className="text-xs text-gray-500">
          {incidents.length} total
          {data?.total && data.total > incidents.length ? ` (showing ${incidents.length} of ${data.total})` : ''}
        </span>
      </div>

      {/* Non-LOW incidents */}
      <div className="flex flex-col gap-1 px-2 py-1">
        {nonLow.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            isNew={!seenIncidentIds[incident.id]}
            onClick={() =>
              setSelectedIncidentId(
                selectedIncidentId === incident.id ? null : incident.id,
              )
            }
          />
        ))}
      </div>

      {/* LOW severity — collapsible (AC25) */}
      {low.length > 0 && (
        <Collapsible
          open={lowOpen}
          onToggle={() => setLowOpen((o) => !o)}
          label={`Low severity (${low.length})`}
        >
          <div className="flex flex-col gap-1 px-2 pb-1">
            {low.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isNew={!seenIncidentIds[incident.id]}
                onClick={() =>
                  setSelectedIncidentId(
                    selectedIncidentId === incident.id ? null : incident.id,
                  )
                }
              />
            ))}
          </div>
        </Collapsible>
      )}
    </div>
  )
}
