import type { CollectionConfig } from 'payload'
import { FEEDBACK_TYPE_OPTIONS } from '@/lib/feedback'
import { admins } from '../../utils/admins'

const Feedback: CollectionConfig = {
  slug: 'feedback',

  admin: {
    defaultColumns: ['type', 'email', 'status', 'createdAt'],
    useAsTitle: 'email',
    description: 'Stores feedback submitted from public and authenticated product surfaces.',
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
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'The authenticated user who submitted the feedback, when available.',
      },
    },
    {
      name: 'email',
      label: 'Reply Email',
      type: 'email',
      required: false,
    },
    {
      name: 'type',
      label: 'Feedback Type',
      type: 'select',
      required: true,
      options: FEEDBACK_TYPE_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    },
    {
      name: 'message',
      label: 'Feedback',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      defaultValue: 'dashboard-sidebar',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],

  timestamps: true,
}

export default Feedback
