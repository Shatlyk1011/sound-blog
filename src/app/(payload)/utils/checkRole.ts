type Role = 'admin' | 'moderator'

type UserWithRoles = {
  isBlocked?: boolean | null
  roles?: unknown[] | null
}

export const checkRole = (allRoles: Role[] = [], user?: UserWithRoles | null): boolean => {
  if (user) {
    if (user?.isBlocked) {
      return false
    }

    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}
