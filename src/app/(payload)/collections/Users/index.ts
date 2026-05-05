import type { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'

const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    defaultColumns: ['email', 'userId', 'plan', 'authProvider', 'isBlocked'],
    useAsTitle: 'email',
    description:
      'Stores application users authenticated via Supabase. Each record links a Supabase user (by ID) to their plan, and auth provider.',
  },

  access: {
    // Restrict all operations to admins only from the admin panel
    read: admins,
    create: admins,
    update: admins,
    delete: admins,
  },

  fields: [
    {
      name: 'userId',
      label: 'Supabase ID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'The unique user ID issued by Supabase.',
      },
    },

    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
    },

    {
      name: 'creditsSpent',
      label: 'Credits Spent',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Amount of credits spent from this user',
      },
    },

    {
      name: 'plan',
      label: 'Plan',
      type: 'select',
      required: false,
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },

    {
      name: 'authProvider',
      label: 'Auth Provider',
      type: 'select',
      required: false,
      defaultValue: 'n/a',
      options: [
        { label: 'N/A', value: 'n/a' },
        { label: 'Email (Magic Link)', value: 'email' },
        { label: 'Google', value: 'google' },
        { label: 'GitHub', value: 'github' },
      ],
    },

    {
      name: 'creditHistory',
      label: 'Credit History',
      type: 'join',
      collection: 'credit-history',
      on: 'client',
      admin: {
        description: 'All credit transactions for this user',
      },
    },

    {
      name: 'isBlocked',
      label: 'Is Blocked?',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      admin: {
        description: 'When enabled, this user is blocked from accessing the application.',
      },
    },
  ],

  timestamps: true,
}

export default Users
