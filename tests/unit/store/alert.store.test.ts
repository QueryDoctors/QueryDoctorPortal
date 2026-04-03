import { describe, it, expect, beforeEach } from 'vitest'
import { useAlertStore } from '@/store/alert.store'

describe('useAlertStore', () => {
  beforeEach(() => {
    useAlertStore.setState({
      selectedAlertId: null,
      filters: { severity: undefined, search: undefined, timeRange: '1h' },
      bottomPanelOpen: false,
    })
  })

  it('starts with correct defaults', () => {
    const { selectedAlertId, filters, bottomPanelOpen } = useAlertStore.getState()
    expect(selectedAlertId).toBeNull()
    expect(filters.timeRange).toBe('1h')
    expect(bottomPanelOpen).toBe(false)
  })

  it('sets selectedAlertId', () => {
    useAlertStore.getState().setSelectedAlertId('alert-123')
    expect(useAlertStore.getState().selectedAlertId).toBe('alert-123')
  })

  it('clears selectedAlertId', () => {
    useAlertStore.getState().setSelectedAlertId('alert-123')
    useAlertStore.getState().setSelectedAlertId(null)
    expect(useAlertStore.getState().selectedAlertId).toBeNull()
  })

  it('merges filters', () => {
    useAlertStore.getState().setFilters({ severity: 'critical' })
    const { filters } = useAlertStore.getState()
    expect(filters.severity).toBe('critical')
    expect(filters.timeRange).toBe('1h') // unchanged
  })

  it('clears filters back to defaults', () => {
    useAlertStore.getState().setFilters({ severity: 'critical', search: 'pool' })
    useAlertStore.getState().clearFilters()
    const { filters } = useAlertStore.getState()
    expect(filters.severity).toBeUndefined()
    expect(filters.search).toBeUndefined()
    expect(filters.timeRange).toBe('1h')
  })

  it('toggles bottomPanelOpen', () => {
    useAlertStore.getState().toggleBottomPanel()
    expect(useAlertStore.getState().bottomPanelOpen).toBe(true)
    useAlertStore.getState().toggleBottomPanel()
    expect(useAlertStore.getState().bottomPanelOpen).toBe(false)
  })
})
