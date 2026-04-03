import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useRecommendations } from '@/features/recommendations/hooks/useRecommendations'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useRecommendations', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(
      () => useRecommendations('test-db-id'),
      { wrapper: makeWrapper() },
    )
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('returns mapped domain data with FE severity values', async () => {
    const { result } = renderHook(
      () => useRecommendations('test-db-id'),
      { wrapper: makeWrapper() },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBeDefined()
    const severities = result.current.data!.map((r) => r.severity)
    // FE values only — never 'high' or 'medium'
    expect(severities).not.toContain('high')
    expect(severities).not.toContain('medium')
    expect(severities).not.toContain('low')
    expect(severities).toContain('critical')
    expect(severities).toContain('warning')
  })

  it('sorts critical before warning', async () => {
    const { result } = renderHook(
      () => useRecommendations('test-db-id'),
      { wrapper: makeWrapper() },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const data = result.current.data!
    const criticalIdx = data.findIndex((r) => r.severity === 'critical')
    const warningIdx = data.findIndex((r) => r.severity === 'warning')
    expect(criticalIdx).toBeLessThan(warningIdx)
  })

  it('does not fetch when dbId is null', () => {
    const { result } = renderHook(
      () => useRecommendations(null),
      { wrapper: makeWrapper() },
    )
    // enabled: false → isLoading stays false, no request fired
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('ids are stable across re-renders', async () => {
    const { result, rerender } = renderHook(
      () => useRecommendations('test-db-id'),
      { wrapper: makeWrapper() },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const firstIds = result.current.data!.map((r) => r.id)

    rerender()
    const secondIds = result.current.data!.map((r) => r.id)
    expect(firstIds).toEqual(secondIds)
  })
})
