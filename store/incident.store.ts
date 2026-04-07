import { create } from 'zustand'
import type { IncidentSeverity, IncidentStatus } from '@/features/incidents/types/incident.types'

interface IncidentFilters {
  severity: IncidentSeverity[]   // [] = show all
  status: IncidentStatus[]       // [] = show all
  search: string
}

interface IncidentStore {
  selectedIncidentId: string | null
  seenIncidentIds: Record<string, boolean>
  filters: IncidentFilters

  setSelectedIncidentId: (id: string | null) => void
  markAsSeen: (ids: string[]) => void
  setFilters: (partial: Partial<IncidentFilters>) => void
  clearFilters: () => void
}

const DEFAULT_FILTERS: IncidentFilters = {
  severity: [],
  status: [],
  search: '',
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  selectedIncidentId: null,
  seenIncidentIds: {},
  filters: DEFAULT_FILTERS,

  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),

  markAsSeen: (ids) =>
    set((s) => {
      const next = { ...s.seenIncidentIds }
      ids.forEach((id) => { next[id] = true })
      return { seenIncidentIds: next }
    }),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
