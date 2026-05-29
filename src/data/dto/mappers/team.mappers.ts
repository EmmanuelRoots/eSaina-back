import { Project, Team, TeamMember, TeamProject, User } from '@prisma/client'
import { toISO } from '../../../utils/date.utils'
import {
  TeamDetailDTO,
  TeamMemberDTO,
  TeamProjectDTO,
  TeamSummaryDTO,
} from '../team.dto'

type TeamWithCount = Team & {
  _count?: { members: number; projects: number }
}
type TeamMemberWithUser = TeamMember & { user: User }
type TeamProjectWithProject = TeamProject & { project: Project }
type TeamWithRelations = Team & {
  members: TeamMemberWithUser[]
  projects: TeamProjectWithProject[]
} & TeamWithCount

export const toTeamMemberDTO = (m: TeamMemberWithUser): TeamMemberDTO => ({
  id: m.id,
  userId: m.userId,
  role: m.role,
  joinedAt: toISO(m.joinedAt)!,
  user: {
    id: m.user.id,
    email: m.user.email,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    pdpUrl: m.user.pdpUrl ?? '',
  },
})

export const toTeamProjectDTO = (p: TeamProjectWithProject): TeamProjectDTO => ({
  id: p.id,
  projectId: p.projectId,
  addedAt: toISO(p.addedAt)!,
  project: {
    id: p.project.id,
    key: p.project.key,
    name: p.project.name,
  },
})

export const toTeamSummaryDTO = (t: TeamWithCount): TeamSummaryDTO => ({
  id: t.id,
  name: t.name,
  description: t.description,
  createdAt: toISO(t.createdAt)!,
  updatedAt: toISO(t.updatedAt)!,
  createdById: t.createdById,
  memberCount: t._count?.members ?? 0,
  projectCount: t._count?.projects ?? 0,
})

export const toTeamDetailDTO = (t: TeamWithRelations): TeamDetailDTO => ({
  ...toTeamSummaryDTO(t),
  memberCount: t._count?.members ?? t.members.length,
  projectCount: t._count?.projects ?? t.projects.length,
  members: t.members.map(toTeamMemberDTO),
  projects: t.projects.map(toTeamProjectDTO),
})
