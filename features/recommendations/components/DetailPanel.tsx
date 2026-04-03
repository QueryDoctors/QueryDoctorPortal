'use client'

import { useState } from 'react'
import { useAlertStore } from '@/store/alert.store'
import { useConnectionStore } from '@/store/connection.store'
import { useRecommendations } from '../hooks/useRecommendations'
import { SeverityBadge } from '@/components/ui/SeverityBadge'
import { TabGroup } from '@/components/ui/TabGroup'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Recommendation } from '../types/recommendation.types'

const TABS = ['Overview', 'Metrics']

export function DetailPanel() {
  const { selectedAlertId, setSelectedAlertId } = useAlertStore()
  const { dbId } = useConnectionStore()
  const [activeTab, setActiveTab] = useState('Overview')

  // Reads from React Query cache (populated by SSR + RecommendationFeed)
  // No extra network request — just a cache lookup
  const { data: recommendations } = useRecommendations(dbId)
  const selected = recommendations?.find((r) => r.id === selectedAlertId) ?? null

  if (!selectedAlertId || !selected) {
    return (
      <div className="flex flex-col flex-1 bg-gray-900 items-center justify-center">
        <EmptyState
          message="Select an alert to view details"
          description="Click any card in the feed"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-900 min-h-0 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <SeverityBadge severity={selected.severity} />
        </div>
        <button
          type="button"
          aria-label="Close detail panel"
          onClick={() => setSelectedAlertId(null)}
          className="text-gray-500 hover:text-gray-300 transition-colors duration-100 text-xl leading-none ml-2 shrink-0"
        >
          ×
        </button>
      </div>

      <TabGroup tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Overview' && <OverviewTab recommendation={selected} />}
        {activeTab === 'Metrics' && <MetricsTab />}
      </div>
    </div>
  )
}

function OverviewTab({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Problem
        </p>
        <p className="text-sm font-mono text-gray-300 bg-gray-800 rounded p-3 leading-relaxed">
          {recommendation.problem}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Impact
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {recommendation.impact}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Suggested Action
        </p>
        <p className="text-sm text-blue-400 leading-relaxed">
          → {recommendation.suggestion}
        </p>
      </div>
    </div>
  )
}

function MetricsTab() {
  return (
    <div className="px-4 py-4">
      <p className="text-xs text-gray-500">
        Capture a snapshot to see historical metrics for this connection.
      </p>
    </div>
  )
}
