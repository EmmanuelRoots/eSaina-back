import { UserDTO } from "./user.dto"

export interface RoleDTO {
  id? : string
  name : string
  authorizations : any[]
  members : UserDTO[]
}