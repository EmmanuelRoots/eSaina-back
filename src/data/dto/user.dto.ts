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
