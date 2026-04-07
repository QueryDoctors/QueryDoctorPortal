import { apiClient } from '@/lib/api-client'
import type { Incident, IncidentsResult } from '../types/incident.types'

export async function fetchIncidents(
  dbId: string,
  limit = 50,
  offset = 0,
): Promise<IncidentsResult> {
  return apiClient.get<IncidentsResult>(`/incidents/${dbId}`, {
    limit,
    offset,
  })
}

export async function acknowledgeIncident(incidentId: string): Promise<Incident> {
  return apiClient.patch<Incident>(`/incidents/${incidentId}/acknowledge`)
}

export async function resolveIncident(incidentId: string): Promise<Incident> {
  return apiClient.patch<Incident>(`/incidents/${incidentId}/resolve`)
}

export async function muteQuery(dbId: string, queryHash: string): Promise<void> {
  return apiClient.post(`/incidents/queries/${dbId}/${queryHash}/mute`, {})
}

export async function unmuteQuery(dbId: string, queryHash: string): Promise<void> {
  return apiClient.delete(`/incidents/queries/${dbId}/${queryHash}/mute`)
}

export async function whitelistQuery(dbId: string, queryHash: string): Promise<void> {
  return apiClient.post(`/incidents/queries/${dbId}/${queryHash}/whitelist`, {})
}
