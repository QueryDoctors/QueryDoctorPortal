'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnectionStore } from '@/store/connection.store'
import { useLiveLogs } from '../hooks/useLiveLogs'
import { LogRow } from './LogRow'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'

export function LogsPanel() {
  const { dbId } = useConnectionStore()
  const { data, isLoading } = useLiveLogs(dbId)
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new data arrives
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [data, autoScroll])

  // Detect manual scroll up → pause auto-scroll
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    setAutoScroll(atBottom)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-800 bg-gray-900/50 shrink-0">
        {/* Column headers */}
        <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">
          <span className="w-12 text-right">Time</span>
          <span className="w-32">State</span>
          <span className="w-12">PID</span>
          <span>Query</span>
        </div>

        <div className="flex items-center gap-3">
          {isLoading && <Spinner size="sm" />}
          {data && (
            <span className="text-xs text-gray-600">
              {data.length} active
            </span>
          )}
          <button
            type="button"
            onClick={() => setAutoScroll((v) => !v)}
            className={`text-xs transition-colors duration-100 ${
              autoScroll ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {autoScroll ? '↓ Live' : '⏸ Paused'}
          </button>
        </div>
      </div>

      {/* Log rows */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {!data && !isLoading && (
          <EmptyState message="No active sessions" description="Queries will appear here when running" />
        )}

        {data && data.length === 0 && (
          <EmptyState message="No active sessions" description="All connections are idle" />
        )}

        {data && data.map((entry) => (
          <LogRow key={entry.pid} entry={entry} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
