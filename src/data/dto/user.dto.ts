import { ConversationDTO } from "./conversation.dto"
import { MessageDTO } from "./message.dto"

export interface UserDTO {
  uuid?: string
  email: string
  password?: string
  lastName: string
  firstName: string
  createdAt?: string
  phoneNumber: string
  birthDate?: string | null
  active?: boolean
  conversations? : ConversationDTO []
  messaages? : MessageDTO []
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
}
