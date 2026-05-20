import type { AccessArgs } from 'payload'
import { checkRole } from './checkRole'

type isAdmin = (args: AccessArgs) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
