import { SplitLayout } from '@/components/layout/SplitLayout'
import { RecommendationFeed } from '@/features/recommendations/components/RecommendationFeed'
import { DetailPanel } from '@/features/recommendations/components/DetailPanel'
import { MetricsGrid } from '@/features/metrics/components/MetricsGrid'
import { QueryFeed } from '@/features/queries/components/QueryFeed'
import { IncidentFeed } from '@/features/incidents/components/IncidentFeed'
import { IncidentDetailPanelClient } from '@/features/incidents/components/IncidentDetailPanelClient'

// Server-side prefetch is intentionally omitted — the access token lives in the
// client-side Zustand store (restored via /auth/refresh on mount). All data
// is fetched client-side by React Query after auth is initialised.

interface Props {
  params: Promise<{ db_id: string }>
}

export default async function DashboardPage({ params }: Props) {
  await params // resolve params — db_id is read by client components via the URL

  const left = (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
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

  return <SplitLayout left={left} right={right} />
}
