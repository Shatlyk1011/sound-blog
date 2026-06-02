import { User } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

type CreateUserRequest = {
  id: string
  userId: string
  email?: string
  authProvider: User['authProvider']
}
// Create a new client record (called when user signs up via Supabase)
export async function createClientRecord({ id, userId, email, authProvider }: CreateUserRequest): Promise<User> {
  const payload = await getPayload({ config })

  const userRecord = await payload.create({
    collection: 'users',
    data: {
      id,
      userId,
      email,
      authProvider,
    },
    overrideAccess: true,
  })

  console.log(`✓ Created client record for user: ${id}`)
  return userRecord
}

//  * Create initial credits for a new user (called when user signs up via Supabase)
export async function createInitialCredits(payloadId: string, userId: string): Promise<void> {
  const payload = await getPayload({ config })

  const expirationDate = new Date()
  expirationDate.setMonth(expirationDate.getMonth() + 1)

  await payload.create({
    collection: 'credit-history',
    data: {
      client: payloadId,
      userId,
      creditAmount: 500,
      source: 'signup_bonus',
      expirationDate: expirationDate.toISOString(),
      status: 'active',
      invoiceUrl: '',
    },
    overrideAccess: true,
  })

  console.log(`✓ Created initial 500 credits for new user: ${userId}`)
}

// Get client record by userId
export async function getClientByUserId(userId: string) {
  const payload = await getPayload({ config })
  const clients = await payload.find({
    collection: 'users',
    where: {
      userId: {
        equals: userId,
      },
    },
    depth: 1,
    overrideAccess: true,
  })
  return clients.docs[0] || null
}

// Get credit history for a specific user
export async function getUserCreditHistory(userId: string) {
  const payload = await getPayload({ config })

  const credits = await payload.find({
    collection: 'credit-history',
    where: {
      userId: { equals: userId },
    },
    sort: '-createdDate',
    limit: 100,
  })

  return credits.docs
}
