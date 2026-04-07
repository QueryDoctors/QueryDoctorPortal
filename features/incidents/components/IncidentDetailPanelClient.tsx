'use client'

import { useIncidentStore } from '@/store/incident.store'
import { useIncidents } from '../hooks/useIncidents'
import { IncidentDetailPanel } from './IncidentDetailPanel'

export function IncidentDetailPanelClient() {
  const selectedId = useIncidentStore((s) => s.selectedIncidentId)
  const { data } = useIncidents()

  const selected = selectedId
    ? (data?.incidents.find((i) => i.id === selectedId) ?? null)
    : null

  if (!selected) return null

  return (
    <div className="border-b border-gray-700/50 flex-shrink-0" style={{ maxHeight: '50%' }}>
      <IncidentDetailPanel incident={selected} />
    </div>
  )
}
