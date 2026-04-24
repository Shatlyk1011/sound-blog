import type { CollectionConfig } from 'payload';
import { admins } from '../../utils/admins';













const Blogs: CollectionConfig = {
  slug: 'blogs',

  admin: {
    defaultColumns: ['title', 'userId', 'status', 'tone', 'createdAt'],
    useAsTitle: 'title',
    description:
      'Stores AI-generated blog posts created from user voice recordings. Each blog links to its source audio, transcript, and the authoring user.',
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
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
        description:
          'The application user who owns this blog post (supabase auth).',
      },
    },

    {
      name: 'recordId',
      label: 'Voice Record',
      type: 'relationship',
      relationTo: 'voice-records',
      required: true,
      admin: {
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
        description:
          'The current state of the blog post in the content pipeline.',
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
        description:
          'The writing tone used when generating this blog post with GPT.',
      },
    },
  ],

  timestamps: true,
}

export default Blogs
