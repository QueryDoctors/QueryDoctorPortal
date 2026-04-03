// Raw API response — matches exactly what the server sends
export interface RawConnectResponse {
  db_id: string
  status: string
}

// Domain model — what the UI uses
export interface ConnectResult {
  dbId: string
  status: string
}

// Form values
export interface ConnectFormValues {
  host: string
  port: number
  database: string
  user: string
  password: string
}

// Test connection
export interface TestConnectionResult {
  success: boolean
  message: string
}
