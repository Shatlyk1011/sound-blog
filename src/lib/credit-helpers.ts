import { User } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

// Create a new client record (called when user signs up via Supabase)
export async function createClientRecord(
  userId: string,
  email?: string,
  provider?: User['authProvider']
): Promise<void> {
  const payload = await getPayload({ config })

  await payload.create({
    collection: 'users',
    data: {
      userId,
      email: email,
      authProvider: provider,
    },
  })

  console.log(`✓ Created client record for user: ${userId}`)
}

//  * Create initial credits for a new user (called when user signs up via Supabase)
export async function createInitialCredits(userId: string): Promise<void> {
  const payload = await getPayload({ config })

  const expirationDate = new Date()
  expirationDate.setMonth(expirationDate.getMonth() + 1)

  await payload.create({
    collection: 'credit-history',
    data: {
      userId,
      creditAmount: 1000,
      source: 'signup_bonus',
      expirationDate: expirationDate.toISOString(),
      status: 'active',
    },
  })

  console.log(`✓ Created initial 1000 credits for new user: ${userId}`)
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
