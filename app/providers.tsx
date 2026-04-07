'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { makeQueryClient } from '@/lib/query-client'
import { AuthInitializer } from '@/features/auth/components/AuthInitializer'
import { useAuthStore } from '@/store/auth.store'

const PUBLIC_PATHS = ['/login']

function AuthGate({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized)
  const pathname = usePathname()

  // On public routes (login), skip the gate entirely
  if (PUBLIC_PATHS.includes(pathname)) return <>{children}</>

  // Show a minimal spinner while the silent refresh is in flight
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />
      </div>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <AuthGate>{children}</AuthGate>
    </QueryClientProvider>
  )
}
