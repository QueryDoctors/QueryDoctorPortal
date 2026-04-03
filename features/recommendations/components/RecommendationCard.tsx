'use client'

import { SeverityBadge } from '@/components/ui/SeverityBadge'
import type { Recommendation } from '../types/recommendation.types'

interface Props {
  recommendation: Recommendation
  selected?: boolean
  onClick: (id: string) => void
}

const LEFT_BORDER: Record<Recommendation['severity'], string> = {
  critical: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-800',
}

export function RecommendationCard({ recommendation, selected, onClick }: Props) {
  const { id, severity, problem, suggestion } = recommendation

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={() => onClick(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(id)}
      className={`
        p-3 rounded-md border border-gray-700 border-l-4 cursor-pointer
        transition-colors duration-100
        ${LEFT_BORDER[severity]}
        ${selected ? 'bg-gray-700 ring-1 ring-blue-500/40' : 'bg-gray-800 hover:bg-gray-700/60'}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <SeverityBadge severity={severity} />
      </div>
      <p className={`mt-1.5 text-sm text-gray-100 line-clamp-2 ${severity === 'critical' ? 'font-semibold' : ''}`}>
        {problem}
      </p>
      <p className="mt-1 text-xs text-gray-500 line-clamp-1">{suggestion}</p>
    </div>
  )
}
