import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VoiceRecord } from '@/payload-types';
import { toast } from 'sonner';






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
    refetchInterval: isRefetchAvailable ? 3000 : false,
  })
}

const deleteVoiceRecord = async (id: string): Promise<void> => {
  const response = await fetch(`/api/voice-records-client/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    toast.error('Failed to delete your voice record. Please try again')
  }
}

export const useDeleteVoiceRecordMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVoiceRecord,
    onSuccess: () => {
      toast.success('Your record deleted. Updating your list')
      queryClient.invalidateQueries({ queryKey: ['voice-records', userId] })
    },
  })
}
