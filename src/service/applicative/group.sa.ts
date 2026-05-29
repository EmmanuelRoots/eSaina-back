import { Prisma } from '@prisma/client'
import {
  GroupAddMembersDTO,
  GroupCreateDTO,
  GroupDetailDTO,
  GroupListResponseDTO,
  GroupMemberRoleDTO,
  GroupSummaryDTO,
  GroupUpdateDTO,
} from '../../data/dto/group.dto'
import {
  toGroupDetailDTO,
  toGroupSummaryDTO,
} from '../../data/dto/mappers/group.mappers'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'

const assertGroupExists = async (groupId: string) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } })
  if (!group) {
    throw new ApiError(404, 'Groupe introuvable', 'group_not_found')
  }
  return group
}

export const listGroups = async (params: {
  page?: number
  pageSize?: number
  search?: string
}): Promise<GroupListResponseDTO> => {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
  const skip = (page - 1) * pageSize
  const search = params.search?.trim()

  const where: Prisma.GroupWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  try {
    const [groups, totalCount] = await Promise.all([
      prisma.group.findMany({
        where,
        include: { _count: { select: { members: true } } },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.group.count({ where }),
    ])

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    return {
      success: true,
      data: groups.map(toGroupSummaryDTO),
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
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_list_error')
  }
}

export const getGroup = async (groupId: string): Promise<GroupDetailDTO> => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      _count: { select: { members: true } },
      members: {
        include: { user: true },
        orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
      },
    },
  })
  if (!group) {
    throw new ApiError(404, 'Groupe introuvable', 'group_not_found')
  }
  return toGroupDetailDTO(group)
}

export const createGroup = async (
  payload: GroupCreateDTO,
  actor: { id?: string }
): Promise<{ success: true; data: GroupDetailDTO }> => {
  const name = payload.name?.trim()
  if (!name) {
    throw new ApiError(400, 'Le nom du groupe est requis', 'group_name_required')
  }
  if (!actor.id) {
    throw new ApiError(401, 'Acteur non identifié', 'unauthorized')
  }

  const additionalMembers = (payload.memberIds ?? [])
    .filter((id) => id && id !== actor.id)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  try {
    const created = await prisma.group.create({
      data: {
        name,
        description: payload.description?.trim() || null,
        createdById: actor.id,
        members: {
          create: [
            { userId: actor.id, role: 'OWNER' },
            ...additionalMembers.map((userId) => ({
              userId,
              role: 'MEMBER' as const,
            })),
          ],
        },
      },
      include: {
        _count: { select: { members: true } },
        members: { include: { user: true } },
      },
    })
    return { success: true, data: toGroupDetailDTO(created) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_create_error')
  }
}

export const updateGroup = async (
  groupId: string,
  payload: GroupUpdateDTO
): Promise<{ success: true; data: GroupSummaryDTO }> => {
  await assertGroupExists(groupId)

  const data: Prisma.GroupUpdateInput = {}
  if (payload.name !== undefined) {
    const trimmed = payload.name.trim()
    if (!trimmed) {
      throw new ApiError(400, 'Le nom ne peut pas être vide', 'group_name_required')
    }
    data.name = trimmed
  }
  if (payload.description !== undefined) {
    data.description = payload.description?.trim() || null
  }

  try {
    const updated = await prisma.group.update({
      where: { id: groupId },
      data,
      include: { _count: { select: { members: true } } },
    })
    return { success: true, data: toGroupSummaryDTO(updated) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_update_error')
  }
}

export const deleteGroup = async (
  groupId: string
): Promise<{ success: true; message: string }> => {
  await assertGroupExists(groupId)
  try {
    await prisma.group.delete({ where: { id: groupId } })
    return { success: true, message: 'Groupe supprimé' }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_delete_error')
  }
}

export const addMembers = async (
  groupId: string,
  payload: GroupAddMembersDTO
): Promise<{ success: true; data: GroupDetailDTO }> => {
  await assertGroupExists(groupId)
  const userIds = (payload.userIds ?? [])
    .filter(Boolean)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  if (userIds.length === 0) {
    throw new ApiError(400, 'Aucun utilisateur fourni', 'no_users_provided')
  }

  // Vérifie l'existence des utilisateurs cibles.
  const existing = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true },
  })
  if (existing.length !== userIds.length) {
    throw new ApiError(
      400,
      'Un ou plusieurs utilisateurs sont introuvables',
      'users_not_found'
    )
  }

  try {
    await prisma.groupMember.createMany({
      data: userIds.map((userId) => ({ groupId, userId, role: 'MEMBER' as const })),
      skipDuplicates: true,
    })
    return { success: true, data: await getGroup(groupId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_add_members_error')
  }
}

export const removeMember = async (
  groupId: string,
  userId: string
): Promise<{ success: true; data: GroupDetailDTO }> => {
  await assertGroupExists(groupId)

  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  })
  if (!member) {
    throw new ApiError(404, 'Membre introuvable dans le groupe', 'member_not_found')
  }

  if (member.role === 'OWNER') {
    const ownerCount = await prisma.groupMember.count({
      where: { groupId, role: 'OWNER' },
    })
    if (ownerCount <= 1) {
      throw new ApiError(
        400,
        "Impossible de retirer le dernier OWNER du groupe",
        'last_owner_protected'
      )
    }
  }

  try {
    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    })
    return { success: true, data: await getGroup(groupId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_remove_member_error')
  }
}

export const updateMemberRole = async (
  groupId: string,
  userId: string,
  newRole: GroupMemberRoleDTO
): Promise<{ success: true; data: GroupDetailDTO }> => {
  await assertGroupExists(groupId)

  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  })
  if (!member) {
    throw new ApiError(404, 'Membre introuvable dans le groupe', 'member_not_found')
  }

  // Empêche la rétrogradation du dernier OWNER.
  if (member.role === 'OWNER' && newRole === 'MEMBER') {
    const ownerCount = await prisma.groupMember.count({
      where: { groupId, role: 'OWNER' },
    })
    if (ownerCount <= 1) {
      throw new ApiError(
        400,
        "Le groupe doit conserver au moins un OWNER",
        'last_owner_protected'
      )
    }
  }

  try {
    await prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { role: newRole },
    })
    return { success: true, data: await getGroup(groupId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'group_update_member_role_error')
  }
}

export default {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addMembers,
  removeMember,
  updateMemberRole,
}
