import type { CollectionConfig } from 'payload'
import { deleteR2ObjectFromUrl } from '@/lib/r2'
import { adminsAndUserCreate } from './hooks'

const Blogs: CollectionConfig = {
  slug: 'blogs',

  admin: {
    defaultColumns: ['title', 'userId', 'status', 'tone', 'createdAt'],
    useAsTitle: 'title',
    description:
      'Stores AI-generated blog posts created from user voice recordings. Each blog links to its source audio, transcript, and the authoring user.',
  },

  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        try {
          const blog = await req.payload.findByID({
            collection: 'blogs',
            id,
            depth: 0,
          })

          await deleteR2ObjectFromUrl({
            bucket: process.env.R2_VOICE_RECORD_BUCKET,
            logPrefix: 'Blogs',
            url: blog?.ttsVoiceUrl as string | undefined,
          })
        } catch (err) {
          console.error('[Blogs] beforeDelete hook error:', err)
        }
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'update') return data

        // Only act when content is being changed (ttsVoiceUrl becomes stale)
        if (!('content' in data)) return data

        try {
          // Retrieve the current document to check for an existing ttsVoiceUrl
          const id = req.routeParams?.id as string | undefined
          if (!id) return data

          const existing = await req.payload.findByID({
            collection: 'blogs',
            id,
            depth: 0,
          })

          const existingUrl = existing?.ttsVoiceUrl as string | undefined

          if (existingUrl) {
            await deleteR2ObjectFromUrl({
              bucket: process.env.R2_VOICE_RECORD_BUCKET,
              logPrefix: 'Blogs',
              url: existingUrl,
            })
          }
        } catch (err) {
          console.error('[Blogs] beforeChange hook error:', err)
        }

        // Clear the stale TTS URL so it is no longer served
        return { ...data, ttsVoiceUrl: undefined }
      },
    ],
  },

  access: {
    read: adminsAndUserCreate,
    create: adminsAndUserCreate,
    update: adminsAndUserCreate,
    delete: adminsAndUserCreate,
  },

  fields: [
    {
      name: 'userId',
      label: 'User (users collection)',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: {
        read: ({ req }) => {
          if (req?.query?.summary) {
            return false
          }
          return true
        },
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'The application user who owns this blog post (users collection).',
      },
    },

    {
      name: 'recordId',
      label: 'Voice Record',
      type: 'relationship',
      relationTo: 'voice-records',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'The voice recording this blog was generated from.',
      },
    },

    {
      name: 'transcriptId',
      label: 'Transcript',
      type: 'relationship',
      relationTo: 'transcripts',
      required: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The transcript this blog post was generated from.',
      },
    },

    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the generated blog post.',
      },
    },

    {
      name: 'language',
      label: 'Language (en, ru, etc...)',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The language of the generated blog post.',
      },
    },

    {
      name: 'content',
      label: 'Content (Markdown)',
      type: 'textarea',
      required: false,
      admin: {
        description: 'The AI-generated blog content in Markdown format.',
      },
    },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Generated', value: 'generated' },
        { label: 'Edited', value: 'edited' },
      ],
      admin: {
        description: 'The current state of the blog post in the content pipeline.',
      },
    },

    {
      name: 'tone',
      label: 'Tone',
      type: 'select',
      required: false,
      options: [
        { label: 'Professional', value: 'professional' },
        { label: 'Casual', value: 'casual' },
        { label: 'Friendly', value: 'friendly' },
        { label: 'Formal', value: 'formal' },
        { label: 'Humorous', value: 'humorous' },
        { label: 'Inspirational', value: 'inspirational' },
      ],
      admin: {
        description: 'The writing tone used when generating this blog post with GPT.',
      },
    },

    {
      name: 'ttsVoiceUrl',
      label: 'TTS Voice URL',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'The public URL of the AI-generated TTS audio file stored in Cloudflare R2.',
      },
    },
  ],

  timestamps: true,
}

export default Blogs
