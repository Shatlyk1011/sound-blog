import type { Access } from 'payload'
import { checkRole } from '../../utils/checkRole'
import { isWorkerRequest } from '../../utils/worker'

export const adminsOrWorker: Access = ({ req }) => {
  if (checkRole(['admin'], req.user) || isWorkerRequest(req)) {
    return true
  }

  return false
}

export const adminsAndUserById: Access = ({ req }) => {
  if (checkRole(['admin'], req.user)) {
    return true
  }

  return {
    'userId.userId': {
      equals: req.query.userId,
    },
  }
}

export const adminsAndUserCreate: Access = ({ req, data }) => {
  const { user } = req

  if (isWorkerRequest(req)) {
    return true
  }

  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    if (data?.userId) {
      return data.userId === user.id
    }
  }

  return false
}
