'use client'

import { useAlertStore } from '@/store/alert.store'
import { useConnectionStore } from '@/store/connection.store'
import { useRecommendations } from '../hooks/useRecommendations'
import { RecommendationCard } from './RecommendationCard'
import { RecommendationFilter } from './RecommendationFilter'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Spinner } from '@/components/ui/Spinner'

export function RecommendationFeed() {
  const { dbId } = useConnectionStore()
  const { filters, selectedAlertId, setSelectedAlertId } = useAlertStore()
  const { data, isLoading, error } = useRecommendations(dbId, filters)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Alerts
        </span>
        <div className="flex items-center gap-2">
          {data && (
            <span className="text-xs bg-gray-700 rounded px-1.5 py-0.5 text-gray-300">
              {data.length}
            </span>
          )}
          {isLoading && <Spinner size="sm" />}
        </div>
      </div>

      <RecommendationFilter />

      {/* List area */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {error && (
          <ErrorMessage message={error.message} />
        )}

        {!error && !isLoading && data?.length === 0 && (
          <EmptyState
            message="No alerts"
            description="All systems look healthy."
          />
        )}

        {data && data.length > 0 && (
          <div role="list" className="flex flex-col gap-1.5">
            {data.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                selected={selectedAlertId === rec.id}
                onClick={setSelectedAlertId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
