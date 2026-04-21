import type { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'

const Transcripts: CollectionConfig = {
  slug: 'transcripts',

  admin: {
    defaultColumns: ['audioId', 'userId', 'language', 'createdAt'],
    useAsTitle: 'audioId',
    description:
      'Stores transcripts generated from user-uploaded voice recordings. Each transcript links to its source audio and the uploading user.',
  },

  access: {
    read: () => true,
    create: () => true,
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
      name: 'audioId',
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
        description:
          'The unprocessed transcription text as returned by the speech-to-text service.',
      },
    },

    {
      name: 'cleanedText',
      label: 'Cleaned Text',
      type: 'textarea',
      required: false,
      admin: {
        description:
          'The refined, human-readable version of the transcript after post-processing.',
      },
    },

    {
      name: 'language',
      label: 'Language',
      type: 'text',
      required: false,
      admin: {
        description:
          'The detected or specified language of the transcript (e.g. "en", "tr").',
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
