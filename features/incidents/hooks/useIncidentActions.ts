import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useConnectionStore } from '@/store/connection.store'
import {
  acknowledgeIncident,
  resolveIncident,
  muteQuery,
  unmuteQuery,
  whitelistQuery,
} from '../services/incidents.service'

function useInvalidate() {
  const queryClient = useQueryClient()
  const dbId = useConnectionStore((s) => s.dbId)
  return () => queryClient.invalidateQueries({ queryKey: ['incidents', dbId] })
}

export function useAcknowledgeIncident() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (incidentId: string) => acknowledgeIncident(incidentId),
    onSuccess: invalidate,
  })
}

export function useResolveIncident() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (incidentId: string) => resolveIncident(incidentId),
    onSuccess: invalidate,
  })
}

export function useMuteQuery() {
  const invalidate = useInvalidate()
  const dbId = useConnectionStore((s) => s.dbId)
  return useMutation({
    mutationFn: (queryHash: string) => muteQuery(dbId!, queryHash),
    onSuccess: invalidate,
  })
}

export function useUnmuteQuery() {
  const invalidate = useInvalidate()
  const dbId = useConnectionStore((s) => s.dbId)
  return useMutation({
    mutationFn: (queryHash: string) => unmuteQuery(dbId!, queryHash),
    onSuccess: invalidate,
  })
}

export function useWhitelistQuery() {
  const invalidate = useInvalidate()
  const dbId = useConnectionStore((s) => s.dbId)
  return useMutation({
    mutationFn: (queryHash: string) => whitelistQuery(dbId!, queryHash),
    onSuccess: invalidate,
  })
}
