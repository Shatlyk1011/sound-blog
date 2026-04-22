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
      label: 'User',
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
        description:
          'The public URL of the audio file stored in Supabase Storage.',
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
