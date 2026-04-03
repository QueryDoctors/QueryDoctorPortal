import { apiClient } from '@/lib/api-client'
import type {
  RawSavedConnection,
  RawSavedConnectionsResponse,
  SavedConnection,
  SaveConnectionRequest,
} from '../types/saved-connection.types'

function mapSavedConnection(raw: RawSavedConnection): SavedConnection {
  return {
    id: raw.id,
    name: raw.name,
    host: raw.host,
    port: raw.port,
    database: raw.database,
    user: raw.user,
    createdAt: raw.created_at,
    lastUsed: raw.last_used,
  }
}

export async function getSavedConnections(): Promise<SavedConnection[]> {
  const data = await apiClient.get<RawSavedConnectionsResponse>('/saved-connections')
  return data.connections.map(mapSavedConnection)
}

export async function getSavedConnection(id: string): Promise<SavedConnection> {
  const data = await apiClient.get<RawSavedConnection>(`/saved-connections/${id}`)
  return mapSavedConnection(data)
}

export async function saveConnection(body: SaveConnectionRequest): Promise<SavedConnection> {
  const data = await apiClient.post<RawSavedConnection>('/saved-connections', body)
  return mapSavedConnection(data)
}

export async function deleteSavedConnection(id: string): Promise<void> {
  return apiClient.delete(`/saved-connections/${id}`)
}
