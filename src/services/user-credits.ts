import { useQuery } from '@tanstack/react-query'
import { UserDataResponse } from '@/app/api/user-data/route'

export const useUserCreditsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-credits', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required')
      }
      const response = await fetch('/api/user-data')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      return (await response.json()) as UserDataResponse
    },
    enabled: !!userId,
  })
}
