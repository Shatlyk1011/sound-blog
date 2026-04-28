import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stringify } from 'qs-esm';





export const useBlogQuery = (recordId: string) => {
  const stringifiedQuery = stringify(
    {
      where: { recordId: { equals: recordId } },
      depth: 1,
      limit: 1,
    },
    { addQueryPrefix: true }
  )

  return useQuery({
    queryKey: ['blog', recordId],
    queryFn: async () => {
      const res = await fetch(`/api/blogs${stringifiedQuery}&summary=true`)
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
      const res = await fetch(`/api/blogs/${blogId}`, {
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
