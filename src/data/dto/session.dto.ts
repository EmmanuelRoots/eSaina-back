import { UserDTO } from "./user.dto"

export interface SessionDTO {
  id : string   
  refreshToken : string   
  userId : string
  user : UserDTO          
  deviceInfo? : string // "iPhone 12", "Chrome Windows", etc.
  expiresAt :  string | null;
  createdAt :  string | null
}