import { ConversationDTO } from './conversation.dto'
import { MessageDTO } from './message.dto'

export interface UserDTO {
  id?: string
  email: string
  password?: string
  lastName: string
  firstName: string
  createdAt?: string
  phoneNumber: string
  birthDate?: string | null
  active?: boolean
  conversations?: ConversationDTO[]
  messaages?: MessageDTO[]
  pdpUrl?: string
  roleId: string
}

export interface UserRequestDTO {
  uuid?: string
  email: string
  password?: string
  lastName: string
  firstName: string
  createdAt?: string
  phoneNumber: string
  birthDate?: string | null
  active?: boolean
  roleId: string
}

export interface SubscribeDTO {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  birthDate?: string | null
  deviceInfo?: string
}
