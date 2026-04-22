import { useInfiniteQuery } from '@tanstack/react-query'
import { VoiceRecord } from '@/payload-types'

interface VoiceRecordsResponse {
  docs: VoiceRecord[]
  totalDocs: number
  hasNextPage: boolean
  nextPage: number | null
  page: number
  totalPages: number
}

const fetchVoiceRecords = async ({
  pageParam = 1,
}): Promise<VoiceRecordsResponse> => {
  const response = await fetch(
    `/api/voice-records-client?limit=10&page=${pageParam}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch voice records')
  }
  return response.json()
}

export const useVoiceRecordsInfiniteQuery = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ['voice-records', userId],
    queryFn: fetchVoiceRecords,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!userId,
  })
}
