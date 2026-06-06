import { VoiceRecord } from '@/payload-types'

export type EmptyBlogState = {
  tone: 'default' | 'destructive'
  title: string
  description: string
  showRetry: boolean
  showSpinner: boolean
}

export const getEmptyBlogState = (voiceRecord: VoiceRecord | null | undefined): EmptyBlogState => {
  switch (voiceRecord?.status) {
    case 'failed':
      return {
        tone: 'destructive',
        title: 'Generation failed',
        description:
          'This recording failed while generating the article. Try again to send it back through the workflow.',
        showRetry: true,
        showSpinner: false,
      }
    case 'completed':
      return {
        tone: 'default',
        title: 'Article is almost ready',
        description:
          'The recording finished successfully, but the article has not appeared here yet. Please wait a bit while we sync the final result.',
        showRetry: false,
        showSpinner: true,
      }
    case 'processing':
      return {
        tone: 'default',
        title: 'Article is being generated',
        description:
          'The workflow is processing this recording. This page refreshes automatically while generation continues.',
        showRetry: false,
        showSpinner: true,
      }
    case 'uploaded':
      return {
        tone: 'default',
        title: 'Recording is queued',
        description: 'Your upload is saved and waiting for the generator to start. This page refreshes automatically.',
        showRetry: false,
        showSpinner: true,
      }
    default:
      return {
        tone: 'default',
        title: 'Recording not found',
        description: 'We could not find a recording or article for this page. Go back to recordings and open it again.',
        showRetry: false,
        showSpinner: false,
      }
  }
}
