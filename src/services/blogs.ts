import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useBlogQuery = (recordId: string, userId?: string) => {
  return useQuery({
    queryKey: ['blog', recordId],
    enabled: !!recordId && !!userId,
    queryFn: async () => {
      const res = await fetch(`/api/blogs-client?recordId=${recordId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch blog')
      }
      return res.json()
    },
  })
}

export const useUpdateBlogMutation = (recordId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ blogId, content }: { blogId: string; content: string }) => {
      const res = await fetch(`/api/blogs-client/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error('Failed to update blog')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', recordId] })
    },
  })
}
