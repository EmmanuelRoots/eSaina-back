/**
 * DTO pour la gestion des équipes via la console d'administration.
 * Une Team est une entité organisationnelle (LEAD + MEMBER) qui peut être
 * rattachée à plusieurs projets (N-N via TeamProject).
 */
export type TeamMemberRoleDTO = 'LEAD' | 'MEMBER'

export interface TeamMemberDTO {
  id: string
  userId: string
  role: TeamMemberRoleDTO
  joinedAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    pdpUrl?: string
  }
}

export interface TeamProjectDTO {
  id: string
  projectId: string
  addedAt: string
  project: {
    id: string
    key: string
    name: string
  }
}

export interface TeamSummaryDTO {
  id: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
  createdById: string
  memberCount: number
  projectCount: number
}

export interface TeamDetailDTO extends TeamSummaryDTO {
  members: TeamMemberDTO[]
  projects: TeamProjectDTO[]
}

export interface TeamListResponseDTO {
  success: true
  data: TeamSummaryDTO[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface TeamCreateDTO {
  name: string
  description?: string | null
  memberIds?: string[]
  projectIds?: string[]
}

export interface TeamUpdateDTO {
  name?: string
  description?: string | null
}

export interface TeamAddMembersDTO {
  userIds: string[]
}

export interface TeamUpdateMemberRoleDTO {
  role: TeamMemberRoleDTO
}

export interface TeamAddProjectsDTO {
  projectIds: string[]
}
