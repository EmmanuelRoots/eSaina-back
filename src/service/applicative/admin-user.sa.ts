import { Prisma } from '@prisma/client'
import {
  AdminUserListItemDTO,
  AdminUserListResponseDTO,
  AdminUserUpdateDTO,
} from '../../data/dto/admin-user.dto'
import { toAdminUserListItemDTO } from '../../data/dto/mappers/admin-user.mappers'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'
import { hashText } from '../technical/crypt.ts'

const PROTECTED_ROLE = 'SUPER_ADMIN'

/**
 * Vérifie qu'un acteur ADMIN ne touche pas à un compte SUPER_ADMIN.
 * Le SUPER_ADMIN peut tout faire.
 */
const assertCanActOn = async (
  actorRoleName: string | undefined,
  targetUserId: string
) => {
  if (actorRoleName === PROTECTED_ROLE) return

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { role: true },
  })
  if (!target) {
    throw new ApiError(404, 'Utilisateur introuvable', 'user_not_found')
  }
  if (target.role?.name === PROTECTED_ROLE) {
    throw new ApiError(
      403,
      "Seul un SUPER_ADMIN peut modifier un compte SUPER_ADMIN",
      'forbidden_target'
    )
  }
}

/**
 * Vérifie qu'un acteur ADMIN ne promeut pas vers SUPER_ADMIN.
 */
const assertCanAssignRole = async (
  actorRoleName: string | undefined,
  newRoleId: string
) => {
  if (actorRoleName === PROTECTED_ROLE) return
  const role = await prisma.role.findUnique({ where: { id: newRoleId } })
  if (!role) {
    throw new ApiError(404, 'Rôle introuvable', 'role_not_found')
  }
  if (role.name === PROTECTED_ROLE) {
    throw new ApiError(
      403,
      "Seul un SUPER_ADMIN peut attribuer le rôle SUPER_ADMIN",
      'forbidden_role'
    )
  }
}

export const listUsers = async (params: {
  page?: number
  pageSize?: number
  search?: string
  roleId?: string
  active?: boolean
}): Promise<AdminUserListResponseDTO> => {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
  const skip = (page - 1) * pageSize

  const search = params.search?.trim()
  const where: Prisma.UserWhereInput = {
    ...(params.roleId ? { roleId: params.roleId } : {}),
    ...(typeof params.active === 'boolean' ? { active: params.active } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { role: true },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ])

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    return {
      success: true,
      data: users.map(toAdminUserListItemDTO),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'admin_list_users_error')
  }
}

export const updateUser = async (
  targetId: string,
  payload: AdminUserUpdateDTO,
  actor: { id?: string; roleName?: string }
): Promise<{ success: true; data: AdminUserListItemDTO }> => {
  await assertCanActOn(actor.roleName, targetId)

  if (payload.roleId) {
    await assertCanAssignRole(actor.roleName, payload.roleId)
  }

  if (payload.active === false && actor.id === targetId) {
    throw new ApiError(
      400,
      'Vous ne pouvez pas désactiver votre propre compte',
      'self_deactivation_forbidden'
    )
  }

  try {
    const data: Prisma.UserUpdateInput = {}
    if (payload.firstName !== undefined) data.firstName = payload.firstName
    if (payload.lastName !== undefined) data.lastName = payload.lastName
    if (payload.phoneNumber !== undefined) data.phoneNumber = payload.phoneNumber
    if (payload.birthDate) {
      data.birthDate = new Date(payload.birthDate)
    }
    if (payload.active !== undefined) data.active = payload.active
    if (payload.roleId) data.role = { connect: { id: payload.roleId } }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data,
      include: { role: true },
    })
    return { success: true, data: toAdminUserListItemDTO(updated) }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'admin_update_user_error')
  }
}

export const resetPassword = async (
  targetId: string,
  newPassword: string,
  actor: { roleName?: string }
): Promise<{ success: true; message: string }> => {
  if (!newPassword || newPassword.length < 6) {
    throw new ApiError(
      400,
      'Le mot de passe doit contenir au moins 6 caractères',
      'invalid_password'
    )
  }
  await assertCanActOn(actor.roleName, targetId)

  const hashed = await hashText(newPassword)
  try {
    await prisma.user.update({
      where: { id: targetId },
      data: { password: hashed },
    })
    // Invalide toutes les sessions actives pour forcer une reconnexion.
    await prisma.session.deleteMany({ where: { userId: targetId } })
    return { success: true, message: 'Mot de passe réinitialisé' }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'admin_reset_password_error')
  }
}

export const deactivateUser = async (
  targetId: string,
  actor: { id?: string; roleName?: string }
): Promise<{ success: true; data: AdminUserListItemDTO }> => {
  if (actor.id === targetId) {
    throw new ApiError(
      400,
      'Vous ne pouvez pas désactiver votre propre compte',
      'self_deactivation_forbidden'
    )
  }
  await assertCanActOn(actor.roleName, targetId)

  try {
    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { active: false },
      include: { role: true },
    })
    await prisma.session.deleteMany({ where: { userId: targetId } })
    return { success: true, data: toAdminUserListItemDTO(updated) }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'admin_deactivate_user_error')
  }
}

export default {
  listUsers,
  updateUser,
  resetPassword,
  deactivateUser,
}
