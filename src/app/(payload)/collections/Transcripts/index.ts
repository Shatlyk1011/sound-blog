import type { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'

const Transcripts: CollectionConfig = {
  slug: 'transcripts',

  admin: {
    defaultColumns: ['recordId', 'userId', 'language', 'createdAt'],
    useAsTitle: 'recordId',
    description:
      'Stores transcripts generated from user-uploaded voice recordings. Each transcript links to its source audio and the uploading user.',
  },

  access: {
    read: admins,
    create: admins,
    update: admins,
    delete: admins,
  },

  fields: [
    {
      name: 'userId',
      label: 'User',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The application user who owns this transcript.',
      },
    },

    {
      name: 'recordId',
      label: 'Voice Record',
      type: 'relationship',
      relationTo: 'voice-records',
      required: true,
      admin: {
        description: 'The voice recording this transcript was generated from.',
      },
    },

    {
      name: 'rawText',
      label: 'Raw Text',
      type: 'textarea',
      required: false,
      admin: {
        description: 'The unprocessed transcription text as returned by the speech-to-text service.',
      },
    },

    {
      name: 'language',
      label: 'Language',
      type: 'text',
      required: false,
      admin: {
        description: 'The detected or specified language of the transcript (e.g. "en", "tr").',
      },
    },
    {
      name: 'wordCount',
      label: 'Word Count',
      type: 'number',
      required: false,
    },
    {
      name: 'vtt',
      label: 'VTT Subtitles',
      type: 'textarea',
      required: false,
    },
  ],

  timestamps: true,
}

export default Transcripts
