import { useQuery } from '@tanstack/react-query'
import { VoiceRecord } from '@/payload-types'

interface VoiceRecordsResponse {
  docs: VoiceRecord[]
  totalDocs: number
}

const fetchVoiceRecords = async (): Promise<VoiceRecordsResponse> => {
  const response = await fetch('/api/voice-records')
  if (!response.ok) {
    throw new Error('Failed to fetch voice records')
  }
  return response.json()
}

export const useVoiceRecordsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['voice-records', userId],
    queryFn: fetchVoiceRecords,
    enabled: !!userId,
  })
}
