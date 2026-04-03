// Raw API response
export interface RawQueryStat {
  query: string
  mean_time: number
  calls: number
  total_time: number
  rows: number
}

export interface RawQueriesResponse {
  slow_queries: RawQueryStat[]
  frequent_queries: RawQueryStat[]
  heaviest_queries: RawQueryStat[]
}

// Domain model
export interface QueryStat {
  query: string
  meanTime: number
  calls: number
  totalTime: number
  rows: number
}

export interface QueriesResult {
  slowQueries: QueryStat[]
  frequentQueries: QueryStat[]
  heaviestQueries: QueryStat[]
}

export type QueryCategory = 'slow' | 'frequent' | 'heaviest'
