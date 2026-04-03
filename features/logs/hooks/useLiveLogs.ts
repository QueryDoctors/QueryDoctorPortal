import { useQuery } from '@tanstack/react-query'
import { getLiveLogs } from '../services/logs.service'

export function useLiveLogs(dbId: string | null) {
  const query = useQuery({
    queryKey: ['logs', dbId],
    queryFn: () => getLiveLogs(dbId!),
    enabled: dbId !== null,
    refetchInterval: 3_000,
    staleTime: 2_000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
