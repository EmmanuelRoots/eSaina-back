import { MessageDTO } from "./message.dto"

export enum ConversationType {
  REGULAR = 'REGULAR',
  AI_CHAT = 'AI_CHAT'
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface ConversationDTO {
  title? : string
  type : ConversationType
  userId : string
  ownerId : string
  messages : MessageDTO []
  members : ConversationMember []
}

export interface ConversationMember {
  id : string
  conversationId: string
  userId :string
  role : MemberRole
  joinedAt : string
}

