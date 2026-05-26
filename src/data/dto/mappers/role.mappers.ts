import { Role, User } from '@prisma/client'
import { RoleDTO, AuthorizationDto } from '../role.dto'
import { toUserDTO } from './user.mappers'

export const toRoleDTO = (role: Role & { members?: User[] }): RoleDTO => ({
  id: role.id,
  name: role.name,
  authorizations: (role.authorizations as unknown) as AuthorizationDto[],
  members: role.members ? role.members.map(toUserDTO) : [],
})
