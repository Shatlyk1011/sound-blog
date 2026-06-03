import { CreditHistory, User } from '@/payload-types'
import { NextResponse } from 'next/server'
import { getClientByUserId } from '@/lib/credit-helpers'
import { createClient } from '@/lib/supabase-server'

export interface UserDataResponse {
  currentPlan: User['plan']
  creditsSpent: User['creditsSpent']
  totalCredits: number
  history: {
    id: string
    source: CreditHistory['source']
    creditAmount: number
    createdAt: string
    expirationDate: string
    status: CreditHistory['status']
    invoiceUrl?: string
  }[]
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch client data and credit history
    // Fetch client data which now includes credit history via join field
    const client = await getClientByUserId(user.id)

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (client.isBlocked) {
      return NextResponse.json({ error: 'User is blocked' }, { status: 403 })
    }

    // When depth is sufficient, join field returns { docs: [...] } structure
    const joinedData = client.creditHistory as unknown as { docs: CreditHistory[] } | undefined
    const creditHistory = joinedData?.docs || []

    return NextResponse.json<UserDataResponse>({
      currentPlan: client.plan,
      creditsSpent: client.creditsSpent,
      totalCredits: creditHistory?.reduce((prev, curr) => prev + (curr.status === 'active' ? curr.creditAmount : 0), 0),
      history: creditHistory.map((h) => ({
        id: h.id,
        source: h.source,
        creditAmount: h.creditAmount,
        createdAt: h.createdAt,
        expirationDate: h.expirationDate,
        status: h.status,
        invoiceUrl: h.invoiceUrl || undefined,
      })),
    })
  } catch (error) {
    console.error('Error fetching credit history:', error)
    return NextResponse.json({ error: 'Failed to fetch credit history' }, { status: 500 })
  }
}
