import type { Access } from 'payload'
import { checkRole } from '../../utils/checkRole'

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

export const adminsAndUserCreate: Access = ({ req: { user }, data }) => {
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
