import { CollectionConfig } from 'payload'
import { admins } from '../../utils/admins'





const CreditHistory: CollectionConfig = {
  slug: 'credit-history',
  access: {
    // Only admins can create via admin panel
    create: admins,
    update: () => false,
    delete: () => false,
    read: ({ req }) => {
      if (admins({ req })) {
        return true
      }
      // Allow users to read only their own credit history
      if (req.user && req.context?.userId) {
        return {
          userId: {
            equals: req.context.userId,
          },
        }
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['userId', 'createdAt', 'creditAmount', 'type'],
    useAsTitle: 'userId',
  },

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data.userId) {
          try {
            const client = await req.payload.find({
              collection: 'users',
              where: {
                userId: {
                  equals: data.userId,
                },
              },
            })

            if (client.docs.length > 0) {
              data.client = client.docs[0].id
            }
          } catch (error) {
            console.error('Error linking credit history to client:', error)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'userId',
      label: 'User ID',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Supabase user ID',
      },
    },
    {
      name: 'creditAmount',
      label: 'Credit Amount',
      type: 'number',
      required: true,
      defaultValue: 3,
      min: 0,
      admin: {
        description: 'Number of credits (in seconds)',
      },
    },
    {
      name: 'source',
      label: 'Credit Source',
      type: 'select',
      required: true,
      defaultValue: 'monthly_free',
      options: [
        { label: 'Monthly Free', value: 'monthly_free' },
        { label: 'Purchased Credits', value: 'purchased' },
        { label: 'Signup Bonus', value: 'signup_bonus' },
        { label: 'Gift', value: 'gift' },
      ],
      admin: {
        description: 'Type of credit allocation',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Used', value: 'used' },
      ],
      admin: {
        description: 'Status of the credit',
      },
    },
    {
      name: 'expirationDate',
      label: 'Expiration Date',
      type: 'date',
      required: true,
      admin: {
        description: 'Date when these credits expire',
      },
    },
  ],
  timestamps: true,
}

export default CreditHistory
