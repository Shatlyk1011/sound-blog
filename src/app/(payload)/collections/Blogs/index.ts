import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { CollectionConfig } from 'payload';
import { adminsAndUserById, adminsAndUserCreate } from './hooks'

const Blogs: CollectionConfig = {
  slug: 'blogs',

  admin: {
    defaultColumns: ['title', 'userId', 'status', 'tone', 'createdAt'],
    useAsTitle: 'title',
    description:
      'Stores AI-generated blog posts created from user voice recordings. Each blog links to its source audio, transcript, and the authoring user.',
  },

  hooks: {
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
            const publicBase = process.env.R2_PUBLIC_URL
            const accessKeyId = process.env.R2_ACCESS_KEY_ID
            const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

            if (publicBase && accessKeyId && secretAccessKey) {
              // Derive the R2 object key by stripping the public base URL
              const key = existingUrl.startsWith(publicBase)
                ? existingUrl.slice(publicBase.length).replace(/^\//, '')
                : existingUrl.split('/').slice(-2).join('/')

              try {
                const s3 = new S3Client({
                  region: 'auto',
                  endpoint: process.env.R2_ENDPOINT_URL,
                  credentials: { accessKeyId, secretAccessKey },
                })

                await s3.send(
                  new DeleteObjectCommand({
                    Bucket: process.env.R2_VOICE_RECORD_BUCKET,
                    Key: key,
                  })
                )

                console.log(`[Blogs] Deleted stale TTS object from R2: ${key}`)
              } catch (s3Err) {
                console.error('[Blogs] Failed to delete TTS object from R2:', s3Err)
              }
            } else {
              console.warn('[Blogs] R2 credentials not configured; skipping TTS deletion')
            }
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
    read: adminsAndUserById,
    create: adminsAndUserCreate,
    update: adminsAndUserById,
    delete: adminsAndUserById,
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
      name: 'filters',
      label: 'Filters (array strings)',
      type: 'text',
      required: false,
      admin: {
        description: 'The filters used to generate the blog post.',
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
