import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { VoiceRecord } from '@/payload-types'
import { toast } from 'sonner'

interface VoiceRecordsResponse {
  docs: VoiceRecord[]
  totalDocs: number
  hasNextPage: boolean
  nextPage: number | null
  page: number
  totalPages: number
}

const fetchVoiceRecords = async ({ pageParam = 1 }): Promise<VoiceRecordsResponse> => {
  const response = await fetch(`/api/voice-records-client?depth=0&limit=10&page=${pageParam}`)
  if (!response.ok) {
    throw new Error('Failed to fetch voice records')
  }
  return response.json()
}

export const useVoiceRecordsInfiniteQuery = (userId: string | undefined, isRefetchAvailable: boolean) => {
  return useInfiniteQuery({
    queryKey: ['voice-records', userId],
    queryFn: fetchVoiceRecords,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    enabled: !!userId,
    refetchInterval: isRefetchAvailable ? 3000 : 0,
  })
}

const deleteVoiceRecord = async (id: string): Promise<void> => {
  const response = await fetch(`/api/delete-voice-record/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete your voice record. Please try again')
  }
}

export const useDeleteVoiceRecordMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVoiceRecord,
    onSuccess: () => {
      toast.success('Your record deleted. Updating your list')
      queryClient.invalidateQueries({ queryKey: ['voice-records', userId] })
      queryClient.invalidateQueries({ queryKey: ['voice-record'] })
    },
  })
}

const retryVoiceRecord = async (id: string): Promise<void> => {
  const response = await fetch(`/api/upload-voice-record/try-again/${id}`, {
    method: 'POST',
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error || 'Failed to retry voice record generation. Please try again')
  }
}

export const useRetryVoiceRecordMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: retryVoiceRecord,
    onSuccess: () => {
      toast.success('Retry started. Your article is generating again')
      queryClient.invalidateQueries({ queryKey: ['voice-records', userId] })
      queryClient.invalidateQueries({ queryKey: ['voice-record'] })
      queryClient.invalidateQueries({ queryKey: ['blog'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to retry voice record generation')
    },
  })
}
