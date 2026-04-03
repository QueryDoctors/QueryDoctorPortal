import { useQuery } from '@tanstack/react-query'
import { getQueries } from '../services/queries.service'

export function useQueries(dbId: string | null) {
  const query = useQuery({
    queryKey: ['queries', dbId],
    queryFn: () => getQueries(dbId!),
    enabled: dbId !== null,
    staleTime: 9_000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
