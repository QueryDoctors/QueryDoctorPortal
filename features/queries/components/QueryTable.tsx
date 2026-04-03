import type { QueryStat } from '../types/query.types'
import { QueryRow } from './QueryRow'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  queries: QueryStat[]
}

export function QueryTable({ queries }: Props) {
  if (queries.length === 0) {
    return <EmptyState message="No queries found" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">Query</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Avg Time</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Calls</th>
            <th className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((stat, i) => (
            <QueryRow key={i} stat={stat} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
