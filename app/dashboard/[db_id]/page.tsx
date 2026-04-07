import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { SplitLayout } from '@/components/layout/SplitLayout'
import { RecommendationFeed } from '@/features/recommendations/components/RecommendationFeed'
import { DetailPanel } from '@/features/recommendations/components/DetailPanel'
import { MetricsGrid } from '@/features/metrics/components/MetricsGrid'
import { QueryFeed } from '@/features/queries/components/QueryFeed'
import { IncidentFeed } from '@/features/incidents/components/IncidentFeed'
import { IncidentDetailPanelClient } from '@/features/incidents/components/IncidentDetailPanelClient'
import { getRecommendations } from '@/features/recommendations/services/recommendation.service'
import { getMetrics } from '@/features/metrics/services/metrics.service'
import { getQueries } from '@/features/queries/services/queries.service'

interface Props {
  params: Promise<{ db_id: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { db_id } = await params
  const queryClient = new QueryClient()

  // Prefetch all in parallel — errors are swallowed (404 handled client-side)
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
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      {/* Alert-first: incidents at the top */}
      <IncidentFeed />
      <MetricsGrid />
      <QueryFeed />
      <RecommendationFeed />
    </div>
  )

  const right = (
    <div className="flex flex-col h-full">
      <IncidentDetailPanelClient />
      <DetailPanel />
    </div>
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SplitLayout left={left} right={right} />
    </HydrationBoundary>
  )
}
