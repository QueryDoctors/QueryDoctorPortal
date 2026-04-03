import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { captureSnapshot, listSnapshots } from '../services/snapshot.service'

export function useSnapshots(connectionId: string | null) {
  const query = useQuery({
    queryKey: ['snapshots', connectionId],
    queryFn: () => listSnapshots(connectionId!),
    enabled: connectionId !== null,
    staleTime: 30_000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export function useCaptureSnapshot() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ dbId, connectionId }: { dbId: string; connectionId: string }) =>
      captureSnapshot(dbId, connectionId),
    onSuccess: (_, { connectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['snapshots', connectionId] })
    },
  })

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    capture: mutation.mutate,
    captureAsync: mutation.mutateAsync,
  }
}
