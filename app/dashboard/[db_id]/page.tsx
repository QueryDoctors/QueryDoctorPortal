import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { SplitLayout } from '@/components/layout/SplitLayout'
import { RecommendationFeed } from '@/features/recommendations/components/RecommendationFeed'
import { DetailPanel } from '@/features/recommendations/components/DetailPanel'
import { MetricsGrid } from '@/features/metrics/components/MetricsGrid'
import { QuerySection } from '@/features/queries/components/QuerySection'
import { getRecommendations } from '@/features/recommendations/services/recommendation.service'
import { getMetrics } from '@/features/metrics/services/metrics.service'
import { getQueries } from '@/features/queries/services/queries.service'

interface Props {
  params: Promise<{ db_id: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { db_id } = await params
  const queryClient = new QueryClient()

  // Prefetch all three in parallel — errors are swallowed (404 handled client-side)
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['metrics', db_id],
      queryFn: () => getMetrics(db_id),
    }),
    queryClient.prefetchQuery({
      queryKey: ['queries', db_id],
      queryFn: () => getQueries(db_id),
    }),
    queryClient.prefetchQuery({
      queryKey: ['recommendations', db_id],
      queryFn: () => getRecommendations(db_id),
    }),
  ])

  const left = (
    <div className="flex flex-col flex-1 min-h-0">
      <MetricsGrid />
      <QuerySection />
      <RecommendationFeed />
    </div>
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SplitLayout left={left} right={<DetailPanel />} />
    </HydrationBoundary>
  )
}
