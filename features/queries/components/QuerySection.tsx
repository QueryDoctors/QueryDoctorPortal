'use client'

import { useState } from 'react'
import { useConnectionStore } from '@/store/connection.store'
import { useQueries } from '../hooks/useQueries'
import { QueryTable } from './QueryTable'
import { TabGroup } from '@/components/ui/TabGroup'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Spinner } from '@/components/ui/Spinner'

const TABS = ['Slow', 'Frequent', 'Heaviest']

export function QuerySection() {
  const { dbId } = useConnectionStore()
  const [activeTab, setActiveTab] = useState('Slow')
  const { data, isLoading, error } = useQueries(dbId)

  if (!dbId) return null

  const queries = data
    ? activeTab === 'Slow'
      ? data.slowQueries
      : activeTab === 'Frequent'
        ? data.frequentQueries
        : data.heaviestQueries
    : []

  return (
    <div className="flex flex-col border-t border-gray-800 mt-2">
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Queries
        </span>
        {isLoading && <Spinner size="sm" />}
      </div>

      <TabGroup tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-y-auto max-h-64">
        {error && <ErrorMessage message={error.message} />}
        {data && <QueryTable queries={queries} />}
      </div>
    </div>
  )
}
