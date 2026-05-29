import { User, Role } from '@prisma/client'
import { toISO } from '../../../utils/date.utils'
import { UserDTO } from '../user.dto'
import { AuthorizationDto } from '../role.dto'

export const toUserDTO = (user: User & { role?: Role }): UserDTO => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  birthDate: toISO(user.birthDate),
  createdAt: toISO(user.createdAt)!,
  pdpUrl: user.pdpUrl ?? '',
  roleId: user.roleId,
  role: user.role
    ? {
        id: user.role.id,
        name: user.role.name,
        authorizations: (user.role.authorizations as unknown) as AuthorizationDto[],
        members: [], // avoid circularity here
      }
    : undefined,
})
