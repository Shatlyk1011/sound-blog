import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Blog, VoiceRecord } from '@/payload-types'

interface BlogQueryResponse {
  docs: Blog[]
  totalDocs: number
  record: VoiceRecord | null
}

export const useBlogQuery = (recordId: string) => {
  return useQuery<BlogQueryResponse>({
    queryKey: ['blog', recordId],
    enabled: !!recordId,
    queryFn: async () => {
      const res = await fetch(`/api/blogs-client?recordId=${recordId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch blog')
      }
      return res.json()
    },
    staleTime: 0,
    // Poll while generation is in-flight; stop once the blog exists or the record has failed.
    refetchInterval: (query) => {
      const docs = query.state.data?.docs

      if ((docs?.[0]?.recordId as VoiceRecord)?.status === 'failed') return false
      return Array.isArray(docs) && docs.length > 0 ? false : 3000
    },
  })
}

export const useUpdateBlogMutation = (recordId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ blogId, content, title }: { blogId: string; content?: string; title?: string }) => {
      const res = await fetch(`/api/blogs-client/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, title }),
      })
      if (!res.ok) throw new Error('Failed to update blog')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', recordId] })
    },
  })
}
