import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'

const VoiceRecords: CollectionConfig = {
  slug: 'voice-records',

  admin: {
    defaultColumns: ['fileName', 'userId', 'status', 'duration', 'createdAt'],
    useAsTitle: 'fileName',
    description:
      'Stores user-uploaded voice recordings. Each record links to the uploading user and references the audio file hosted in Supabase Storage.',
  },

  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        try {
          const record = await req.payload.findByID({
            collection: 'voice-records',
            id,
          })

          if (record && record.fileUrl) {
            const fileUrl = record.fileUrl as string
            const key = fileUrl.split('/').pop()

            if (key) {
              const accessKeyId = process.env.R2_ACCESS_KEY_ID
              const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

              if (accessKeyId && secretAccessKey) {
                const s3 = new S3Client({
                  region: 'auto',
                  endpoint: process.env.R2_ENDPOINT_URL,
                  credentials: {
                    accessKeyId,
                    secretAccessKey,
                  },
                })

                await s3.send(
                  new DeleteObjectCommand({
                    Bucket: process.env.R2_VOICE_RECORD_BUCKET,
                    Key: key,
                  })
                )
              } else {
                console.error('Missing R2 credentials for deletion')
              }
            }
          }
        } catch (err) {
          console.error('Error deleting file from R2:', err)
        }
      },
    ],
  },

  access: {
    read: () => true,
    create: () => true,
    update: admins,
    delete: admins,
  },

  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      admin: {
        description: 'Custom generated ID for the record',
      },
    },
    {
      name: 'userId',
      label: 'User (payload users collection)',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The application user who uploaded this voice recording.',
      },
    },

    {
      name: 'fileUrl',
      label: 'File URL',
      type: 'text',
      required: true,
      admin: {
        description: 'The public URL of the audio file stored in Supabase Storage.',
      },
    },
    {
      name: 'title',
      label: 'Generated title',
      type: 'text',
      required: false,
      admin: {
        description: 'The title of the generated blog.',
      },
    },

    {
      name: 'fileName',
      label: 'File Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The original name of the uploaded audio file.',
      },
    },

    {
      name: 'duration',
      label: 'Duration (seconds)',
      type: 'number',
      required: false,
      min: 0,
      admin: {
        description: 'The duration of the audio recording in seconds.',
      },
    },

    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'uploaded',
      options: [
        { label: 'Uploaded', value: 'uploaded' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'The current processing state of this voice recording.',
      },
    },
  ],

  timestamps: true,
}

export default VoiceRecords
