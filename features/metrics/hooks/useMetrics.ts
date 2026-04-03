import { useQuery } from '@tanstack/react-query'
import { getMetrics } from '../services/metrics.service'

export function useMetrics(dbId: string | null) {
  const query = useQuery({
    queryKey: ['metrics', dbId],
    queryFn: () => getMetrics(dbId!),
    enabled: dbId !== null,
    refetchInterval: 10_000,
    staleTime: 9_000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
