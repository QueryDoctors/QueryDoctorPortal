'use client'

import { useAlertStore } from '@/store/alert.store'
import type { Recommendation } from '../types/recommendation.types'

const SEVERITY_CHIPS: Array<{ label: string; value: Recommendation['severity'] | undefined }> = [
  { label: 'All', value: undefined },
  { label: 'Critical', value: 'critical' },
  { label: 'Warning', value: 'warning' },
  { label: 'Info', value: 'info' },
]

export function RecommendationFilter() {
  const { filters, setFilters, clearFilters } = useAlertStore()
  const hasActiveFilter = filters.severity !== undefined || Boolean(filters.search)

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <input
        type="text"
        placeholder="Search problems..."
        value={filters.search ?? ''}
        onChange={(e) => setFilters({ search: e.target.value || undefined })}
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <div className="flex items-center gap-1.5">
        {SEVERITY_CHIPS.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            onClick={() => setFilters({ severity: value })}
            className={`px-2 py-1 text-xs rounded transition-colors duration-100 ${
              filters.severity === value
                ? 'bg-blue-900/40 border border-blue-500/40 text-blue-300'
                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}

        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors duration-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
