import { useMutation, useQueryClient } from '@tanstack/react-query'
import { connectDatabase } from '../services/connection.service'
import type { ConnectFormValues, ConnectResult } from '../types/connection.types'

export function useConnectDb() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ConnectResult, Error, ConnectFormValues>({
    mutationFn: connectDatabase,
    onSuccess: () => {
      // Invalidate all cached server data when a new connection is made
      queryClient.invalidateQueries()
    },
  })

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    connect: mutation.mutate,
    connectAsync: mutation.mutateAsync,
    reset: mutation.reset,
  }
}
