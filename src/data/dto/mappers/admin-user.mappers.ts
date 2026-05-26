import { Role, User } from '@prisma/client'
import { toISO } from '../../../utils/date.utils'
import { AdminUserListItemDTO } from '../admin-user.dto'
import { AuthorizationDto } from '../role.dto'

export const toAdminUserListItemDTO = (
  user: User & { role?: Role | null }
): AdminUserListItemDTO => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  birthDate: toISO(user.birthDate),
  pdpUrl: user.pdpUrl ?? '',
  active: user.active,
  createdAt: toISO(user.createdAt)!,
  roleId: user.roleId,
  role: user.role
    ? {
        id: user.role.id,
        name: user.role.name,
        authorizations: (user.role.authorizations as unknown) as AuthorizationDto[],
        members: [],
      }
    : undefined,
})
