'use client'

import { useMemo, useState } from 'react'
import { useConnectionStore } from '@/store/connection.store'
import { useQueries } from '../hooks/useQueries'
import { useQueryHistory } from '../hooks/useQueryHistory'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { QueryStat } from '../types/query.types'
import type { LatencyPoint } from '../services/queryHistory.service'

// 500ms = absolute detection floor — queries at this level are at-risk
const RISK_FLOOR_MS = 500

interface RankedQuery extends QueryStat {
  riskScore: number   // 0–100, percentage toward RISK_FLOOR_MS
  riskRatio: number   // meanTime / RISK_FLOOR_MS
  sources: string[]   // which lists this query appeared in
}

function buildFeed(
  slow: QueryStat[],
  frequent: QueryStat[],
  heaviest: QueryStat[],
): RankedQuery[] {
  const map = new Map<string, RankedQuery>()

  const tag = (queries: QueryStat[], source: string) => {
    for (const q of queries) {
      const key = q.query.slice(0, 120)
      const existing = map.get(key)
      if (existing) {
        if (!existing.sources.includes(source)) existing.sources.push(source)
      } else {
        map.set(key, {
          ...q,
          riskRatio: q.meanTime / RISK_FLOOR_MS,
          riskScore: Math.min(100, Math.round((q.meanTime / RISK_FLOOR_MS) * 100)),
          sources: [source],
        })
      }
    }
  }

  tag(slow, 'slow')
  tag(frequent, 'frequent')
  tag(heaviest, 'heaviest')

  return Array.from(map.values()).sort((a, b) => b.meanTime - a.meanTime)
}

function RiskBar({ score, ratio }: { score: number; ratio: number }) {
  const color =
    ratio >= 2   ? 'bg-red-500' :
    ratio >= 1   ? 'bg-yellow-500' :
    ratio >= 0.5 ? 'bg-blue-500' :
                   'bg-gray-600'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono w-10 text-right ${
        ratio >= 2 ? 'text-red-400' : ratio >= 1 ? 'text-yellow-400' : 'text-gray-500'
      }`}>
        {ratio >= 10 ? '>10x' : `${ratio.toFixed(1)}x`}
      </span>
    </div>
  )
}

function SourceBadge({ source }: { source: string }) {
  const cls =
    source === 'slow'     ? 'bg-red-900/40 text-red-400' :
    source === 'frequent' ? 'bg-blue-900/40 text-blue-400' :
                            'bg-purple-900/40 text-purple-400'
  return (
    <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${cls}`}>
      {source}
    </span>
  )
}

function LatencySparkline({ points }: { points: LatencyPoint[] }) {
  if (points.length < 2) {
    return <p className="text-[10px] text-gray-600 py-1">Not enough history</p>
  }

  const W = 280
  const H = 48
  const PAD = 4

  const values = points.map((p) => p.ms)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const xs = points.map((_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2))
  const ys = values.map((v) => PAD + ((max - v) / range) * (H - PAD * 2))

  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')

  // fill area under curve
  const fill =
    `${d} L${xs[xs.length - 1].toFixed(1)},${(H - PAD).toFixed(1)} L${PAD},${(H - PAD).toFixed(1)} Z`

  const latest = values[values.length - 1]
  const peak = max

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-600">2h latency history</span>
        <span className="text-[10px] font-mono text-gray-500">
          peak <span className="text-yellow-400">{peak.toFixed(0)}ms</span>
          &nbsp;·&nbsp;now <span className="text-gray-300">{latest.toFixed(0)}ms</span>
        </span>
      </div>
      <svg width={W} height={H} className="w-full">
        {/* fill */}
        <path d={fill} fill="rgba(99,102,241,0.08)" />
        {/* line */}
        <path d={d} fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
        {/* latest dot */}
        <circle
          cx={xs[xs.length - 1]}
          cy={ys[ys.length - 1]}
          r="2.5"
          fill="#818cf8"
        />
      </svg>
    </div>
  )
}

function ExpandedHistory({ dbId, queryText }: { dbId: string; queryText: string }) {
  const { data, isLoading } = useQueryHistory(dbId, queryText, 2)

  if (isLoading) {
    return <div className="mt-2 flex items-center gap-1"><Spinner size="sm" /><span className="text-[10px] text-gray-600">Loading history…</span></div>
  }
  if (!data || data.length === 0) {
    return <p className="mt-2 text-[10px] text-gray-600">No history in ClickHouse yet — run the detector or seed script.</p>
  }
  return <LatencySparkline points={data} />
}

export function QueryFeed() {
  const { dbId } = useConnectionStore()
  const { data, isLoading, error } = useQueries(dbId)
  const [expanded, setExpanded] = useState<string | null>(null)

  const feed = useMemo(() => {
    if (!data) return []
    return buildFeed(data.slowQueries, data.frequentQueries, data.heaviestQueries)
  }, [data])

  if (!dbId) return null

  return (
    <div className="flex flex-col border-t border-gray-800 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Query Feed
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Spinner size="sm" />}
          <span className="text-[10px] text-gray-600">sorted by risk</span>
        </div>
      </div>

      {error && <div className="px-4 pb-2"><ErrorMessage message={error.message} /></div>}

      {/* Legend */}
      {feed.length > 0 && (
        <div className="flex items-center gap-3 px-4 pb-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-[10px] text-gray-600">&lt;0.5x</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] text-gray-600">0.5–1x</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-[10px] text-gray-600">1–2x (warning)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] text-gray-600">&gt;2x (at risk)</span>
          </div>
        </div>
      )}

      {/* Query list */}
      <div className="overflow-y-auto max-h-[32rem] flex flex-col divide-y divide-gray-800/50">
        {feed.length === 0 && !isLoading && (
          <p className="px-4 py-6 text-xs text-gray-600 text-center">
            No query data yet — detection cycle runs every 10s
          </p>
        )}

        {feed.map((q) => {
          const key = q.query.slice(0, 120)
          const isOpen = expanded === key

          return (
            <div key={key} className="flex flex-col">
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full text-left px-4 py-2 hover:bg-gray-800/40 transition-colors"
              >
                {/* Top row: query preview + latency */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs text-gray-300 font-mono truncate flex-1">
                    {isOpen
                      ? q.query
                      : q.query.length > 80
                        ? q.query.slice(0, 80) + '…'
                        : q.query}
                  </span>
                  <span className={`text-xs font-mono shrink-0 ${
                    q.riskRatio >= 2 ? 'text-red-400' :
                    q.riskRatio >= 1 ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {q.meanTime.toFixed(1)}ms
                  </span>
                </div>

                {/* Risk bar */}
                <RiskBar score={q.riskScore} ratio={q.riskRatio} />

                {/* Bottom row: stats + source badges */}
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-3 text-[10px] text-gray-600">
                    <span>{q.calls.toLocaleString()} calls</span>
                    <span>{q.totalTime.toFixed(0)}ms total</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {q.sources.map((s) => <SourceBadge key={s} source={s} />)}
                  </div>
                </div>
              </button>

              {/* Expanded: latency history from ClickHouse */}
              {isOpen && (
                <div className="px-4 pb-3 bg-gray-900/50">
                  <ExpandedHistory dbId={dbId} queryText={q.query} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
