import { Prisma } from '@prisma/client'
import {
  TeamAddMembersDTO,
  TeamAddProjectsDTO,
  TeamCreateDTO,
  TeamDetailDTO,
  TeamListResponseDTO,
  TeamMemberRoleDTO,
  TeamSummaryDTO,
  TeamUpdateDTO,
} from '../../data/dto/team.dto'
import {
  toTeamDetailDTO,
  toTeamSummaryDTO,
} from '../../data/dto/mappers/team.mappers'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'

const teamDetailInclude = {
  _count: { select: { members: true, projects: true } },
  members: {
    include: { user: true },
    orderBy: [{ role: 'asc' as const }, { joinedAt: 'asc' as const }],
  },
  projects: {
    include: { project: true },
    orderBy: [{ addedAt: 'asc' as const }],
  },
}

const assertTeamExists = async (teamId: string) => {
  const team = await prisma.team.findUnique({ where: { id: teamId } })
  if (!team) {
    throw new ApiError(404, 'Équipe introuvable', 'team_not_found')
  }
  return team
}

/**
 * Vérifie qu'un acteur peut gérer les membres / projets de l'équipe.
 * Autorisé si : SUPER_ADMIN, ADMIN, ou LEAD de la team.
 */
export const assertCanManageTeam = async (
  teamId: string,
  actor: { id?: string; role?: { name?: string } }
) => {
  const roleName = actor.role?.name
  if (roleName === 'SUPER_ADMIN' || roleName === 'ADMIN') return
  if (!actor.id) {
    throw new ApiError(401, 'Acteur non identifié', 'unauthorized')
  }
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: actor.id } },
  })
  if (!membership || membership.role !== 'LEAD') {
    throw new ApiError(403, 'Accès refusé', 'forbidden')
  }
}

export const listTeams = async (params: {
  page?: number
  pageSize?: number
  search?: string
}): Promise<TeamListResponseDTO> => {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
  const skip = (page - 1) * pageSize
  const search = params.search?.trim()

  const where: Prisma.TeamWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  try {
    const [teams, totalCount] = await Promise.all([
      prisma.team.findMany({
        where,
        include: { _count: { select: { members: true, projects: true } } },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      prisma.team.count({ where }),
    ])

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    return {
      success: true,
      data: teams.map(toTeamSummaryDTO),
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
    throw new ApiError(500, e.message, 'team_list_error')
  }
}

export const getTeam = async (teamId: string): Promise<TeamDetailDTO> => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: teamDetailInclude,
  })
  if (!team) {
    throw new ApiError(404, 'Équipe introuvable', 'team_not_found')
  }
  return toTeamDetailDTO(team)
}

export const createTeam = async (
  payload: TeamCreateDTO,
  actor: { id?: string }
): Promise<{ success: true; data: TeamDetailDTO }> => {
  const name = payload.name?.trim()
  if (!name) {
    throw new ApiError(400, "Le nom de l'équipe est requis", 'team_name_required')
  }
  if (!actor.id) {
    throw new ApiError(401, 'Acteur non identifié', 'unauthorized')
  }

  const additionalMembers = (payload.memberIds ?? [])
    .filter((id) => id && id !== actor.id)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  const projectIds = (payload.projectIds ?? [])
    .filter(Boolean)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  if (projectIds.length > 0) {
    const existingProjects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true },
    })
    if (existingProjects.length !== projectIds.length) {
      throw new ApiError(400, 'Un ou plusieurs projets sont introuvables', 'projects_not_found')
    }
  }

  try {
    const created = await prisma.team.create({
      data: {
        name,
        description: payload.description?.trim() || null,
        createdById: actor.id,
        members: {
          create: [
            { userId: actor.id, role: 'LEAD' },
            ...additionalMembers.map((userId) => ({
              userId,
              role: 'MEMBER' as const,
            })),
          ],
        },
        projects: {
          create: projectIds.map((projectId) => ({ projectId })),
        },
      },
      include: teamDetailInclude,
    })
    return { success: true, data: toTeamDetailDTO(created) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_create_error')
  }
}

export const updateTeam = async (
  teamId: string,
  payload: TeamUpdateDTO
): Promise<{ success: true; data: TeamSummaryDTO }> => {
  await assertTeamExists(teamId)

  const data: Prisma.TeamUpdateInput = {}
  if (payload.name !== undefined) {
    const trimmed = payload.name.trim()
    if (!trimmed) {
      throw new ApiError(400, 'Le nom ne peut pas être vide', 'team_name_required')
    }
    data.name = trimmed
  }
  if (payload.description !== undefined) {
    data.description = payload.description?.trim() || null
  }

  try {
    const updated = await prisma.team.update({
      where: { id: teamId },
      data,
      include: { _count: { select: { members: true, projects: true } } },
    })
    return { success: true, data: toTeamSummaryDTO(updated) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_update_error')
  }
}

export const deleteTeam = async (
  teamId: string
): Promise<{ success: true; message: string }> => {
  await assertTeamExists(teamId)
  try {
    await prisma.team.delete({ where: { id: teamId } })
    return { success: true, message: 'Équipe supprimée' }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_delete_error')
  }
}

export const addMembers = async (
  teamId: string,
  payload: TeamAddMembersDTO
): Promise<{ success: true; data: TeamDetailDTO }> => {
  await assertTeamExists(teamId)
  const userIds = (payload.userIds ?? [])
    .filter(Boolean)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  if (userIds.length === 0) {
    throw new ApiError(400, 'Aucun utilisateur fourni', 'no_users_provided')
  }

  const existing = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true },
  })
  if (existing.length !== userIds.length) {
    throw new ApiError(400, 'Un ou plusieurs utilisateurs sont introuvables', 'users_not_found')
  }

  try {
    await prisma.teamMember.createMany({
      data: userIds.map((userId) => ({ teamId, userId, role: 'MEMBER' as const })),
      skipDuplicates: true,
    })
    return { success: true, data: await getTeam(teamId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_add_members_error')
  }
}

export const removeMember = async (
  teamId: string,
  userId: string
): Promise<{ success: true; data: TeamDetailDTO }> => {
  await assertTeamExists(teamId)

  const member = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  })
  if (!member) {
    throw new ApiError(404, "Membre introuvable dans l'équipe", 'member_not_found')
  }

  if (member.role === 'LEAD') {
    const leadCount = await prisma.teamMember.count({
      where: { teamId, role: 'LEAD' },
    })
    if (leadCount <= 1) {
      throw new ApiError(
        400,
        "Impossible de retirer le dernier LEAD de l'équipe",
        'last_lead_protected'
      )
    }
  }

  try {
    await prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    })
    return { success: true, data: await getTeam(teamId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_remove_member_error')
  }
}

export const updateMemberRole = async (
  teamId: string,
  userId: string,
  newRole: TeamMemberRoleDTO
): Promise<{ success: true; data: TeamDetailDTO }> => {
  await assertTeamExists(teamId)

  const member = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  })
  if (!member) {
    throw new ApiError(404, "Membre introuvable dans l'équipe", 'member_not_found')
  }

  if (member.role === 'LEAD' && newRole === 'MEMBER') {
    const leadCount = await prisma.teamMember.count({
      where: { teamId, role: 'LEAD' },
    })
    if (leadCount <= 1) {
      throw new ApiError(
        400,
        "L'équipe doit conserver au moins un LEAD",
        'last_lead_protected'
      )
    }
  }

  try {
    await prisma.teamMember.update({
      where: { teamId_userId: { teamId, userId } },
      data: { role: newRole },
    })
    return { success: true, data: await getTeam(teamId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_update_member_role_error')
  }
}

export const addProjects = async (
  teamId: string,
  payload: TeamAddProjectsDTO
): Promise<{ success: true; data: TeamDetailDTO }> => {
  await assertTeamExists(teamId)
  const projectIds = (payload.projectIds ?? [])
    .filter(Boolean)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)

  if (projectIds.length === 0) {
    throw new ApiError(400, 'Aucun projet fourni', 'no_projects_provided')
  }

  const existing = await prisma.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true },
  })
  if (existing.length !== projectIds.length) {
    throw new ApiError(400, 'Un ou plusieurs projets sont introuvables', 'projects_not_found')
  }

  try {
    await prisma.teamProject.createMany({
      data: projectIds.map((projectId) => ({ teamId, projectId })),
      skipDuplicates: true,
    })
    return { success: true, data: await getTeam(teamId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_add_projects_error')
  }
}

export const removeProject = async (
  teamId: string,
  projectId: string
): Promise<{ success: true; data: TeamDetailDTO }> => {
  await assertTeamExists(teamId)

  const link = await prisma.teamProject.findUnique({
    where: { teamId_projectId: { teamId, projectId } },
  })
  if (!link) {
    throw new ApiError(404, "Projet non rattaché à cette équipe", 'team_project_not_found')
  }

  try {
    await prisma.teamProject.delete({
      where: { teamId_projectId: { teamId, projectId } },
    })
    return { success: true, data: await getTeam(teamId) }
  } catch (error) {
    const e = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, e.message, 'team_remove_project_error')
  }
}

/**
 * Recherche de projets disponibles pour rattachement à une équipe.
 * Réservé aux admins (vérifié au niveau contrôleur).
 */
export const searchProjects = async (params: {
  search?: string
  limit?: number
}): Promise<Array<{ id: string; key: string; name: string }>> => {
  const search = params.search?.trim()
  const limit = Math.min(50, Math.max(1, params.limit ?? 20))

  const where: Prisma.ProjectWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { key: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  const projects = await prisma.project.findMany({
    where,
    select: { id: true, key: true, name: true },
    orderBy: [{ name: 'asc' }],
    take: limit,
  })
  return projects
}

export default {
  listTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addMembers,
  removeMember,
  updateMemberRole,
  addProjects,
  removeProject,
  searchProjects,
  assertCanManageTeam,
}
