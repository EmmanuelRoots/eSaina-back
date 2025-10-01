export interface UserDTO {
  uuid?: string
  email: string
  password?: string
  lastName: string
  firstName: string
  roleId?: string
  createdAt?: Date
  phoneNumber: string
  birthDate?: number
  active?: boolean
}

export interface PartialUserDTO {
  email?: string,
  password?: string
  name?: string
  roleId: string
  createdAt?: number
  lastConnexion?: number
  phoneNumber?: string
  birthDate?: number
  male?: boolean
  active?: boolean
  age?: number
  enterprise?: string | null
  rib?: string | null
  signature?: string | null
  customizedField?: string | null
}
