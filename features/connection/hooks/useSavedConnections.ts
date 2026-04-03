import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteSavedConnection,
  getSavedConnections,
  saveConnection,
} from '../services/saved-connection.service'
import type { SaveConnectionRequest } from '../types/saved-connection.types'

export function useSavedConnections() {
  const query = useQuery({
    queryKey: ['saved-connections'],
    queryFn: getSavedConnections,
    staleTime: 30_000,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export function useSaveConnection() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (body: SaveConnectionRequest) => saveConnection(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-connections'] })
    },
  })

  return {
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    save: mutation.mutate,
    saveAsync: mutation.mutateAsync,
  }
}

export function useDeleteSavedConnection() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => deleteSavedConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-connections'] })
    },
  })

  return {
    isLoading: mutation.isPending,
    error: mutation.error,
    deleteConnection: mutation.mutate,
  }
}
