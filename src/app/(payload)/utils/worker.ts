import type { PayloadRequest } from 'payload'

const getWorkerSecret = () => process.env.WORKER_CALLBACK_SECRET

export const isWorkerRequest = (req: PayloadRequest): boolean => {
  const workerSecret = getWorkerSecret()
  if (!workerSecret) return false

  const explicitSecret = req.headers.get('x-worker-secret')
  if (explicitSecret === workerSecret) return true

  const authorization = req.headers.get('authorization')
  return authorization === `Bearer ${workerSecret}` || authorization === `adminUsers API-Key ${workerSecret}`
}
