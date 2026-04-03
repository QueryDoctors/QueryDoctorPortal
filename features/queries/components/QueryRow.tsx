import type { QueryStat } from '../types/query.types'

interface Props {
  stat: QueryStat
}

export function QueryRow({ stat }: Props) {
  const isHighLatency = stat.meanTime > 200

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors duration-100">
      <td className="px-3 py-2 text-xs font-mono text-gray-300 max-w-xs truncate">
        {stat.query}
      </td>
      <td className={`px-3 py-2 text-xs text-right ${isHighLatency ? 'text-red-400' : 'text-gray-300'}`}>
        {stat.meanTime.toFixed(1)} ms
      </td>
      <td className="px-3 py-2 text-xs text-right text-gray-400">
        {stat.calls.toLocaleString()}
      </td>
      <td className="px-3 py-2 text-xs text-right text-gray-400">
        {stat.totalTime.toFixed(0)} ms
      </td>
    </tr>
  )
}
