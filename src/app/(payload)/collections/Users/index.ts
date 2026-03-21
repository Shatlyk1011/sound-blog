import type { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'

const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    defaultColumns: [
      'email',
      'userId',
      'plan',
      'credits',
      'authProvider',
      'isBlocked',
    ],
    useAsTitle: 'email',
    description:
      'Stores application users authenticated via Supabase. Each record links a Supabase user (by ID) to their plan, credits, and auth provider.',
  },

  // No auth block — these are not Payload auth users; they are app users stored for reference
  auth: false,

  access: {
    // Restrict all operations to admins only from the admin panel
    read: () => true,
    create: () => true,
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
      name: 'plan',
      label: 'Plan',
      type: 'select',
      required: true,
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },

    {
      name: 'credits',
      label: 'Credits',
      type: 'number',
      required: true,
      defaultValue: 10,
      min: 0,
      admin: {
        description: 'Number of credits available for the user.',
      },
    },

    {
      name: 'authProvider',
      label: 'Auth Provider',
      type: 'select',
      required: true,
      defaultValue: 'n/a',
      options: [
        { label: 'N/A', value: 'n/a' },
        { label: 'Email (Magic Link)', value: 'email' },
        { label: 'Google', value: 'google' },
        { label: 'GitHub', value: 'github' },
      ],
    },

    {
      name: 'isBlocked',
      label: 'Is Blocked?',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      admin: {
        description:
          'When enabled, this user is blocked from accessing the application.',
      },
    },
  ],

  timestamps: true,
}

export default Users
