import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AlertFilters } from '@/features/recommendations/types/recommendation.types'

interface AlertStore {
  selectedAlertId: string | null
  filters: AlertFilters
  bottomPanelOpen: boolean

  setSelectedAlertId: (id: string | null) => void
  setFilters: (partial: Partial<AlertFilters>) => void
  clearFilters: () => void
  toggleBottomPanel: () => void
}

const DEFAULT_FILTERS: AlertFilters = {
  severity: undefined,
  search: undefined,
  timeRange: '1h',
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set) => ({
      selectedAlertId: null,
      filters: DEFAULT_FILTERS,
      bottomPanelOpen: false,

      setSelectedAlertId: (id) => set({ selectedAlertId: id }),

      setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial } })),

      clearFilters: () => set({ filters: DEFAULT_FILTERS }),

      toggleBottomPanel: () =>
        set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
    }),
    {
      name: 'alert-store',
      partialize: (s) => ({
        filters: s.filters,
        bottomPanelOpen: s.bottomPanelOpen,
        // selectedAlertId intentionally NOT persisted — stale on reload
      }),
    },
  ),
)
