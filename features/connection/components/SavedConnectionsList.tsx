'use client'

import { useRouter } from 'next/navigation'
import { useConnectDb } from '../hooks/useConnectDb'
import { useDeleteSavedConnection, useSavedConnections } from '../hooks/useSavedConnections'
import { useConnectionStore } from '@/store/connection.store'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import type { SavedConnection } from '../types/saved-connection.types'

export function SavedConnectionsList() {
  const { data, isLoading } = useSavedConnections()

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="No saved connections"
        description="Connect to a database above to save it."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((conn) => (
        <SavedConnectionRow key={conn.id} connection={conn} />
      ))}
    </div>
  )
}

function SavedConnectionRow({ connection }: { connection: SavedConnection }) {
  const router = useRouter()
  const { connect, isLoading: isConnecting } = useConnectDb()
  const { deleteConnection, isLoading: isDeleting } = useDeleteSavedConnection()
  const setConnection = useConnectionStore((s) => s.setConnection)

  const handleConnect = () => {
    // Saved connections don't store password — user must re-enter
    // For now navigate to connect page pre-filled; full reconnect needs password
    router.push('/connect')
  }

  const handleDelete = () => {
    deleteConnection(connection.id)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-md">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-gray-100 truncate">
          {connection.name}
        </span>
        <span className="text-xs text-gray-500">
          {connection.host}:{connection.port}/{connection.database}
        </span>
        {connection.lastUsed && (
          <span className="text-xs text-gray-600">
            Last used {new Date(connection.lastUsed).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 ml-3 shrink-0">
        <button
          type="button"
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-md transition-colors duration-100"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-red-400 disabled:opacity-50 transition-colors duration-100"
          aria-label={`Delete ${connection.name}`}
        >
          {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
