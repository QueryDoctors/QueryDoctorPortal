import { apiClient } from '@/lib/api-client'
import type {
  QueriesResult,
  QueryStat,
  RawQueriesResponse,
  RawQueryStat,
} from '../types/query.types'

function mapQueryStat(raw: RawQueryStat): QueryStat {
  return {
    query: raw.query,
    meanTime: raw.mean_time,
    calls: raw.calls,
    totalTime: raw.total_time,
    rows: raw.rows,
  }
}

export async function getQueries(dbId: string): Promise<QueriesResult> {
  const data = await apiClient.get<RawQueriesResponse>(`/queries/${dbId}`)
  return {
    slowQueries: data.slow_queries.map(mapQueryStat),
    frequentQueries: data.frequent_queries.map(mapQueryStat),
    heaviestQueries: data.heaviest_queries.map(mapQueryStat),
  }
}
