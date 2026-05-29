import { RoleDTO } from './role.dto'

/**
 * Représentation d'un utilisateur exposée dans la console d'administration.
 * Le mot de passe n'est jamais sérialisé.
 */
export interface AdminUserListItemDTO {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  birthDate?: string | null
  pdpUrl?: string
  active: boolean
  createdAt: string
  roleId: string
  role?: RoleDTO
}

export interface AdminUserListResponseDTO {
  success: true
  data: AdminUserListItemDTO[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface AdminUserUpdateDTO {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  birthDate?: string | null
  roleId?: string
  active?: boolean
}

export interface AdminUserResetPasswordDTO {
  password: string
}
