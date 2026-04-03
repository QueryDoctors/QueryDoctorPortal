import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useMetrics } from '@/features/metrics/hooks/useMetrics'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useMetrics', () => {
  it('returns loading then camelCase domain data', async () => {
    const { result } = renderHook(
      () => useMetrics('test-db-id'),
      { wrapper: makeWrapper() },
    )

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const data = result.current.data!
    expect(data.activeConnections).toBe(12)
    expect(data.qps).toBe(45.5)
    expect(data.avgQueryTimeMs).toBe(18.3)
    expect(data.totalQueries).toBe(9823)
  })

  it('does not fetch when dbId is null', () => {
    const { result } = renderHook(
      () => useMetrics(null),
      { wrapper: makeWrapper() },
    )
    expect(result.current.isLoading).toBe(false)
  })
})
