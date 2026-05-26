import { Prisma } from '@prisma/client'
import { RoleDTO } from '../../data/dto/role.dto'
import { toRoleDTO } from '../../data/dto/mappers/role.mappers'
import { prisma } from '../../repository'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'

export const listTables = (): { success: true; data: string[] } => {
  const tables = Prisma.dmmf.datamodel.models
    .map((m) => m.name)
    .sort((a, b) => a.localeCompare(b))
  return { success: true, data: tables }
}

export const findAll = async () => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        members: true,
      },
    })
    return {
      success: true,
      data: roles.map(toRoleDTO),
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'find_roles_error')
  }
}

export const create = async (role: RoleDTO) => {
  try {
    const newRole = await prisma.role.create({
      data: {
        name: role.name,
        authorizations: role.authorizations as any,
      },
    })
    return {
      success: true,
      data: toRoleDTO(newRole),
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create_role_error')
  }
}

export const update = async (id: string, role: RoleDTO) => {
  try {
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: role.name,
        authorizations: role.authorizations as any,
      },
    })
    return {
      success: true,
      data: toRoleDTO(updatedRole),
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'update_role_error')
  }
}

export const deleteRole = async (id: string) => {
  try {
    // Check if any user is using this role
    const usersCount = await prisma.user.count({ where: { roleId: id } })
    if (usersCount > 0) {
      throw new ApiError(400, 'Cannot delete role assigned to users', 'delete_role_error')
    }

    await prisma.role.delete({ where: { id } })
    return {
      success: true,
      message: 'Role deleted successfully',
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'delete_role_error')
  }
}

export default {
  findAll,
  create,
  update,
  deleteRole,
  listTables,
}
