import { useQuery } from '@tanstack/react-query'
import { useConnectionStore } from '@/store/connection.store'
import { fetchIncidents } from '../services/incidents.service'
import { useIncidentWebSocket } from './useIncidentWebSocket'
import type { IncidentsResult } from '../types/incident.types'

export function useIncidents(limit = 50, offset = 0) {
  const dbId = useConnectionStore((s) => s.dbId)

  // Push-based refresh via WebSocket; no polling needed
  useIncidentWebSocket(dbId)

  const query = useQuery<IncidentsResult>({
    queryKey: ['incidents', dbId, limit, offset],
    queryFn: () => fetchIncidents(dbId!, limit, offset),
    enabled: !!dbId,
    staleTime: 0,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
