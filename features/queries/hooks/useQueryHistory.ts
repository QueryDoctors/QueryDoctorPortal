import { useQuery } from '@tanstack/react-query'
import { getQueryHistory, type LatencyPoint } from '../services/queryHistory.service'

export function useQueryHistory(dbId: string | null, queryText: string | null, hours = 2) {
  return useQuery<LatencyPoint[]>({
    queryKey: ['query-history', dbId, queryText, hours],
    queryFn: () => getQueryHistory(dbId!, queryText!, hours),
    enabled: !!dbId && !!queryText,
    staleTime: 30_000,
  })
}
