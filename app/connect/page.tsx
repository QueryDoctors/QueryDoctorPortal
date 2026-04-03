import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { ConnectionForm } from '@/features/connection/components/ConnectionForm'
import { SavedConnectionsList } from '@/features/connection/components/SavedConnectionsList'
import { getSavedConnections } from '@/features/connection/services/saved-connection.service'

export default async function ConnectPage() {
  const queryClient = new QueryClient()

  // Prefetch saved connections server-side — renders without a loading spinner
  await queryClient.prefetchQuery({
    queryKey: ['saved-connections'],
    queryFn: getSavedConnections,
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-sm font-semibold text-gray-100 tracking-wide uppercase">
            DB Monitor
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            PostgreSQL Performance Advisor
          </p>
        </div>

        {/* Connect form */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            New Connection
          </h2>
          <ConnectionForm />
        </section>

        {/* Saved connections — SSR data available immediately */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Saved Connections
            </h2>
            <SavedConnectionsList />
          </section>
        </HydrationBoundary>
      </div>
    </div>
  )
}
