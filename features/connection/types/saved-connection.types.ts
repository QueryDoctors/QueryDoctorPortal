// Raw API response
export interface RawSavedConnection {
  id: string
  name: string
  host: string
  port: number
  database: string
  user: string
  created_at: string
  last_used: string | null
}

export interface RawSavedConnectionsResponse {
  connections: RawSavedConnection[]
}

// Domain model
export interface SavedConnection {
  id: string
  name: string
  host: string
  port: number
  database: string
  user: string
  createdAt: string
  lastUsed: string | null
}

// Request
export interface SaveConnectionRequest {
  name: string
  host: string
  port: number
  database: string
  user: string
  password: string
}
