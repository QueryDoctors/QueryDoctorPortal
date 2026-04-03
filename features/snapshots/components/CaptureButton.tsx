'use client'

import { useConnectionStore } from '@/store/connection.store'
import { useCaptureSnapshot } from '../hooks/useSnapshots'

export function CaptureButton() {
  const { dbId, connectionId } = useConnectionStore()
  const { capture, isLoading } = useCaptureSnapshot()

  if (!dbId || !connectionId) return null

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => capture({ dbId, connectionId })}
      className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 rounded-md transition-colors duration-100"
    >
      {isLoading ? 'Capturing...' : 'Capture Snapshot'}
    </button>
  )
}
