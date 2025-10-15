import { ConversationDTO } from "./conversation.dto"
import { UserDTO } from "./user.dto"

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE'
}

export enum SenderType {
  SYSTEM = 'SYSTEM',
  AI = 'AI',
  USER = 'USER'
}

export interface MessageDTO {
  content : string
  type : MessageType
  sender : SenderType
  conversation : ConversationDTO
  user : UserDTO
}