import { useQuery } from '@tanstack/react-query'
import { getRecommendations } from '../services/recommendation.service'
import type { AlertFilters, Recommendation } from '../types/recommendation.types'

const ORDER: Record<Recommendation['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

export function useRecommendations(dbId: string | null, filters?: AlertFilters) {
  const query = useQuery({
    // queryKey does NOT include filters — base data cached under [dbId]
    // select handles client-side filtering so SSR prefetch key matches
    queryKey: ['recommendations', dbId],
    queryFn: () => getRecommendations(dbId!),
    enabled: dbId !== null,
    refetchInterval: 5_000,
    staleTime: 4_000,
    select: (data) => {
      let result = [...data]

      if (filters?.severity) {
        result = result.filter((r) => r.severity === filters.severity)
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(
          (r) =>
            r.problem.toLowerCase().includes(q) ||
            r.suggestion.toLowerCase().includes(q),
        )
      }

      return result.sort(
        (a, b) => ORDER[a.severity] - ORDER[b.severity],
      )
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
