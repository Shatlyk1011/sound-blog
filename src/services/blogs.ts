import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Blog, VoiceRecord } from '@/payload-types'

interface BlogQueryResponse {
  docs: Blog[]
  totalDocs: number
  record: VoiceRecord | null
}

const readError = async (response: Response, fallback: string) => {
  const result = await response.json().catch(() => null)
  return result?.error || fallback
}

export const useBlogQuery = (recordId: string) => {
  return useQuery<BlogQueryResponse>({
    queryKey: ['blog', recordId],
    enabled: !!recordId,
    queryFn: async () => {
      const blogRes = await fetch(`/api/blogs-client?recordId=${recordId}`)
      if (!blogRes.ok) {
        throw new Error(await readError(blogRes, 'Failed to fetch blog'))
      }

      const blogData = (await blogRes.json()) as BlogQueryResponse

      if (blogData.docs.length > 0) {
        return { ...blogData, record: null }
      }

      const recordRes = await fetch(`/api/voice-records-client/${recordId}`)

      if (recordRes.status === 404) {
        return { ...blogData, record: null }
      }

      if (!recordRes.ok) {
        throw new Error(await readError(recordRes, 'Failed to fetch voice record'))
      }

      const recordData = (await recordRes.json()) as Pick<BlogQueryResponse, 'record'>
      return { ...blogData, record: recordData.record }
    },
    staleTime: 0,
    // Poll while generation is in-flight; stop once the blog exists or the record has failed.
    refetchInterval: (query) => {
      const docs = query.state.data?.docs
      const record = query.state.data?.record ?? (docs?.[0]?.recordId as VoiceRecord | undefined)

      if (record?.status === 'failed') return false
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
