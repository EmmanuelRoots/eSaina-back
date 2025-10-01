export interface UserDTO {
  uuid?: string
  email: string
  password?: string
  lastName: string
  firstName: string
  roleId?: string
  createdAt?: string
  phoneNumber: string
  birthDate?: string | null
  active?: boolean
}
