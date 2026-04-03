import { apiClient } from '@/lib/api-client'
import type {
  ConnectFormValues,
  ConnectResult,
  RawConnectResponse,
  TestConnectionResult,
} from '../types/connection.types'

function mapConnectResult(raw: RawConnectResponse): ConnectResult {
  return {
    dbId: raw.db_id,
    status: raw.status,
  }
}

export async function connectDatabase(values: ConnectFormValues): Promise<ConnectResult> {
  const data = await apiClient.post<RawConnectResponse>('/connect-db', values)
  return mapConnectResult(data)
}

export async function testConnection(values: ConnectFormValues): Promise<TestConnectionResult> {
  return apiClient.post<TestConnectionResult>('/test-connection', values)
}
